/*
 * Inline editor client.
 *
 * Served from /admin/inline-editor.js, which sits behind Cloudflare Access and
 * the Worker admin gate, so a public visitor gets a 403 rather than this file.
 * It is injected into a page only when the Worker has already resolved a
 * verified admin identity for that request (see src/lib/overlay-rewriter.ts).
 *
 * Nothing here is trusted. The server re-checks identity, the manifest
 * allowlist, and the value on every save.
 *
 * THE ONE RULE: never tell the user "Saved" unless the server returned ok:true.
 * Every other branch, including a dropped connection, says something else.
 *
 * Pillar 13 item 1 states: idle, editing, saving, saved, conflict,
 * validation-rejected, auth-expired, receipt-failed, write-failed, offline,
 * connection-lost.
 */
(() => {
  'use strict';

  if (window.__pcdInlineEditorLoaded) return;
  window.__pcdInlineEditorLoaded = true;

  const REGION_SELECTOR = '[data-pcd-editable]';

  /** Revision each region was loaded with. Drives conflict detection. */
  const loadedRevision = new Map();
  /** Original markup, so Escape is a true cancel. */
  const original = new Map();

  let editing = false;
  let statusTimer;

  const regions = () => Array.from(document.querySelectorAll(REGION_SELECTOR));

  // --- Toolbar -------------------------------------------------------------

  const root = document.createElement('div');
  root.id = 'pcd-editor-root';
  root.innerHTML = [
    '<div class="pcd-ed-bar" role="toolbar" aria-label="Inline editor">',
    '  <button type="button" class="pcd-ed-toggle" aria-pressed="false">Edit page</button>',
    '  <span class="pcd-ed-hint">Alt+E &middot; Cmd+S saves &middot; Esc cancels</span>',
    '  <output class="pcd-ed-status" role="status" aria-live="polite"></output>',
    '</div>',
  ].join('');
  document.body.appendChild(root);

  const toggle = root.querySelector('.pcd-ed-toggle');
  const statusEl = root.querySelector('.pcd-ed-status');

  function status(message, tone, holdMs) {
    statusEl.textContent = message;
    if (tone) statusEl.setAttribute('data-tone', tone);
    else statusEl.removeAttribute('data-tone');
    window.clearTimeout(statusTimer);
    const hold = holdMs === undefined ? 4000 : holdMs;
    if (hold > 0) {
      statusTimer = window.setTimeout(() => {
        statusEl.textContent = '';
        statusEl.removeAttribute('data-tone');
      }, hold);
    }
  }

  // --- Mode ----------------------------------------------------------------

  function setEditing(next) {
    editing = next;
    document.body.classList.toggle('pcd-editing', next);
    toggle.setAttribute('aria-pressed', String(next));
    toggle.textContent = next ? 'Done editing' : 'Edit page';

    regions().forEach((el) => {
      const key = el.getAttribute('data-pcd-editable');
      if (next) {
        original.set(key, el.innerHTML);
        // plaintext-only keeps the browser from pasting arbitrary markup in.
        el.setAttribute('contenteditable', 'plaintext-only');
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'textbox');
        el.setAttribute('aria-label', 'Edit: ' + (el.getAttribute('data-pcd-label') || key));
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
        el.removeAttribute('data-pcd-dirty');
      }
    });

    status(next ? 'Edit mode on. Click any highlighted text.' : 'Edit mode off', null, 2500);
  }

  function readValue(el) {
    return el.getAttribute('data-pcd-kind') === 'richInline'
      ? el.innerHTML
      : (el.textContent || '');
  }

  // --- Save ----------------------------------------------------------------

  async function save(el) {
    const key = el.getAttribute('data-pcd-editable');
    const label = el.getAttribute('data-pcd-label') || key;
    const value = readValue(el);
    const max = Number(el.getAttribute('data-pcd-max') || '0');

    // Client-side checks are UX. The server runs its own, and its answer wins.
    if (!value.trim()) {
      status('That cannot be blank. Press Escape to restore the original.', 'error');
      return;
    }
    if (max > 0 && value.length > max) {
      status('Too long. "' + label + '" allows ' + max + ' characters.', 'error');
      return;
    }
    if (!navigator.onLine) {
      status('You are offline. Nothing was saved.', 'error', 8000);
      return;
    }

    status('Saving...', null, 0);
    el.setAttribute('aria-busy', 'true');

    let res;
    try {
      res = await fetch('/admin/api/content/' + encodeURIComponent(key), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ value: value, expectedRevision: loadedRevision.get(key) || 0 }),
      });
    } catch (_) {
      el.removeAttribute('aria-busy');
      // The request may or may not have landed. Saying either would be a lie.
      status('Connection lost. This may not have saved. Reload to check.', 'error', 0);
      return;
    }

    el.removeAttribute('aria-busy');

    if (res.status === 401 || res.status === 403) {
      status('Your admin session expired. Reload and sign in again.', 'error', 0);
      return;
    }

    let body = null;
    try { body = await res.json(); } catch (_) { /* falls through */ }

    if (!body || typeof body.ok !== 'boolean') {
      status('That did not save. Nothing was published.', 'error', 0);
      return;
    }

    if (body.ok === true) {
      loadedRevision.set(key, body.revision);
      original.set(key, el.innerHTML);
      el.removeAttribute('data-pcd-dirty');
      el.setAttribute('data-pcd-overlaid', 'true');
      status('Saved. Live now.', 'ok');
      return;
    }

    // Everything below is a failure path. None of it says "Saved".
    switch (body.code) {
      case 'conflict':
        status('Someone else edited this. Their version is now shown.', 'warn', 0);
        if (typeof body.current === 'string') {
          el.innerHTML = body.current;
          original.set(key, body.current);
          loadedRevision.set(key, body.currentRevision || 0);
        }
        break;
      case 'receipt_failed':
        status('Rolled back. The change could not be recorded.', 'error', 0);
        el.innerHTML = original.get(key) || el.innerHTML;
        break;
      case 'receipts_unavailable':
        status('Cannot record changes right now, so nothing was saved.', 'error', 0);
        el.innerHTML = original.get(key) || el.innerHTML;
        break;
      case 'overlay_disabled':
        status('Inline editing is switched off right now.', 'warn', 0);
        break;
      case 'unknown_region':
        status('This region is no longer editable.', 'error', 0);
        break;
      case 'write_failed':
        status('That change did not save. Nothing was published.', 'error', 0);
        break;
      default:
        // Validation rejections carry a safe, specific message from the server.
        status(body.message || 'That change was rejected.', 'error', 8000);
    }
  }

  // --- Revert to the in-repo original --------------------------------------

  async function revert(el) {
    const key = el.getAttribute('data-pcd-editable');
    status('Reverting...', null, 0);
    try {
      const res = await fetch('/admin/api/content/' + encodeURIComponent(key), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const body = await res.json().catch(() => null);
      if (body && body.ok) {
        status('Reverted to the original. Reload to see it.', 'ok', 8000);
      } else {
        status('That revert did not go through.', 'error', 0);
      }
    } catch (_) {
      status('Connection lost. The revert may not have applied.', 'error', 0);
    }
  }

  // --- Wiring --------------------------------------------------------------

  toggle.addEventListener('click', () => setEditing(!editing));

  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      setEditing(!editing);
      return;
    }
    if (!editing) return;

    const el = document.activeElement;
    if (!el || !el.hasAttribute || !el.hasAttribute('data-pcd-editable')) return;

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      revert(el);
    } else if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      save(el);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const key = el.getAttribute('data-pcd-editable');
      el.innerHTML = original.get(key) || el.innerHTML;
      el.removeAttribute('data-pcd-dirty');
      el.blur();
      status('Discarded your unsaved edit', null, 2500);
    }
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (editing && el && el.hasAttribute && el.hasAttribute('data-pcd-editable')) {
      el.setAttribute('data-pcd-dirty', 'true');
    }
  });

  window.addEventListener('offline', () => status('Offline. Changes will not save.', 'warn', 0));
  window.addEventListener('online', () => status('Back online.', 'ok', 2500));

  window.addEventListener('beforeunload', (e) => {
    const dirty = regions().some((el) => el.getAttribute('data-pcd-dirty') === 'true');
    if (editing && dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Seed revisions from what the Worker rendered, so the first save carries the
  // right expectedRevision instead of racing to 0.
  regions().forEach((el) => {
    const rev = Number(el.getAttribute('data-pcd-revision') || '0');
    loadedRevision.set(el.getAttribute('data-pcd-editable'), rev);
  });
})();
