import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');

describe('directory import retry contract', () => {
  for (const file of ['scripts/import-camps-csv.mjs', 'scripts/harvest-jsonld.mjs']) {
    it(`${file} derives and sends a stable content-based operation key`, () => {
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      expect(source).toContain("createHash('sha256')");
      expect(source).toContain("'Idempotency-Key'");
      expect(source).toContain('idempotency_key');
      expect(source).not.toContain('randomUUID');
    });
  }
});
