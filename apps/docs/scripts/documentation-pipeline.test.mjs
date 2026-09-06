import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { prepareAcceptance, timedRunner, runBrowserMatrices } from './documentation-pipeline.mjs';

test('整次验收只准备一次公开包/主题，类型检查不再触发准备', async () => {
  const commands = [];
  const checks = prepareAcceptance((args) => commands.push(args));
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
  assert.ok(checks.includes('check:dist'));
});
test('构建失败即停止，不能继续生成成功检查记录', () => {
  const commands = [];
  assert.throws(
    () =>
      prepareAcceptance((args) => {
        commands.push(args);
        throw new Error('broken build');
      }),
    /broken build/,
  );
  assert.equal(commands.length, 1);
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
