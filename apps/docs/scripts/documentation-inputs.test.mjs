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
test('正式批次追踪产物和验收逻辑，不因诊断工具及其测试变化失效', async () => {
  for (const batch of await loadBatches()) {
    const { files } = await batchInputs(batch);
    for (const file of [
      'prepare-content.mjs',
      'documentation-evidence.mjs',
      'documentation-inputs.mjs',
      'accept-documentation-batch.mjs',
      'static-file-response.mjs',
    ]) {
      assert.ok(files.includes(`apps/docs/scripts/${file}`), `${batch.id}: ${file}`);
    }
    assert.ok(
      !files.some((file) =>
        /apps\/docs\/scripts\/(?:diagnose-|documentation-diagnostics)/.test(file),
      ),
    );
    assert.ok(
      !files.some((file) => file.startsWith('apps/docs/scripts/') && file.endsWith('.test.mjs')),
    );
  }
});
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

const foundationIndex = 'packages/foundation-integration/src/index.ts';
const foundationTooltip = 'packages/foundation-integration/src/tooltip.js';
const foundationTable = 'packages/foundation-integration/src/table.js';
const foundationHelper = 'packages/foundation-integration/src/fast-copy.js';
const adapter = 'apps/reference-react/docs-adapters/button.mjs';
const sharedStyle = 'apps/docs/src/assets/site.css';
const referenceCompiler = 'apps/reference-react/docs-reference-plugin.ts';
const foundationFixture = {
  [demo]: `<script setup>import { Button } from '@aifuxi/semi-ui-vue/button';</script>`,
  [button]: `import { TooltipFoundation as Foundation, type TooltipAdapter } from '@workspace/foundation-integration'; export const Button = Foundation;`,
  [foundationIndex]: `export { TooltipFoundation } from './tooltip.js'; export { TableFoundation } from './table.js';`,
  [foundationTooltip]: `export { default as TooltipFoundation } from '../../../vendor/semi-design/packages/semi-foundation/tooltip/foundation';`,
  [foundationTable]: `export { default as TableFoundation } from '../../../vendor/semi-design/packages/semi-foundation/table/foundation';`,
  [foundationHelper]: 'export default function copy(value) { return {...value}; }',
  'vendor/semi-design/packages/semi-foundation/tooltip/foundation.ts':
    'export default class TooltipFoundation {}',
  'vendor/semi-design/packages/semi-foundation/table/foundation.ts':
    'export default class TableFoundation {}',
  'packages/foundation-integration/package.json': '{"type":"module"}',
  [adapter]: 'export function adapt(code) { return code; }',
  [sharedStyle]: '.demo { color: red; }',
  [referenceCompiler]: '// Shared compiler',
};
const dependencyBatch = {
  id: 'button',
  dependencyMode: 'imports-v2',
  inputs: [demo, adapter, sharedStyle, referenceCompiler],
};

async function sourceDigest(batch, root) {
  // Exercise the same path + current bytes contract as fingerprint(), without changing
  // evidence or pretending the fixture has a real pinned submodule/browser report.
  const { createHash } = await import('node:crypto');
  const { readFile } = await import('node:fs/promises');
  const { files, fallback } = await batchInputs(batch, root);
  const hash = createHash('sha256');
  for (const file of files)
    hash
      .update(file + '\0')
      .update(await readFile(join(root, file)))
      .update('\0');
  return { digest: hash.digest('hex'), files, fallback };
}

test('命名 Foundation 导出追踪真实转发模块，并保留共享 helper 和包配置', async (t) => {
  const root = await fixture(t, foundationFixture);
  const result = await sourceDigest(dependencyBatch, root);
  assert.deepEqual(result.fallback, []);
  for (const file of [
    foundationIndex,
    foundationTooltip,
    foundationHelper,
    'packages/foundation-integration/package.json',
  ])
    assert.ok(result.files.includes(file), file);
  assert.ok(!result.files.includes(foundationTable));
});

