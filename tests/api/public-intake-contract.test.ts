import { describe, expect, it } from 'vitest';
import contract from '../../automation/public-intake-contract.json';

describe('public intake inventory', () => {
  it('classifies unique routes and preserves internal/default-off boundaries', () => {
    const sources = contract.routes.map((route) => route.source);
    expect(new Set(sources).size).toBe(sources.length);
    expect(contract.routes.find((route) => route.source.endsWith('/camps/check.ts'))?.exposure).toBe('internal');
    expect(contract.routes.find((route) => route.source.endsWith('/trust/request.ts'))?.exposure).toBe('default-off');
    expect(contract.routes.find((route) => route.source.endsWith('/reviews/submit.ts'))?.exposure).toBe('default-off');
  });
});
