// Policy and tuning constants for the competitor intelligence subsystem.
//
// Every number that governs how aggressively the sweep crawls, or how
// confident a detection has to be before it writes real data, lives here so
// the whole policy can be read and tuned in one place instead of hunting
// through fetcher.ts, store.ts, scoring.ts, and pipeline.ts.
//
// The one hard rule this file exists to enforce in code, not in a doc: a
// scheduled run never fetches a competitor-owned property, and it never
// fetches anything at all without a real, contactable identity. See
// policyFromEnv and isCompetitorProperty below.

import type { CompetitorDefinition } from './fingerprints';

/** Bumped whenever the scoring formula in scoring.ts changes shape. */
export const INTEL_SCORING_VERSION = 1;

/** A detection at or above this confidence writes straight to org_tech_stack. */
export const AUTO_ACCEPT_CONFIDENCE = 60;

/** A detection at or above this (and below AUTO_ACCEPT_CONFIDENCE) goes to intel_review_queue. */
export const REVIEW_CONFIDENCE = 25;

// Below REVIEW_CONFIDENCE a detection is logged as a signal only; nothing else happens.

/** Default number of organizations claimed per cron tick. */
export const DEFAULT_SWEEP_LIMIT = 40;

/** An org whose domain was fetched more recently than this is skipped by the fetcher. */
export const RECHECK_AFTER_DAYS = 45;

const DEFAULT_MAX_REQUESTS_PER_MINUTE_PER_DOMAIN = 6;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 1_500_000;

export interface IntelPolicy {
  userAgent: string;
  operatorContact: string;
  maxRequestsPerMinutePerDomain: number;
  timeoutMs: number;
  maxBytes: number;
  allowCompetitorProperties: boolean;
}

/**
 * Builds the crawl policy from environment/secret bindings.
 *
 * userAgent and operatorContact have no safe default. A run started with
 * either missing gets empty strings back here, and fetchPublicPage refuses
 * to run rather than send an unidentified or uncontactable bot at someone
 * else's server. Degrading to a made-up user-agent would be worse than
 * refusing outright, so this is the one deliberate place a policy is
 * allowed to come back "incomplete" instead of silently falling back.
 *
 * allowCompetitorProperties is always false here, and no code path anywhere
 * in this subsystem is allowed to flip it true. There is no reviewed
 * target-list mechanism for a competitor-owned property, so even a human-
 * approved 'competitor_property' run is refused before it executes (see
 * runApprovedRun in pipeline.ts) rather than being handed a policy that
 * unlocks fetching one.
 */
export function policyFromEnv(env: Record<string, unknown>): IntelPolicy {
  const userAgent = typeof env.INTEL_USER_AGENT === 'string' ? env.INTEL_USER_AGENT.trim() : '';
  const operatorContact = typeof env.INTEL_OPERATOR_CONTACT === 'string' ? env.INTEL_OPERATOR_CONTACT.trim() : '';
  return {
    userAgent,
    operatorContact,
    maxRequestsPerMinutePerDomain: DEFAULT_MAX_REQUESTS_PER_MINUTE_PER_DOMAIN,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    maxBytes: DEFAULT_MAX_BYTES,
    allowCompetitorProperties: false,
  };
}

/** The scheduled sweep is off unless an operator explicitly turns it on. */
export function isFeatureEnabled(env: Record<string, unknown>): boolean {
  return env.INTEL_SWEEP_ENABLED === 'true';
}

/**
 * True when hostname is a competitor's own canonical domain, or a subdomain
 * of it (e.g. "app.sportsgravy.com" counts as the "sportsgravy.com"
 * property). Matching is exact-or-subdomain, never a substring match, so a
 * prospect org named "sportsgravyyouthsoccer.org" is not mistaken for the
 * competitor's own site.
 */
export function isCompetitorProperty(hostname: string, definitions: CompetitorDefinition[]): boolean {
  const host = hostname.toLowerCase();
  return definitions.some((definition) => {
    const domain = definition.canonicalDomain?.toLowerCase();
    if (!domain) return false;
    return host === domain || host.endsWith(`.${domain}`);
  });
}

/**
 * The registrable domain for a URL: lowercase hostname with a leading
 * "www." stripped. Shared by the fetcher (which keys intel_fetch_log rows
 * on this value) and the store (which ranks sweep candidates by the same
 * key), so a domain computed in one place always matches the other.
 */
export function registrableDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, '');
    return host || null;
  } catch {
    return null;
  }
}