test('新增批次及修改其适配器不改变已有批次指纹；共享编译器仍使消费者失效', async (t) => {
  const root = await fixture(t, foundationFixture);
  const before = await sourceDigest(dependencyBatch, root);
  const navigationAdapter = 'apps/reference-react/docs-adapters/navigation.mjs';
  await writeFile(join(root, navigationAdapter), 'export function adapt(code) { return code; }');
  const navigation = {
    ...dependencyBatch,
    id: 'navigation',
    inputs: [navigationAdapter, sharedStyle, referenceCompiler],
  };
  assert.equal((await sourceDigest(dependencyBatch, root)).digest, before.digest);
  const navigationBefore = await sourceDigest(navigation, root);
  await writeFile(
    join(root, navigationAdapter),
    'export function adapt(code) { return code.trim(); }',
  );
  assert.equal((await sourceDigest(dependencyBatch, root)).digest, before.digest);
  assert.notEqual((await sourceDigest(navigation, root)).digest, navigationBefore.digest);
  await writeFile(join(root, referenceCompiler), '// Changed shared compiler');
  assert.notEqual((await sourceDigest(dependencyBatch, root)).digest, before.digest);
});

test('无关 Foundation 转发变更不触发重验；相关 Foundation、共享 helper 与样式均改变指纹', async (t) => {
  const root = await fixture(t, foundationFixture);
  const before = await sourceDigest(dependencyBatch, root);
  await writeFile(
    join(root, foundationTable),
    foundationFixture[foundationTable] + '\n// Unrelated facade edit',
  );
  assert.equal((await sourceDigest(dependencyBatch, root)).digest, before.digest);
  for (const file of [foundationTooltip, foundationHelper, sharedStyle, foundationIndex]) {
    await writeFile(join(root, file), foundationFixture[file] + '\n/* changed */');
    assert.notEqual((await sourceDigest(dependencyBatch, root)).digest, before.digest, file);
    await writeFile(join(root, file), foundationFixture[file]);
  }
});

for (const source of [
  `import * as foundation from '@workspace/foundation-integration';`,
  `import('@workspace/foundation-integration');`,
  `import { UnknownFoundation } from '@workspace/foundation-integration';`,
  `import { Foundation } from '@workspace/unknown';`,
])
  test(`未知 Foundation 依赖保守扩大：${source}`, async (t) => {
    const root = await fixture(t, { ...foundationFixture, [button]: source });
    const result = await batchInputs(dependencyBatch, root);
    assert.ok(result.fallback.length);
    assert.ok(result.files.includes(foundationTable));
  });

test('未选中 Foundation 转发出现副作用、动态依赖或缺失时扩大到全部输入', async (t) => {
  const root = await fixture(t, foundationFixture);
  for (const source of [
    foundationFixture[foundationTable] + '\nglobalThis.changed = true;',
    foundationFixture[foundationTable] + '\nimport(name);',
  ]) {
    await writeFile(join(root, foundationTable), source);
    const result = await batchInputs(dependencyBatch, root);
    assert.ok(result.fallback.length);
    assert.ok(result.files.includes(foundationTable));
  }
  execFileSync('git', ['add', '.'], { cwd: root });
  await rm(join(root, foundationTable));
  const result = await batchInputs(dependencyBatch, root);
  assert.ok(result.fallback.some((reason) => reason.includes('缺失')));
  assert.ok(result.files.includes(foundationTable));
});

test('Foundation 星号再导出与 TS 的 .js 相对路径按真实源文件解析', async (t) => {
  const root = await fixture(t, {
    ...foundationFixture,
    [foundationIndex]: `export * from './tooltip.js'; export { TableFoundation } from './table.js';`,
    [button]: `export { Button } from './runtime.js';`,
    'packages/ui/src/button/runtime.ts': foundationFixture[button],
  });
  const result = await batchInputs(dependencyBatch, root);
  assert.deepEqual(result.fallback, []);
  assert.ok(result.files.includes(foundationTooltip));
  assert.ok(result.files.includes('packages/ui/src/button/runtime.ts'));
  assert.ok(!result.files.includes(foundationTable));
});

test('批次适配器的本地共享 helper 被递归追踪，未知动态导入保守扩大', async (t) => {
  const helper = 'apps/reference-react/docs-adapters/shared/normalize.mjs';
  const root = await fixture(t, {
    ...foundationFixture,
    [adapter]: `export { adapt } from './shared/normalize.mjs';`,
    [helper]: 'export function adapt(code) { return code; }',
  });
  const before = await sourceDigest(dependencyBatch, root);
  assert.ok(before.files.includes(helper));
  await writeFile(join(root, helper), 'export function adapt(code) { return code.trim(); }');
  assert.notEqual((await sourceDigest(dependencyBatch, root)).digest, before.digest);
  await writeFile(join(root, helper), 'import(name);');
  const result = await batchInputs(dependencyBatch, root);
  assert.ok(result.fallback.length);
  assert.ok(result.files.includes(foundationTable));
});

