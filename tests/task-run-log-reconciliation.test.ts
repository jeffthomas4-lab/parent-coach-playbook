import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const reconciliation = readFileSync('automation/TASK-RUN-LOG-RECONCILIATION.md', 'utf8');
const taskIds = [
  'org-discovery-daily-worklist',
  'pcd-deletion-monitor',
  'pcd-link-health-monitor',
  'weekly-gsc-review',
  'pcd-rules-watcher',
  'pcd-friday-letter-draft',
  'pcd-camps-data-steward',
  'pcd-seasonal-content-scheduler',
  'pcd-affiliate-reconciler',
  'pcd-freshness-audit',
];

describe('scheduled-task run-log reconciliation', () => {
  it('enumerates every PCD-owned scheduled task exactly once', () => {
    for (const taskId of taskIds) {
      expect(reconciliation.split(`| \`${taskId}\` |`)).toHaveLength(2);
    }
    expect(reconciliation).not.toContain('pending-inventory');
  });

  it('does not manufacture runtime execution evidence', () => {
    expect(reconciliation.match(/\| pending \| pending \| pending \|/g)).toHaveLength(taskIds.length);
    expect(reconciliation).toMatch(/does not claim that the external scheduled-task copies have been\s+updated/);
    expect(reconciliation).toContain('never print or paste the value');
  });
});
