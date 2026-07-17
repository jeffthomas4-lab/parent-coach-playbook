import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const contract = JSON.parse(fs.readFileSync(path.join(root, 'automation/unsafe-html-contract.json'), 'utf8'));

function astroFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? astroFiles(full) : entry.name.endsWith('.astro') ? [full] : [];
  });
}

describe('dynamic HTML sink contract', () => {
  const files = astroFiles(path.join(root, 'src'));

  it('does not bypass the shared encoded title renderer', () => {
    const bypasses = files.filter((file) => {
      const source = fs.readFileSync(file, 'utf8');
      return /\.replace\(\/\\\*\(\[\^\*\]\+\)\\\*\/g,\s*['"]<em>\$1<\/em>['"]\)/.test(source);
    });
    expect(bypasses.map((file) => path.relative(root, file).replaceAll('\\', '/'))).toEqual([]);
  });

  it('requires every innerHTML sink to remain explicitly reviewed', () => {
    const actual = files
      .filter((file) => fs.readFileSync(file, 'utf8').includes('.innerHTML'))
      .map((file) => path.relative(root, file).replaceAll('\\', '/'))
      .sort();
    expect(actual).toEqual(Object.keys(contract.reviewed_inner_html_files).sort());
  });

  it('keeps server-built HTML-string exceptions explicit', () => {
    for (const relative of Object.keys(contract.reviewed_html_string_files)) {
      const source = fs.readFileSync(path.join(root, relative), 'utf8');
      expect(source).toContain('set:html');
      expect(source).toContain('escHtml');
    }
  });
});
