import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const skills = [
  'agents/pcd-deletion-monitor/SKILL.md',
  'automation/agents/nora/SKILL.md',
  'automation/agents/ed/SKILL.md',
  'automation/agents/frida/SKILL.md',
  'automation/agents/hal/SKILL.md',
  'automation/agents/ranger/SKILL.md',
  'automation/agents/sunny/SKILL.md',
];

describe('scheduled agent run-log contract', () => {
  it.each(skills)('%s uses the secure caller and runtime secret reference', async (path) => {
    const content = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    expect(content).toContain('scripts/agent-run-client.mjs preflight');
    expect(content).toContain('PCD_AGENT_RUNS_TOKEN');
    expect(content).toContain('writeAgentRun()');
    expect(content).not.toMatch(/Authorization:\s*Bearer|<AGENT_RUNS_TOKEN>|bearer `AGENT_RUNS_TOKEN`/i);
  });

  it('keeps the deletion monitor off direct run-log D1 mutations', async () => {
    const content = await readFile(new URL('../agents/pcd-deletion-monitor/SKILL.md', import.meta.url), 'utf8');
    expect(content).toContain('Do not use direct D1 INSERT or UPDATE statements');
    expect(content).not.toContain('via `d1_database_query` INSERT');
  });
});
