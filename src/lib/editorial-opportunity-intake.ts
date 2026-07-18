// Provider-neutral opportunity-intake layer for the editorial lifecycle.
//
// Every signal source in editorial-governance.json's `opportunity_sources`
// list is represented by an OpportunitySignalAdapter. An adapter's job is to
// turn whatever raw evidence it has access to into already-aggregated,
// bounded RawOpportunitySignal objects -- never a raw search query, a
// support-ticket transcript, or any child/family identifying data. Every
// signal, from any adapter, still passes through sanitizeOpportunitySignal
// before a caller may store it, mirroring the write-time sanitization gate
// used for demand telemetry (see demand-telemetry.ts).
//
// Only two adapters are wired to real data in this slice: demand (reusing
// the existing privacy-minimized demand_events_v1 aggregate) and correction
// (reusing the existing public corrections log). The remaining sources need
// their own data connection or provider credentials -- GSC, competitor
// observation, seasonal/camp-gap analysis, affiliate-gap analysis, newsletter
// reply themes, support-case themes, and emerging-trend scanning -- and are
// intentionally left unimplemented rather than faked. Wiring any of them to
// a live external provider is a separate, explicitly Jeff-approved step.

import type { Correction } from '../data/corrections';
import { annotateDemandCoverage, listDemandOpportunities, type ContentCoverageItem } from './demand-reporting';

const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/giu;
const PHONE = /(?<!\d)(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?!\d)/g;
const CONTROL = new RegExp('[\u0000-\u001f\u007f-\u009f]', 'g');

export const MAX_SIGNAL_SUMMARY_LENGTH = 500;
export const MAX_TARGET_KEYWORD_LENGTH = 200;

export const OPPORTUNITY_SOURCES = [
  'search', 'no_result', 'gsc', 'camp_gap', 'affiliate_gap', 'seasonal',
  'newsletter', 'support', 'correction', 'competitor', 'emerging_trend',
] as const;
export type OpportunitySource = typeof OPPORTUNITY_SOURCES[number];

export const OPPORTUNITY_CONTENT_TYPES = [
  'pillar', 'guide', 'article', 'directory', 'comparison', 'newsletter', 'correction',
] as const;
export type OpportunityContentType = typeof OPPORTUNITY_CONTENT_TYPES[number];

export interface RawOpportunitySignal {
  source: OpportunitySource;
  /** Free-text description from the adapter. May contain material that still needs redaction. */
  summary: string;
  /** Pointer to the aggregate artifact/report backing this signal -- never the raw content itself. */
  ref?: string;
  contentTypeHint?: string;
  targetKeywordHint?: string;
}

export interface SanitizedOpportunitySignal {
  source: OpportunitySource;
  signalSummary: string;
  signalRef: string | null;
  contentType: OpportunityContentType | null;
  targetKeyword: string | null;
  redacted: boolean;
}

function redact(value: string): { value: string; redacted: boolean } {
  let redacted = false;
  let out = value.normalize('NFKC').replace(CONTROL, ' ');
  const replace = (pattern: RegExp, token: string) => {
    out = out.replace(pattern, () => {
      redacted = true;
      return token;
    });
  };
  replace(EMAIL, '[email]');
  replace(URL_PATTERN, '[url]');
  replace(PHONE, '[phone]');
  return { value: out.replace(/\s+/g, ' ').trim(), redacted };
}

/**
 * Write-time privacy gate every adapter's output must pass through. Returns
 * null when the raw signal has no usable summary after sanitization.
 */
export function sanitizeOpportunitySignal(raw: RawOpportunitySignal): SanitizedOpportunitySignal | null {
  if (!OPPORTUNITY_SOURCES.includes(raw.source)) return null;
  if (typeof raw.summary !== 'string') return null;
  const { value: signalSummary, redacted } = redact(raw.summary);
  const bounded = signalSummary.slice(0, MAX_SIGNAL_SUMMARY_LENGTH);
  if (!bounded) return null;

  const contentType = raw.contentTypeHint && (OPPORTUNITY_CONTENT_TYPES as readonly string[]).includes(raw.contentTypeHint)
    ? raw.contentTypeHint as OpportunityContentType
    : null;

  let targetKeyword: string | null = null;
  if (typeof raw.targetKeywordHint === 'string') {
    const { value } = redact(raw.targetKeywordHint);
    targetKeyword = value.slice(0, MAX_TARGET_KEYWORD_LENGTH) || null;
  }

  const signalRef = typeof raw.ref === 'string' ? raw.ref.trim().slice(0, 200) || null : null;

  return { source: raw.source, signalSummary: bounded, signalRef, contentType, targetKeyword, redacted };
}

