import { execFileSync, spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sourceFiles, workspace } from './documentation-inputs.mjs';
import {
  assertPreparationProof,
  cachedPreparationStage,
  contentSnapshot,
} from './documentation-preparation-cache.mjs';

export function runDocs(args, env = {}) {
  const result = spawnSync('pnpm', ['--filter', '@workspace/docs', ...args], {
    cwd: workspace,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`验收失败：pnpm ${args.join(' ')}；不生成新证据。`);
}

const packages = [
  'ui',
  'foundation-integration',
  'icons',
  'icons-lab',
  'illustrations',
  'theme-default',
];
const sharedInputs = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.npmrc',
  'tsconfig*.json',
  '.prettierrc*',
  '.prettierignore',
  'apps/docs/package.json',
  'apps/docs/scripts/documentation-pipeline.mjs',
  'apps/docs/scripts/documentation-preparation-cache.mjs',
  'apps/docs/scripts/documentation-inputs.mjs',
];
const generatedRegistries = ['demos', 'pages', 'tokens'].map(
  (name) => `apps/docs/src/data/${name}.json`,
);
const siteInputs = [
  ...sharedInputs,
  'apps/docs/src',
  'apps/docs/content',
  'apps/docs/public',
  'apps/docs/licenses',
  'apps/docs/*.config.*',
  'apps/docs/tsconfig.json',
  'apps/docs/*.d.ts',
  'apps/docs/.nuxtrc',
  'apps/docs/.config',
  'apps/docs/modules',
  'apps/docs/layers',
  'apps/docs/server',
  'apps/docs/shared',
  'apps/docs/scripts/*-loader.mjs',
  'patches/@nuxt__rspack-builder@4.5.2.patch',
  ...['content', 'static', 'notices'].map((name) => `apps/docs/scripts/prepare-${name}.mjs`),
  ...generatedRegistries.map((file) => `:(exclude)${file}`),
  ':(exclude)apps/docs/playwright*.config.*',
];

export function preparationStages(root = workspace) {
  return [
    {
      id: 'resources',
      inputs: () =>
        sourceFiles(
          [
            ...sharedInputs,
            ...packages.map((name) => `packages/${name}`),
            'scripts/generate-*.mjs',
            'scripts/write-compliance-artifacts.mjs',
            'scripts/prune-ui-declarations.mjs',
            'scripts/parity-rsbuild.ts',
            'scripts/parity-build-runtime.*',
            'scripts/upstream-markdown.mjs',
            ...['assets', 'tokens', 'repl'].map((name) => `apps/docs/scripts/prepare-${name}.mjs`),
            'apps/docs/scripts/repl-module-bundles.mjs',
            'apps/docs/scripts/repl-rslib-factories.mjs',
          ],
          root,
        ).filter((file) => {
          if (/\/README(?:\.[^/]+)?$/.test(file)) return false;
          // Match each public package's declaration exclusions.
          if (file.startsWith('packages/ui/src/') && file.endsWith('.test.ts')) return false;
          if (
            /^packages\/(?:icons|icons-lab|illustrations)\/src\/.*\.(?:test|spec)\.ts$/.test(file)
          )
            return false;
          if (file.startsWith('scripts/') || file.startsWith('packages/foundation-integration/'))
            return !/(?:\.(?:test|spec)\.[^/]+$|\/(?:tests|__tests__)\/)/.test(file);
          return true;
        }),
      outputs: [
        ...packages
          .filter((name) => name !== 'foundation-integration')
          .map((name) => `packages/${name}/dist`),
        'apps/docs/public/upstream',
        'apps/docs/public/repl',
        'apps/docs/src/data/tokens.json',
      ],
      commands: [
        ['prepare:packages'],
        ...['assets', 'tokens', 'repl'].map((name) => [
          'exec',
          'node',
          `scripts/prepare-${name}.mjs`,
        ]),
      ],
    },
    {
      id: 'site',
      inputs: () => sourceFiles(siteInputs, root),
      outputs: [
        'apps/docs/.output/public',
        'apps/docs/src/data/demos.json',
        'apps/docs/src/data/pages.json',
        'apps/docs/public/search-index.json',
        'apps/docs/public/sitemap.xml',
      ],
      commands: [
        ['exec', 'node', 'scripts/prepare-content.mjs'],
        ['exec', 'nuxt', 'generate'],
        ['exec', 'node', 'scripts/prepare-static.mjs'],
        ['exec', 'node', 'scripts/prepare-notices.mjs'],
      ],
    },
    {
      id: 'checks',
      // Nuxt's generated app tsconfig includes tests/nuxt; test edits reuse builds,
      // but must still rerun the typecheck that actually consumes those files.
      inputs: () =>
        sourceFiles(
          [
            ...siteInputs.filter((input) => input !== ':(exclude)apps/docs/playwright*.config.*'),
            'apps/docs/tests',
            'apps/docs/test',
            'apps/docs/playwright*.config.*',
            'tests/browser',
            'packages/test-infra',
            'apps/reference-react',
            'apps/docs/scripts/verify-content.mjs',
            'apps/docs/scripts/verify-dist.mjs',
          ],
          root,
        ),
      outputs: ['apps/docs/.nuxt'],
      commands: [['exec', 'nuxt', 'typecheck'], ['check:nuxt:content'], ['check:dist']],
    },
  ];
}

