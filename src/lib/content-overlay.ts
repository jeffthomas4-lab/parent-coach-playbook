// Inline editor: the KV overlay store.
//
// DESIGN RULE, load-bearing: the overlay is ADDITIVE. Every editable region
// ships an in-repo fallback string. If KV is empty, cold, misconfigured,
// unreachable, or deliberately switched off, the page renders exactly as it
// does today from that fallback. Nothing here is allowed to throw into a
// request path. A read failure is a miss, not an error.
//
// That property is what makes the kill switch (CONTENT_OVERLAY_ENABLED=false)
// a genuine one-variable rollback rather than an outage.

import { isRegisteredRegion, allRegionKeys } from './editable-regions';

/** KV key prefix. Namespaced so the binding can be shared later if needed. */
const KEY_PREFIX = 'pcd:overlay:v1:';

/** Key holding the monotonic version stamp, bumped on every successful write. */
const VERSION_KEY = 'pcd:overlay:v1:__version';

export interface OverlayEnv {
  CONTENT_OVERLAY?: KVNamespace;
  CONTENT_OVERLAY_ENABLED?: string;
}

export interface OverlayEntry {
  value: string;
  /** ISO timestamp of the write. */
  updatedAt: string;
  /** Digest of the editor's email, never the address itself. */
  actorDigest: string;
  /** Monotonic per-key counter, used for optimistic-concurrency conflicts. */
  revision: number;
}

/** The overlay is on unless explicitly switched off. Missing binding = off. */
export function overlayEnabled(env?: OverlayEnv): boolean {
  if (!env?.CONTENT_OVERLAY) return false;
  return (env.CONTENT_OVERLAY_ENABLED ?? 'true').toLowerCase() !== 'false';
}

const kvKey = (key: string) => `${KEY_PREFIX}${key}`;

/**
 * Read one region. Returns null on miss, on a disabled overlay, on an
 * unregistered key, or on any KV failure. Callers render their fallback.
 */
export async function readRegion(key: string, env?: OverlayEnv): Promise<OverlayEntry | null> {
  if (!overlayEnabled(env) || !isRegisteredRegion(key)) return null;
  try {
    return await env!.CONTENT_OVERLAY!.get<OverlayEntry>(kvKey(key), 'json');
  } catch (error) {
    console.warn('[content-overlay] read failed, falling back to repo value', { key, error: String(error) });
    return null;
  }
}

export interface AllRegions {
  /** key -> stored value. Absent keys keep their in-repo fallback. */
  values: Map<string, string>;
  /** key -> current revision, so an editor can send a correct expectedRevision. */
  revisions: Map<string, number>;
}

/**
 * Read every registered region in one pass, for the HTMLRewriter transform.
 *
 * Missing keys are simply absent from the maps, and the rewriter leaves those
 * elements alone, so they keep their repo fallback.
 *
 * Deliberately tolerant: one bad entry does not poison the batch, and a total
 * failure returns empty maps rather than throwing into the request path.
 */
export async function readAllRegions(env?: OverlayEnv): Promise<AllRegions> {
  const values = new Map<string, string>();
  const revisions = new Map<string, number>();
  if (!overlayEnabled(env)) return { values, revisions };

  try {
    const entries = await Promise.all(
      allRegionKeys().map(async (key) => {
        try {
          const entry = await env!.CONTENT_OVERLAY!.get<OverlayEntry>(kvKey(key), 'json');
          return [key, entry] as const;
        } catch {
          return [key, null] as const;
        }
      }),
    );
    for (const [key, entry] of entries) {
      if (entry && typeof entry.value === 'string') {
        values.set(key, entry.value);
        revisions.set(key, typeof entry.revision === 'number' ? entry.revision : 0);
      }
    }
  } catch (error) {
    console.warn('[content-overlay] bulk read failed, serving repo values', { error: String(error) });
    return { values: new Map(), revisions: new Map() };
  }
  return { values, revisions };
}

/**
 * Write a region. Callers must have already: verified admin identity, checked
 * the manifest allowlist, and run the value through sanitize(). This function
 * does not re-validate content; it is the storage layer, not the gate.
 *
 * `expectedRevision` gives optimistic concurrency. Pass the revision the editor
 * loaded with; a mismatch means someone else saved in between and the caller
 * should surface a conflict rather than clobber.
 */
export async function writeRegion(
  key: string,
  value: string,
  actorDigest: string,
  env: OverlayEnv,
  expectedRevision?: number,
): Promise<{ ok: true; entry: OverlayEntry } | { ok: false; code: 'conflict' | 'disabled' | 'write_failed'; current?: OverlayEntry | null }> {
  if (!overlayEnabled(env)) return { ok: false, code: 'disabled' };

  const current = await readRegion(key, env);
  if (expectedRevision !== undefined && (current?.revision ?? 0) !== expectedRevision) {
    return { ok: false, code: 'conflict', current };
  }

  const entry: OverlayEntry = {
    value,
    updatedAt: new Date().toISOString(),
    actorDigest,
    revision: (current?.revision ?? 0) + 1,
  };

  try {
    await env.CONTENT_OVERLAY!.put(kvKey(key), JSON.stringify(entry));
    await env.CONTENT_OVERLAY!.put(VERSION_KEY, String(Date.now()));
  } catch (error) {
    // Surfaced to the client as a failure. The editor must NOT show "Saved".
    console.error('[content-overlay] write failed', { key, error: String(error) });
    return { ok: false, code: 'write_failed' };
  }

  return { ok: true, entry };
}

/**
 * Delete a region's override, returning the page to its repo fallback.
 * This is the per-region revert-to-original path.
 */
export async function clearRegion(key: string, env: OverlayEnv): Promise<boolean> {
  if (!overlayEnabled(env)) return false;
  try {
    await env.CONTENT_OVERLAY!.delete(kvKey(key));
    await env.CONTENT_OVERLAY!.put(VERSION_KEY, String(Date.now()));
    return true;
  } catch (error) {
    console.error('[content-overlay] delete failed', { key, error: String(error) });
    return false;
  }
}

/** Current overlay version stamp. Used as a cache-busting token. */
export async function overlayVersion(env?: OverlayEnv): Promise<string> {
  if (!overlayEnabled(env)) return '0';
  try {
    return (await env!.CONTENT_OVERLAY!.get(VERSION_KEY)) ?? '0';
  } catch {
    return '0';
  }
}