export interface OpportunitySignalAdapter {
  source: OpportunitySource;
  name: string;
  /**
   * Returns already-aggregated, privacy-safe candidate signals. Must never
   * return a raw per-user row, a raw search query string, or any child or
   * family identifying data. Callers still run every result through
   * sanitizeOpportunitySignal before storage.
   */
  collect(): Promise<RawOpportunitySignal[]>;
}

/**
 * Real adapter: reuses the existing privacy-minimized demand_events_v1
 * aggregate (see demand-telemetry.ts / demand-reporting.ts) rather than
 * calling any external provider. Zero-result queries become 'no_result'
 * signals; recurring searches without current coverage become 'search'
 * signals. The underlying query text was already redacted and bucketed at
 * collection time by sanitizeDemandQuery -- this adapter only re-bounds it.
 */
export function demandOpportunityAdapter(
  db: D1Database,
  coverage: ContentCoverageItem[],
  now: string,
  limit = 20,
): OpportunitySignalAdapter {
  return {
    source: 'no_result',
    name: 'demand_events_v1',
    async collect(): Promise<RawOpportunitySignal[]> {
      const demand = await listDemandOpportunities(db, now, limit);
      const governed = annotateDemandCoverage(demand, coverage);
      return governed
        .filter((item) => item.coverage_status !== 'current')
        .map((item): RawOpportunitySignal => ({
          source: item.zero_result_searches > 0 ? 'no_result' : 'search',
          summary: `"${item.query}" -- ${item.searches} searches, ${item.zero_result_searches} zero-result, last seen ${item.last_seen_at}, coverage ${item.coverage_status}`,
          ref: `demand_events_v1:${item.query}`,
          targetKeywordHint: item.query,
        }));
    },
  };
}

/**
 * Real adapter: reuses the existing public corrections log
 * (src/data/corrections.ts). A correction often signals the surrounding
 * piece needs a fuller freshness pass, not just the point fix already
 * shipped -- so each correction becomes a candidate maintenance/refresh
 * opportunity signal.
 */
export function correctionOpportunityAdapter(corrections: readonly Correction[]): OpportunitySignalAdapter {
  return {
    source: 'correction',
    name: 'corrections_log',
    async collect(): Promise<RawOpportunitySignal[]> {
      return corrections.map((entry): RawOpportunitySignal => ({
        source: 'correction',
        summary: `${entry.piece} corrected ${entry.date}: ${entry.change}`,
        ref: `correction:${entry.url}`,
        contentTypeHint: 'article',
      }));
    },
  };
}

class NotImplementedAdapterError extends Error {
  constructor(source: OpportunitySource, reason: string) {
    super(`opportunity intake adapter for "${source}" is not implemented: ${reason}`);
    this.name = 'NotImplementedAdapterError';
  }
}

/**
 * Sources with no wired data connection yet. Each throws with the specific
 * external dependency it needs rather than silently returning no signals
 * (which would look identical to "checked, found nothing").
 */
const UNIMPLEMENTED_REASONS: Record<Exclude<OpportunitySource, 'no_result' | 'search' | 'correction'>, string> = {
  gsc: 'requires Google Search Console API credentials and an approved read-only integration',
  camp_gap: 'requires a governed age/season/geography coverage-gap query over the camps directory, not yet built',
  affiliate_gap: 'requires wiring the existing affiliate inventory report (report:affiliates) into a runtime-readable aggregate',
  seasonal: 'requires a governed seasonal calendar coverage-gap query, not yet built',
  newsletter: 'requires a reviewed, privacy-safe aggregate of newsletter reply/reply-click themes from the hosted provider',
  support: 'requires a privacy-safe theming layer over trust_cases that excludes requester identity and free-text PII, not yet built',
  competitor: 'requires an approved competitor-observation source and review workflow',
  emerging_trend: 'requires an approved trend-scanning source and review workflow',
};

export function unimplementedOpportunityAdapter(source: keyof typeof UNIMPLEMENTED_REASONS): OpportunitySignalAdapter {
  return {
    source,
    name: `${source}_unimplemented`,
    async collect(): Promise<RawOpportunitySignal[]> {
      throw new NotImplementedAdapterError(source, UNIMPLEMENTED_REASONS[source]);
    },
  };
}
