import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { preparationStages, timedRunner, runBrowserMatrices } from './documentation-pipeline.mjs';
import {
  assertPreparationProof,
  cachedPreparationStage,
} from './documentation-preparation-cache.mjs';

test('整次验收只准备一次公开包/主题，类型检查不再触发准备', async () => {
  const commands = preparationStages().flatMap((stage) => stage.commands);
  const { scripts } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const flattened = [];
  function expand(command) {
    if (command.startsWith('pnpm ') && scripts[command.slice(5)])
      for (const step of scripts[command.slice(5)].split(' && ')) expand(step);
    else flattened.push(command);
  }
  for (const args of commands) expand(`pnpm ${args.join(' ')}`);
  assert.equal(flattened.filter((command) => command === 'pnpm -w build:public-js').length, 1);
  assert.equal(
    flattened.filter((command) => command === 'pnpm --filter @aifuxi/semi-theme-default build')
      .length,
    1,
  );
  assert.equal(flattened.filter((command) => command === 'pnpm exec nuxt generate').length, 1);
  assert.equal(flattened.filter((command) => command === 'pnpm exec nuxt typecheck').length, 1);
  assert.ok(commands.some((args) => args[0] === 'check:dist'));
});

async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), 'documentation-preparation-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const calls = [];
  const stages = [];
  let environment = 'node-a';
  const options = {
    root,
    cacheDirectory: resolve(root, 'cache'),
    context: async () => environment,
    stages,
    log: () => {},
  };
  const definitions = ['resources', 'site', 'checks'].map((id) => ({
    id,
    inputs: () => [`inputs/${id}`],
    outputs: [`outputs/${id}`],
    commands: [[id]],
  }));
  async function write(path, value) {
    await mkdir(resolve(root, path, '..'), { recursive: true });
    await writeFile(resolve(root, path), value);
  }
  for (const { id } of definitions) await write(`inputs/${id}/source.txt`, 'first');
  const build = async ([id]) => {
    calls.push(id);
    await write(
      `outputs/${id}/result.txt`,
      await readFile(resolve(root, `inputs/${id}/source.txt`)),
    );
  };
  async function prepare(run = build) {
    const proofs = {};
    for (const stage of definitions)
      proofs[stage.id] = await cachedPreparationStage(stage, run, { ...options, proofs });
    await assertPreparationProof(definitions, proofs, options);
    return proofs;
  }
  return {
    root,
    calls,
    stages,
    write,
    build,
    prepare,
    definitions,
    options,
    changeEnvironment: () => {
      environment = 'node-b';
    },
  };
}

test('内容和产物均未改变时复用成功准备，mtime变化不触发重建', async (t) => {
  const f = await fixture(t);
  await f.prepare();
  await utimes(resolve(f.root, 'inputs/site/source.txt'), 1, 1);
  await utimes(resolve(f.root, 'outputs/site/result.txt'), 2, 2);
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks']);
  assert.deepEqual(
    f.stages.slice(-3).map((entry) => entry.cache),
    ['hit', 'hit', 'hit'],
  );
});

test('同大小同mtime的源码改动仍使对应阶段及下游失效', async (t) => {
  const f = await fixture(t);
  await f.prepare();
  const file = resolve(f.root, 'inputs/site/source.txt');
  const before = await stat(file);
  await writeFile(file, 'other');
  await utimes(file, before.atime, before.mtime);
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'site', 'checks']);
});

test('类型检查输入改动复用两个构建阶段，只重跑检查', async (t) => {
  const f = await fixture(t);
  await f.prepare();
  await f.write('inputs/checks/source.txt', 'changed tests');
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'checks']);
});

for (const mutation of ['missing-file', 'missing-directory', 'changed', 'added']) {
  test(`产物${mutation}自动失效并清理重建，不能混入旧产物`, async (t) => {
    const f = await fixture(t);
    await f.prepare();
    if (mutation === 'missing-file') await rm(resolve(f.root, 'outputs/site/result.txt'));
    if (mutation === 'missing-directory')
      await rm(resolve(f.root, 'outputs/site'), { recursive: true });
    if (mutation === 'changed') await f.write('outputs/site/result.txt', 'corrupt');
    if (mutation === 'added') await f.write('outputs/site/unexpected.js', 'corrupt');
    await f.prepare();
    assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'site']);
    assert.equal(await readFile(resolve(f.root, 'outputs/site/result.txt'), 'utf8'), 'first');
    await assert.rejects(stat(resolve(f.root, 'outputs/site/unexpected.js')), { code: 'ENOENT' });
  });
}

test('构建失败清除旧成功记录，恢复源码和旧产物也不能跳过失败阶段', async (t) => {
  const f = await fixture(t);
  await f.prepare();
  await f.write('inputs/site/source.txt', 'broken');
  const failed = [];
  await assert.rejects(
    f.prepare(async ([id]) => {
      failed.push(id);
      throw new Error('broken build');
    }),
    /broken build/,
  );
  assert.deepEqual(failed, ['site']);
  await assert.rejects(stat(resolve(f.root, 'cache/site.json')), { code: 'ENOENT' });
  await f.write('inputs/site/source.txt', 'first');
  await f.write('outputs/site/result.txt', 'first');
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'site']);
});