async function preparationContext() {
  const git = (args) =>
    execFileSync('git', ['-C', 'vendor/semi-design', ...args], {
      cwd: workspace,
      encoding: 'utf8',
    }).trim();
  const baseline = git(['rev-parse', 'HEAD']);
  if (baseline !== 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21' || git(['status', '--porcelain']))
    throw new Error('准备复用要求只读、无修改的 Semi Design v2.102.0 submodule。');
  const envFiles = [];
  for (const directory of ['', 'apps/docs'])
    for (const file of await readdir(resolve(workspace, directory)))
      if (/^\.env(?:$|\.)/.test(file)) envFiles.push(directory ? `${directory}/${file}` : file);
  return {
    baseline,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    environment: Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) =>
          /^(?:NODE_ENV$|NODE_OPTIONS$|NUXT_|NITRO_|VITE_|SOURCE_DATE_EPOCH$|TZ$)/.test(key),
        )
        .sort(),
    ),
    installation: await contentSnapshot(
      ['node_modules/.modules.yaml', 'node_modules/.pnpm/lock.yaml', ...envFiles],
      workspace,
    ),
  };
}

/** One orchestration owns checked reuse; there is no unchecked skip-build flag. */
export async function prepareAcceptance(run = runDocs, { stages = [], preparation = {} } = {}) {
  const proofs = {};
  for (const stage of preparationStages()) {
    proofs[stage.id] = await cachedPreparationStage(stage, run, {
      root: workspace,
      cacheDirectory: resolve(workspace, 'apps/docs/.data/documentation-preparation'),
      context: preparationContext,
      proofs,
      stages,
    });
  }
  Object.assign(preparation, proofs);
  await assertPreparationCurrent(preparation);
  // Coverage describes accepted browser evidence, not the static site's build inputs.
  await run(['exec', 'node', 'scripts/prepare-coverage.mjs']);
  return [
    'build:public-js',
    'build:theme',
    'build:nuxt',
    'typecheck:nuxt',
    'check:nuxt:content',
    'check:dist',
  ];
}

export async function assertPreparationCurrent(preparation) {
  if (!preparation?.checks) throw new Error('缺少本轮准备证明，不能验证产物新鲜度。');
  await assertPreparationProof(preparationStages(), preparation, {
    root: workspace,
    context: preparationContext,
  });
}

if (process.argv[1] === import.meta.filename) {
  runDocs(['check:nuxt:evidence']);
  await prepareAcceptance();
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
      // Playwright treats positional file filters as regexes over absolute paths.
      // Anchor the basename so Button cannot also select FloatButton.
      ...batches.map((batch) => `(?:^|/)${batch.spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
      '--reporter=json',
      `--output=${outputDirectory}`,
    ],
    { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: reportFile },
  );
}
