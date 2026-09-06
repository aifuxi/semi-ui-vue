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

/** Record failed stages too, so timeout/build failures remain measurable. */
export function timedRunner(
  entries,
  run = runDocs,
  now = () => performance.now(),
  log = console.log,
) {
  return (args, env) => {
    const started = now();
    const entry = { command: args.join(' '), durationMs: 0, status: 'failed' };
    try {
      const result = run(args, env);
      entry.status = 'passed';
      return result;
    } finally {
      entry.durationMs = Math.round(now() - started);
      entries.push(entry);
      log(
        `[阶段耗时] ${entry.command}: ${(entry.durationMs / 1000).toFixed(1)}s (${entry.status})`,
      );
    }
  };
}

export function runBrowserMatrices(batches, reportFile, outputDirectory, run = runDocs) {
  run(
    [
      'exec',
      'playwright',
      'test',
      '-c',
      'playwright.nuxt.config.ts',
      ...batches.map((batch) => batch.spec),
      '--reporter=json',
      `--output=${outputDirectory}`,
    ],
    { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: reportFile },
  );
}
