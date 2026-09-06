import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { uiDependencies, batchInputs, preflightBatch } from './documentation-inputs.mjs';
import { loadBatches } from './documentation-evidence.mjs';

async function fixture(t, sources) {
  const root = await mkdtemp(join(tmpdir(), 'docs-inputs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '-q', root]);
  for (const [file, source] of Object.entries(sources)) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), source);
  }
  return root;
}
const demo = 'apps/docs/src/demos/example/zh-cn/Basic.vue';
const button = 'packages/ui/src/button/index.ts';
const tooltip = 'packages/ui/src/tooltip/index.ts';
const locale = 'packages/ui/src/locale/index.ts';
test('SFC → 公共子路径 → 相对导出追踪共享依赖，排除无关组件和纯类型导入', async (t) => {
  const root = await fixture(t, {
    [demo]: `<script setup>import { Button } from '@aifuxi/semi-ui-vue/button';</script>`,
    [button]: `export { Tooltip } from '../tooltip'; import type { Locale } from '../locale';`,
    [tooltip]: 'export const Tooltip = {};',
    [locale]: 'export type Locale = string;',
  });
  const result = await uiDependencies([demo], root);
  assert.deepEqual(result.files, [demo, button, tooltip]);
  assert.deepEqual(result.fallback, []);
  await writeFile(join(root, button), `export { Locale } from '../locale';`);
  assert.deepEqual((await uiDependencies([demo], root)).files, [demo, button, locale]);
});
for (const source of ['import(name)', `import './missing'`, `import.meta.glob('./*.ts')`])
  test(`不能解析 ${source} 时扩大到全部 UI，不能误判无影响`, async (t) => {
    const root = await fixture(t, { [demo]: `<script setup>${source}</script>`, [locale]: '' });
    const result = await uiDependencies([demo], root);
    assert.ok(result.files.includes(locale));
    assert.ok(result.fallback.length);
  });
test('入口使用根导出时保守追踪所有导出', async (t) => {
  const root = await fixture(t, {
    [demo]: `<script setup>import { Button } from '@aifuxi/semi-ui-vue';</script>`,
    'packages/ui/src/index.ts': `export * from './button'; export * from './locale';`,
    [button]: '',
    [locale]: '',
  });
  assert.ok((await uiDependencies([demo], root)).files.includes(locale));
});
test('预检在构建前拒绝 Git 大小写路径不匹配与缺失示例', async (t) => {
  const wrong = demo.replace('zh-cn', 'zh-CN');
  const root = await fixture(t, { [wrong]: '<template />' });
  execFileSync('git', ['add', '.'], { cwd: root });
  const batch = {
    inputs: ['apps/docs/src/demos'],
    examples: [{ zhCN: 'example/zh-cn/Basic', enUS: 'example/zh-cn/Basic' }],
  };
  await assert.rejects(preflightBatch(batch, root), /精确路径/);
});
test('实际 Button 不依赖 Locale 示例或 Table；共享 Tooltip 仍在输入中', async () => {
  const batch = (await loadBatches()).find((entry) => entry.id === 'button');
  const { files, fallback } = await batchInputs(batch);
  assert.deepEqual(fallback, []);
  assert.ok(files.includes('packages/ui/src/tooltip/Tooltip.vue'));
  assert.ok(!files.some((file) => file.startsWith('packages/ui/src/table/')));
  assert.ok(!files.some((file) => file.startsWith('apps/docs/src/demos/locale/')));
  assert.ok(!files.some((file) => file.startsWith('apps/reference-react/src/scenarios/')));
  assert.ok(
    !files.some((file) => file.startsWith('packages/ui/src/') && file.endsWith('.test.ts')),
  );
});
