import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { prepareAcceptance } from './documentation-pipeline.mjs';

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
