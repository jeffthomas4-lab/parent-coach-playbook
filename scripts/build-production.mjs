import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('build:production must be run through npm');

const result = spawnSync(process.execPath, [npmCli, 'run', 'build'], {
  env: {
    ...process.env,
    WRANGLER_CONFIG_PATH: 'wrangler.production.jsonc',
  },
  stdio: 'inherit',
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