test('实际六批仅纳入自身 React 适配器；Table 仅影响 Locale，Tooltip 和共享样式影响全部六批', async () => {
  const batches = await loadBatches();
  const inputs = await Promise.all(
    batches.map(async (batch) => ({ batch, ...(await batchInputs(batch)) })),
  );
  for (const { batch, files, fallback } of inputs) {
    assert.deepEqual(fallback, [], batch.id);
    assert.deepEqual(
      files.filter((file) => file.startsWith('apps/reference-react/docs-adapters/')),
      [`apps/reference-react/docs-adapters/${batch.id}.mjs`],
    );
  }
  const affected = (file) =>
    inputs.filter((result) => result.files.includes(file)).map(({ batch }) => batch.id);
  assert.deepEqual(affected(foundationTable), ['locale']);
  assert.deepEqual(affected('packages/foundation-integration/src/audio-player.js'), []);
  for (const file of [foundationTooltip, foundationHelper, sharedStyle, referenceCompiler])
    assert.equal(affected(file).length, 6, file);
  assert.deepEqual(affected('apps/reference-react/docs-adapters/navigation.mjs'), ['navigation']);
});

for (const target of [
  '../../../vendor/semi-design/packages/semi-foundation/table/table.scss',
  '../../../vendor/semi-design/packages/semi-foundation/table/missing',
  '../../../vendor/semi-design/../../apps/injected.ts',
])
  test(`未选中 Foundation 转发样式、缺失脚本或越界目标仍扩大：${target}`, async (t) => {
    const root = await fixture(t, {
      ...foundationFixture,
      [foundationTable]: `export * from '${target}';`,
      'vendor/semi-design/packages/semi-foundation/table/table.scss': '.unexpected { color: red; }',
      'apps/injected.ts': 'globalThis.injected = true;',
    });
    const result = await batchInputs(dependencyBatch, root);
    assert.ok(result.fallback.length);
    assert.ok(result.files.includes(foundationTable));
  });

test('Reference 适配器跨目录 helper 的两跳 JSON 依赖及静态 URL 资源改变指纹', async (t) => {
  const helper = 'apps/reference-react/docs-shared/adapter-utils.mjs';
  const mapping = 'apps/reference-react/docs-shared/mapping.json';
  const image = 'apps/reference-react/docs-shared/image.svg';
  const root = await fixture(t, {
    ...foundationFixture,
    [adapter]: `export { adapt } from '../docs-shared/adapter-utils.mjs';`,
    [helper]: `import mapping from './mapping.json'; const image = new URL('./image.svg', import.meta.url); export function adapt(code) { return code; }`,
    [mapping]: '{"name":"before"}',
    [image]: '<svg />',
  });
  const before = await sourceDigest(dependencyBatch, root);
  assert.deepEqual(before.fallback, []);
  assert.ok(before.files.includes(mapping));
  assert.ok(before.files.includes(image));
  await writeFile(join(root, mapping), '{"name":"after"}');
  assert.notEqual((await sourceDigest(dependencyBatch, root)).digest, before.digest);
});

test('Foundation 共享工具递归跟随带 Vite 查询参数的资源与跨目录依赖', async (t) => {
  const resource = 'packages/foundation-integration/src/worker.ts';
  const shared = 'packages/build-tools/shared.js';
  const mapping = 'packages/build-tools/mapping.json';
  const root = await fixture(t, {
    ...foundationFixture,
    [foundationHelper]: `import worker from './worker?worker&inline'; import { copy } from '../../build-tools/shared.js'; export default copy;`,
    [resource]: 'export default {};',
    [shared]: `import mapping from './mapping.json'; export function copy(value) { return value; }`,
    [mapping]: '{}',
  });
  const result = await batchInputs(dependencyBatch, root);
  assert.deepEqual(result.fallback, []);
  for (const file of [resource, shared, mapping]) assert.ok(result.files.includes(file), file);
});
