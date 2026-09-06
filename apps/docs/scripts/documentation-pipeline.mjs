import { spawnSync } from 'node:child_process';
import { workspace } from './documentation-inputs.mjs';

export function runDocs(args, env = {}) {
  const result = spawnSync('pnpm', ['--filter', '@workspace/docs', ...args], {
    cwd: workspace,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`验收失败：pnpm ${args.join(' ')}；不生成新证据。`);
}

/** One orchestration owns preparation; no user-facing unchecked skip-build flag. */
export function prepareAcceptance(run = runDocs) {
  run(['prepare:site']);
  run(['exec', 'nuxt', 'generate']);
  run(['exec', 'node', 'scripts/prepare-static.mjs']);
  run(['exec', 'node', 'scripts/prepare-notices.mjs']);
  run(['exec', 'nuxt', 'typecheck']);
  run(['check:nuxt:content']);
  run(['check:dist']);
  return [
    'build:public-js',
    'build:theme',
    'build:nuxt',
    'typecheck:nuxt',
    'check:nuxt:content',
    'check:dist',
  ];
}

if (process.argv[1] === import.meta.filename) {
  runDocs(['check:nuxt:evidence']);
  prepareAcceptance();
}