test('运行中改源码或未生成产物都不写成功缓存', async (t) => {
  const f = await fixture(t);
  await assert.rejects(
    f.prepare(async (command) => {
      await f.build(command);
      await f.write('inputs/resources/source.txt', 'changed during build');
    }),
    /期间输入发生变化/,
  );
  await assert.rejects(stat(resolve(f.root, 'cache/resources.json')), { code: 'ENOENT' });
  await assert.rejects(
    f.prepare(() => {}),
    /准备产物缺失/,
  );
  await assert.rejects(stat(resolve(f.root, 'cache/resources.json')), { code: 'ENOENT' });
});

test('损坏的缓存记录和运行环境变化都重新准备', async (t) => {
  const f = await fixture(t);
  await f.prepare();
  await f.write('cache/site.json', '{broken');
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'site']);
  f.changeEnvironment();
  await f.prepare();
  assert.deepEqual(f.calls.slice(-3), ['resources', 'site', 'checks']);
});

test('产物与输入证明绑定本轮，后来的成功缓存不能覆盖本轮浏览器依据', async (t) => {
  const f = await fixture(t);
  const first = await f.prepare();
  await f.write('inputs/site/source.txt', 'second build');
  await f.prepare();
  await assert.rejects(
    assertPreparationProof(f.definitions, first, f.options),
    /不能使用本轮浏览器结果/,
  );
});

test('真实准备输入分离文档、测试与验收账本，新增和删除源码均参与内容摘要', async (t) => {
  const f = await fixture(t);
  execFileSync('git', ['init', '-q'], { cwd: f.root });
  const files = [
    'apps/docs/src/demos/example.vue',
    'apps/docs/tests/nuxt/example.spec.ts',
    'apps/docs/public/favicon.svg',
    'apps/docs/licenses/LICENSE',
    'docs/documentation/mappings/example.json',
    'docs/documentation/evidence/example.json',
    'apps/reference-react/src/example.tsx',
    'apps/docs/src/data/pages.json',
    'apps/docs/scripts/prepare-assets.mjs',
    'packages/ui/src/button.ts',
    'scripts/generate-icons.mjs',
    'packages/ui/src/button.test.ts',
    'packages/icons/src/Icon.test.ts',
    'apps/docs/playwright.nuxt.config.ts',
    'packages/test-infra/src/index.ts',
    'apps/docs/scripts/repl-module-bundles.mjs',
  ];
  for (const file of files) await f.write(file, 'source');
  const [resources, site, checks] = preparationStages(f.root);
  assert.ok(resources.inputs().includes('packages/ui/src/button.ts'));
  assert.ok(resources.inputs().includes('apps/docs/scripts/prepare-assets.mjs'));
  assert.ok(resources.inputs().includes('apps/docs/scripts/repl-module-bundles.mjs'));
  assert.ok(resources.inputs().includes('scripts/generate-icons.mjs'));
  assert.ok(!resources.inputs().includes('packages/ui/src/button.test.ts'));
  assert.ok(resources.inputs().includes('packages/icons/src/Icon.test.ts'));
  assert.ok(!resources.inputs().includes(files[0]));
  assert.deepEqual(site.inputs(), [files[3], files[2], files[0]].sort());
  assert.ok(checks.inputs().includes(files[1]));
  assert.ok(checks.inputs().includes(files[6]));
  assert.ok(checks.inputs().includes('apps/docs/playwright.nuxt.config.ts'));
  assert.ok(checks.inputs().includes('packages/test-infra/src/index.ts'));
  assert.ok(!checks.inputs().includes(files[4]));
  assert.ok(!checks.inputs().includes(files[5]));
  await f.prepare();
  await f.write('inputs/site/added.txt', 'new source');
  await f.prepare();
  await rm(resolve(f.root, 'inputs/site/added.txt'));
  await f.prepare();
  assert.deepEqual(f.calls, ['resources', 'site', 'checks', 'site', 'checks', 'site', 'checks']);
});

test('计时记录命令成功和失败并原样抛出错误', () => {
  const entries = [];
  const failure = new Error('build failed');
  let clock = 0;
  const run = timedRunner(
    entries,
    (args) => {
      if (args[0] === 'fail') throw failure;
      return 'ok';
    },
    () => (clock += 100),
    () => {},
  );
  assert.equal(run(['build']), 'ok');
  assert.throws(
    () => run(['fail']),
    (error) => error === failure,
  );
  assert.deepEqual(entries, [
    { command: 'build', durationMs: 100, status: 'passed' },
    { command: 'fail', durationMs: 100, status: 'failed' },
  ]);
});

test('多个批次只启动一次 Playwright，保留正式隔离和默认重试配置', () => {
  const calls = [];
  runBrowserMatrices(
    [{ spec: 'one.spec.ts' }, { spec: 'two.spec.ts' }],
    '/tmp/report.json',
    '/tmp/output',
    (args, env) => calls.push({ args, env }),
  );
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], {
    args: [
      'exec',
      'playwright',
      'test',
      '-c',
      'playwright.nuxt.config.ts',
      'one.spec.ts',
      'two.spec.ts',
      '--reporter=json',
      '--output=/tmp/output',
    ],
    env: { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: '/tmp/report.json' },
  });
});
