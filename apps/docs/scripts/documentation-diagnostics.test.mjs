import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  diagnosticArguments,
  diagnosticSelection,
  exactTitlePattern,
} from './documentation-diagnostics.mjs';
import { expectedCaseTitles } from './documentation-evidence.mjs';

const batch = {
  id: 'navigation',
  title: 'Navigation 文档',
  examples: ['Basic', 'Template', 'Controlled', 'Horizontal'].map((name) => ({ name })),
  locales: ['zh-cn', 'en-us'],
  themes: ['light', 'dark'],
  rtlExamples: ['Horizontal'],
};
test('代表用例覆盖全部双语结构、暗色和方向敏感路径', () => {
  const titles = diagnosticSelection([batch]);
  assert.equal(titles.length, 10);
  assert.ok(titles.includes('Navigation 文档 Controlled en-us light'));
  assert.ok(titles.includes('Navigation 文档 Template zh-cn light'));
  assert.ok(titles.includes('Navigation 文档 Basic zh-cn dark'));
  assert.ok(titles.includes('Navigation 文档 Horizontal en-us dark rtl'));
  assert.ok(titles.every((title) => expectedCaseTitles(batch).includes(title)));
});
test('grep 精准选择失败用例，零匹配及无效表达式拒绝', () => {
  assert.deepEqual(diagnosticSelection([batch], 'Controlled en-us dark$'), [
    'Navigation 文档 Controlled en-us dark',
  ]);
  assert.throws(() => diagnosticSelection([batch], 'Unknown'), /未匹配/);
  assert.throws(() => diagnosticSelection([batch], '['), SyntaxError);
});
test('Playwright 完整标题的项目、文件和分组前缀不影响精确用例选择', () => {
  const titles = ['Example (a+b) zh-cn light', 'Example [x] en-us dark rtl'];
  const pattern = new RegExp(exactTitlePattern(titles));
  const discovered = [
    titles[0],
    `chromium tests/nuxt/example.spec.ts feedback ${titles[0]}`,
    `tests/nuxt/example.spec.ts ${titles[1]}`,
    'tests/nuxt/example.spec.ts Example aaab zh-cn light',
    `tests/nuxt/example.spec.ts ${titles[0]} rtl`,
    `tests/nuxt/example.spec.ts prefix${titles[0]}`,
    'tests/nuxt/example.spec.ts Other zh-cn light',
  ];
  assert.deepEqual(
    discovered.filter((title) => pattern.test(title)),
    discovered.slice(0, 3),
  );
});
test('诊断参数拒绝错误批次、不完整grep及不安全跳构建选项', () => {
  assert.equal(diagnosticArguments(['navigation', '--prepare-only'], [batch]).prepareOnly, true);
  assert.equal(
    diagnosticArguments(['navigation', '--grep', 'Basic', '--plan'], [batch]).plan,
    true,
  );
  for (const args of [
    [],
    ['missing'],
    ['navigation', '--grep'],
    ['navigation', '--skip-build'],
    ['navigation', '--prepare-only', '--grep', 'Basic'],
  ])
    assert.throws(() => diagnosticArguments(args, [batch]));
});
