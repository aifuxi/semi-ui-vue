# AI 工作记录：Skills 与协作规则审计整改

- 日期：2026-09-08 22:48
- 状态：已完成

## 目标与验收

按 [Rethinking skills and prompts for GPT-6 Astra](https://x.com/pvncher/article/2095991462416490862) 的审计建议，依次修正语义冲突与错误参考、收窄加载与执行范围、整理入口与重复内容。用户明确要求完成验收后自动提交，不保留专项技能的相反规定。

验收以提交政策一致、任务分流明确、技术解释有证据、入口与引用有效、固定 Semi 完成合同不降级为准。此次调整不以字数变化证明模型质量或运行速度改善。

## 修改与决策

- 自动提交以根 `AGENTS.md` 为准，专项技能明确验收后直接提交，并检查暂存范围、diff 和实际提交结果。
- 完整切片、既有组件缺陷与文档维护分别进入对应流程；只有选择下一组件时才调查路线。恢复正式 accepted 仍需完整批次矩阵，维护任务不自动扩展成补齐下一批。
- Vue 基础与故障入口改为按问题选择参考，保留原有 22 个基础参考和 139 个故障参考。组件拆分按职责和生命周期判断，取消按 UI 区块数量强制拆分。
- 校正 ref/shallow 选择、SFC 导出边界、Teleport scoped 与祖先选择器、显式 props/emits 和 getter/ref 回写语义。SSR 示例采用纯计算或延迟客户端 DOM 读取。
- 测试指南复用仓库 pnpm、Vitest 与锁定 Playwright Chromium，说明 provider 建立顺序和 Teleport stub 的证据边界。Router 以 Nuxt 4.5.2 实际解析的 5.3.1 核验，保留可运行的 next 守卫，不要求机械迁移。
- JSX、Options API 与 Pinia 保留技能名和资料，作为显式入口及 Vue 主技能的按需参考；新增与其他宿主标志一致的 `allow_implicit_invocation: false`。连同原有两个访谈技能，共 5 个显式入口，其余 9 个维持自动发现。`domain-modeling` 保持原样。
- 访谈入口改用仓库自带的共享流程，移除缺失的 `/grilling` 依赖；路径从当前仓库解析。Semi MCP 查询统一传递消费项目的精确版本，修正失效链接与不存在的工具名，信息足够时停止查询。

范围只包含仓库规则、技能/参考和本记录。保留现有技能名称与 MIT 等归属字段，不修改个人技能、MCP 配置、vendor、组件源码、依赖锁文件或发布资产。

## 验证证据

### 结构与约束

- 对 14 个入口执行 YAML、既有名称/归属字段和调用策略核对。根 `AGENTS.md` 在测试章节之前的全部硬约束及 Git 章节与本轮起点 `c5b4e28` 逐字相同；文档流程的既有详细章节也逐字保留，仅新增任务入口。
- 系统 `skill-creator/scripts/quick_validate.py` 通过 uv 离线 PyYAML 环境实际检查了 14 个技能：6 个通过，8 个因校验器不接受 `author`、`version`、`compatibility` 或 `disable-model-invocation` 字段而拒绝。没有为通过这个有限 schema 删除跨宿主字段；补充 YAML 与归属/调用策略检查。
- 独立结构检查：14/14 入口 YAML、21 项既有归属/版本字段、7/7 调用 YAML 通过；5 个显式入口的双宿主策略一致。扫描 215 份 Markdown，275 个本地链接和 23 个锚点通过；另外 3 份刚修正参考的元数据/链接定点检查通过。原始基础参考 22/22、故障参考 139/139 可达。
- 格式采用 `pnpm exec prettier --ignore-path /dev/null --check <本次文件>`：30 份已冻结规则/参考/配置与 3 份追加参考分别通过；报告随后单独格式化并检查。`git diff --check` 通过。`.agents` / `.codex` 被默认 Prettier ignore 排除，因此必须对具名文件显式覆盖 ignore。
- 结构验证没有抓取 358 个外部链接；其 Markdown 解析用于本地路由检查，不能代替完整 CommonMark 渲染。排除的工作记录模板链接另核对文件存在。

`quick_validate` 使用的命令形式为：

```bash
uv run --no-project --offline --with PyYAML python /Users/chen/.codex/skills/.system/skill-creator/scripts/quick_validate.py <技能目录>
```

### 运行探针

以下探针使用当前仓库安装依赖，原始脚本保存在本记录附录；可将对应代码块保存为临时 `.mjs` 文件后，在仓库根按列出的命令执行。探针验证被修正文档的关键语义，不计作组件完整验收。

| 探针                    | 实际结果                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vue 编译与响应式        | Vue 3.5.41：普通 script 辅助 named export 编译通过；setup 运行时导出被拒；primitive ref 更新、外部 ref 共享、普通值隔离及 getter 依赖追踪通过。                                                                                             |
| Teleport Chromium       | Chromium 151.0.7922.34，1440×900、DPR 1、en-US：scopeId 保留、节点移至 BODY、独立 scoped 选择器匹配、原祖先选择器不匹配；color 为 rgb(0, 0, 255)、border 为 0px，卸载后节点清理。                                                           |
| Router                  | Nuxt 实际解析的 Router 5.3.1：12 个断言通过，覆盖异步放行/重定向、取消、错误处理、next 放行/重定向及参数变化不重复触发 beforeEnter。出现 3 条预期 VUE_ROUTER_R0025 弃用诊断。                                                               |
| Composable SSR/生命周期 | 从最终文档提取 useEventListener/useMouse。固定旧提交复现 window is not defined；新例在无 window 环境渲染为 `<div>0,0</div>`，getter 求值 0 次。jsdom 客户端求值 1 次、事件更新为 8,13；目标 getter 后续改变，仍能卸载原监听，状态停止更新。 |
| Provider/宿主组件       | 从最终文档提取首个 withSetup 和 useFetch。Vue 3.5.41、jsdom 26.1.0、Vue Test Utils 2.4.11：12 个行为断言通过且无 Vue warnings；覆盖 provider 身份、mount/onMounted、unmount 监听清理、请求输出与 abort 一次。                               |

前两项原始执行形式为 `node --input-type=module` 的 heredoc；保存后可在仓库根通过标准输入重放，保证模块从当前仓库解析。第三项使用 `process.cwd()` 解析文档站依赖：

```bash
node --input-type=module < /tmp/vue-skills-instruction-audit-20260908/compiler-reactivity.mjs
node --input-type=module < /tmp/vue-skills-instruction-audit-20260908/teleport-chromium.mjs
node /tmp/vue-skills-instruction-audit-20260908/router-runtime-check.mjs
node /tmp/vue-skills-instruction-audit-20260908/composable-lifecycle-check.mjs
node /tmp/vue-skills-instruction-audit-20260908/composable-lifecycle-probe.mjs
```

SSR 旧例固定读取本轮起点 `c5b4e28e386856c5b70bfa493f4f90b647558a4d`，提交后仍可重放。后两项的 jsdom 结果只证明对应挂载/注入/清理语义，不替代真实焦点、几何、Portal、动画或 hydration 证据；未重跑输入未变的 Chromium 探针。

### 独立场景复核

独立代理未读取本报告或预期答案，对 Tooltip SSR/关闭重开缺陷、Select 已验收待提交、全部 ready 后请求下一组件、访谈只要对话结论、不同 worktree 且缺少 CodeGraph 五个场景进行只读推演。结论与当前目标边界一致，没有重复审批、无依据全量重跑或虚构下一组件。

第二轮检查确认新文档入口消除了批次措辞歧义；SFC 文案、既有 Options API 定点维护、小型 getter/ref composable 三个场景未被导向无关重构。它发现了按需参考中提前读取 window 的残留示例，已纳入此次定点修正；provider 与 stub 的相关旧示例也一并修正。

这是独立静态场景评估及本地技术探针，不是跨模型运行对照、性能基准或模型遵循率证明。

## 未验证事项与回退

未运行全仓 lint/typecheck/build、组件完整视觉矩阵或 npm pack 验证，因为没有修改对应源码、依赖和发布输入。未在线调用 Semi MCP 返回数据；版本默认值结论来自当前工具 schema，指南要求调用时再次核对。未逐篇重验保留的全部技术参考。外部 Vue/Router 资料按当前项目版本使用，后续升级需重新确认。

这些规则调整可通过本次独立提交整体回退；提交只包含本轮文件，不执行远程推送。

## 附录：已执行的原始探针

### Vue 编译与响应式

文件名：`compiler-reactivity.mjs`；SHA-256：`76d24aabb03287055217d5bdf7eb8d007f572719e9d12dcb0e9dcfc523bc25e1`。

<!-- prettier-ignore -->
```js
import { parse, compileScript, compileStyle } from 'vue/compiler-sfc';
import { ref, shallowRef, computed, toRef, toValue, watchEffect, nextTick } from 'vue';
import assert from 'node:assert/strict';
const valid = parse('<script lang="ts">export const INITIAL = 0</script><script setup lang="ts">import { ref } from "vue"; const count = ref(INITIAL)</script><template>{{count}}</template>').descriptor;
const script = compileScript(valid, { id: 'data-v-probe' });
assert.ok(script.content.includes('export const INITIAL'));
const invalid = parse('<script setup lang="ts">export const INITIAL = 0</script>').descriptor;
assert.throws(() => compileScript(invalid, { id: 'data-v-probe' }), /cannot contain ES module exports/);
const css = compileStyle({ source: '.modal { color: blue } .host .modal { border: 1px solid red }', id: 'data-v-probe', scoped: true });
assert.equal(css.errors.length, 0);
const n = ref(0); let seen = -1;
const stop = watchEffect(() => { seen = n.value; });
n.value++; await nextTick(); assert.equal(seen, 1); stop();
const external = ref(1); const shared = toRef(external); shared.value++; assert.equal(external.value, 2);
const initial = external.value; const internal = toRef(initial); internal.value++; assert.equal(external.value, 2);
const normalized = computed(() => toValue(() => ` ${external.value} `).trim());
assert.equal(normalized.value, '2'); external.value++; assert.equal(normalized.value, '3');
console.log(JSON.stringify({ vue: (await import('vue')).version, normalScriptNamedExport: 'pass', setupRuntimeExportRejected: 'pass', refReactivity: 'pass', refSharingAndGetterTracking: 'pass', scopedCSS: css.code }, null, 2));
```

### Teleport Chromium

文件名：`teleport-chromium.mjs`；SHA-256：`5e43c0d1277233577c650cc211090e43215abf2629d70238135073a35438877f`。

<!-- prettier-ignore -->
```js
import { chromium } from '@playwright/test';
import { compileStyle } from 'vue/compiler-sfc';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const css = compileStyle({ source: '.modal { color: blue } .host .modal { border: 1px solid red }', id: 'data-v-probe', scoped: true }).code;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
  await page.setContent('<div id="app"></div>');
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ path: require.resolve('vue/dist/vue.global.js') });
  const result = await page.evaluate(async () => {
    const { createApp, h, Teleport, nextTick } = window.Vue;
    const app = createApp({ __scopeId: 'data-v-probe', setup: () => () => h('section', { class: 'host' }, [h(Teleport, { to: 'body' }, [h('div', { class: 'modal' }, 'Dialog')])]) });
    app.mount('#app'); await nextTick();
    const el = document.querySelector('.modal');
    const style = getComputedStyle(el);
    const result = { scopeId: el.hasAttribute('data-v-probe'), parent: el.parentElement.tagName, scopedMatch: el.matches('.modal[data-v-probe]'), ancestorMatch: el.matches('.host .modal[data-v-probe]'), color: style.color, borderWidth: style.borderTopWidth };
    app.unmount(); result.cleanedUp = !document.querySelector('.modal');
    return result;
  });
  assert.deepEqual(result, { scopeId: true, parent: 'BODY', scopedMatch: true, ancestorMatch: false, color: 'rgb(0, 0, 255)', borderWidth: '0px', cleanedUp: true });
  console.log(JSON.stringify({ chromium: browser.version(), teleportScopedProbe: result }, null, 2));
} finally { await browser.close(); }
```

### Router

文件名：`router-runtime-check.mjs`；SHA-256：`db86b6ec2805fd11e1c01428f5bb2484b896c29a11e2c1cc3a525360156f48f4`。

<!-- prettier-ignore -->
```js
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const docsReq = createRequire(new URL('./apps/docs/package.json', `file://${process.cwd()}/`));
const nuxtReq = createRequire(docsReq.resolve('nuxt/package.json'));
const { createRouter, createMemoryHistory, isNavigationFailure, NavigationFailureType } = nuxtReq('vue-router');
assert.equal(nuxtReq('vue-router/package.json').version, '5.3.1');
const component = {};
const routes = [
  { path: '/login', name: 'Login', component },
  { path: '/private', name: 'Private', component },
  { path: '/blocked', name: 'Blocked', component },
  { path: '/error', name: 'Error', component },
];
const router = createRouter({ history: createMemoryHistory(), routes });
let allowed = false;
router.beforeEach(async (to) => {
  if (to.name === 'Login') return;
  if (to.name === 'Blocked') return false;
  if (to.name === 'Error') throw new Error('guard failure');
  await Promise.resolve();
  if (!allowed) return { name: 'Login', query: { redirect: to.fullPath } };
});
await router.push('/private');
assert.equal(router.currentRoute.value.name, 'Login');
assert.equal(router.currentRoute.value.query.redirect, '/private');
allowed = true;
await router.push('/private');
assert.equal(router.currentRoute.value.name, 'Private');
assert(isNavigationFailure(await router.push('/blocked'), NavigationFailureType.aborted));
assert.equal(router.currentRoute.value.name, 'Private');
let reported;
router.onError((error) => { reported = error.message; });
await assert.rejects(router.push('/error'), /guard failure/);
assert.equal(reported, 'guard failure');
const nextRouter = createRouter({ history: createMemoryHistory(), routes });
allowed = false;
nextRouter.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !allowed) {
    next({ name: 'Login' });
    return;
  }
  next();
});
await nextRouter.push('/private');
assert.equal(nextRouter.currentRoute.value.name, 'Login');
allowed = true;
await nextRouter.push('/private');
assert.equal(nextRouter.currentRoute.value.name, 'Private');
let entries = 0;
const paramsRouter = createRouter({ history: createMemoryHistory(), routes: [
  { path: '/users/:id', component, beforeEnter: () => { entries++; } }
] });
await paramsRouter.push('/users/1');
await paramsRouter.push('/users/2');
assert.equal(paramsRouter.currentRoute.value.params.id, '2');
assert.equal(entries, 1);
console.log('vue-router 5.3.1: async allow/redirect, cancellation, error handler, next allow/redirect, params beforeEnter behavior all passed');
```

### Composable SSR 与生命周期

文件名：`composable-lifecycle-check.mjs`；SHA-256：`0929229bfc8da56f734d8e06e34fea1d5289b0476552091b82fdcd13fa1abefa`。

<!-- prettier-ignore -->
```js
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));
const sourcePath = '.agents/skills/vue-best-practices/references/composables.md';
const baselineCommit = 'c5b4e28e386856c5b70bfa493f4f90b647558a4d';
function examples(source, vue) {
  const blocks = [...source.matchAll(/```javascript\n([\s\S]*?)\n```/g)].map((match) => match[1]);
  const listener = blocks.find((block) => block.startsWith('// composables/useEventListener.js'));
  const mouse = blocks.find((block) => block.startsWith('// composables/useMouse.js'));
  assert.ok(listener && mouse, 'document contains both composable examples');
  const body = [listener, mouse].join('\n').replace(/^import .*$/gm, '').replace(/^export /gm, '');
  return new Function('vue', `const { onMounted, onUnmounted, toValue, ref } = vue;\n${body}\nreturn { useEventListener, useMouse };`)(vue);
}

const mode = process.argv[2];
if (!mode) {
  const results = ['ssr', 'client'].map((phase) => JSON.parse(execFileSync(process.execPath, [fileURLToPath(import.meta.url), phase], { encoding: 'utf8' })));
  const text = JSON.stringify({ probe: 'actual composable documentation examples', results }, null, 2) + '\n';
  writeFileSync(new URL('./composable-lifecycle-result.json', import.meta.url), text);
  process.stdout.write(text);
} else if (mode === 'ssr') {
  assert.equal('window' in globalThis, false, 'SSR process has no window');
  const vue = require('vue');
  const { renderToString } = require('@vue/server-renderer');
  const current = examples(readFileSync(sourcePath, 'utf8'), vue);
  const previous = examples(execFileSync('git', ['show', `${baselineCommit}:${sourcePath}`], { encoding: 'utf8' }), vue);
  const oldApp = vue.createSSRApp({ setup() { const mouse = previous.useMouse(); return () => vue.h('div', `${mouse.x.value},${mouse.y.value}`); } });
  oldApp.config.warnHandler = () => {};
  await assert.rejects(renderToString(oldApp), /window is not defined/);
  let targetReads = 0;
  const app = vue.createSSRApp({ setup() {
    const mouse = current.useMouse();
    current.useEventListener(() => { targetReads++; throw new Error('SSR evaluated target getter'); }, 'probe', () => {});
    return () => vue.h('div', `${mouse.x.value},${mouse.y.value}`);
  } });
  assert.equal(await renderToString(app), '<div>0,0</div>');
  assert.equal(targetReads, 0);
  process.stdout.write(JSON.stringify({ phase: mode, vue: vue.version, originalEagerWindowFailureReproduced: true, render: '<div>0,0</div>', targetGetterReads: targetReads }));
} else if (mode === 'client') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="app"></div>');
  for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'SVGElement', 'Event', 'MouseEvent']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
  }
  const vue = require('vue');
  const current = examples(readFileSync(sourcePath, 'utf8'), vue);
  let target = window;
  let targetReads = 0;
  let events = 0;
  let mouse;
  const app = vue.createApp({ setup() {
    mouse = current.useMouse();
    current.useEventListener(() => { targetReads++; return target; }, 'probe', () => { events++; });
    return () => vue.h('div', `${mouse.x.value},${mouse.y.value}`);
  } });
  const host = document.querySelector('#app');
  app.mount(host);
  assert.equal(targetReads, 1);
  window.dispatchEvent(new MouseEvent('mousemove', { clientX: 8, clientY: 13 }));
  window.dispatchEvent(new Event('probe'));
  await vue.nextTick();
  assert.equal(host.textContent, '8,13');
  assert.equal(events, 1);
  target = new window.EventTarget();
  app.unmount();
  assert.equal(targetReads, 1, 'cleanup does not re-evaluate the target getter');
  window.dispatchEvent(new MouseEvent('mousemove', { clientX: 21, clientY: 34 }));
  window.dispatchEvent(new Event('probe'));
  assert.equal(events, 1, 'listener removed from the originally mounted target');
  assert.deepEqual([mouse.x.value, mouse.y.value], [8, 13]);
  assert.equal(host.textContent, '');
  dom.window.close();
  process.stdout.write(JSON.stringify({ phase: mode, environment: 'jsdom lifecycle check, not browser layout evidence', targetGetterReads: targetReads, outputBeforeUnmount: '8,13', listenerRemovedFromOriginalTarget: true, mouseStoppedAfterUnmount: true }));
} else {
  throw new Error(`Unknown probe phase: ${mode}`);
}
```

### Provider 与宿主组件

文件名：`composable-lifecycle-probe.mjs`；SHA-256：`3ca3249efc02e5274e5144b34f87fefa3ffd92521c4c380f7f760e83592216b6`。

<!-- prettier-ignore -->
```js
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const req = createRequire(new URL('./package.json', `file://${process.cwd()}/`));
const { JSDOM } = req('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'navigator', 'Node', 'Element', 'HTMLElement', 'SVGElement']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
}
const Vue = req('vue');
const { flushPromises } = req('@vue/test-utils');
const markdown = readFileSync('.agents/skills/vue-testing-best-practices/reference/testing-composables-helper-wrapper.md', 'utf8');
const blocks = [...markdown.matchAll(/```javascript\n([\s\S]*?)\n```/g)].map((match) => match[1]);
function readExample(marker, exported) {
  const block = blocks.find((code) => code.startsWith(marker));
  assert(block, `example ${marker} exists`);
  const code = block.replace(/^import .+ from 'vue';?\n/gm, '').replace(/^export /gm, '');
  return new Function(...Object.keys(Vue), `${code}\nreturn ${exported};`)(...Object.values(Vue));
}
const useFetch = readExample('// composables/useFetch.js', 'useFetch');
const withSetup = readExample('// test-utils.js', 'withSetup');
const warnings = [];
const originalWarn = console.warn;
console.warn = (...args) => warnings.push(args.join(' '));
const liveApps = new Set();
try {
  const service = { value: 'provided before mount' };
  const lifecycle = { mounted: 0, unmounted: 0, events: 0 };
  const onEvent = () => lifecycle.events++;
  const [injected, lifecycleApp] = withSetup(() => {
    const current = Vue.inject('service');
    Vue.onMounted(() => {
      lifecycle.mounted++;
      window.addEventListener('probe-event', onEvent);
    });
    Vue.onUnmounted(() => {
      lifecycle.unmounted++;
      window.removeEventListener('probe-event', onEvent);
    });
    return current;
  }, { provide: { service } });
  liveApps.add(lifecycleApp);
  assert.equal(injected, service);
  assert.equal(lifecycle.mounted, 1);
  window.dispatchEvent(new dom.window.Event('probe-event'));
  assert.equal(lifecycle.events, 1);
  lifecycleApp.unmount();
  liveApps.delete(lifecycleApp);
  assert.equal(lifecycle.unmounted, 1);
  window.dispatchEvent(new dom.window.Event('probe-event'));
  assert.equal(lifecycle.events, 1);
  console.log('PASS: actual mount sees provided identity; onMounted runs once; unmount runs cleanup and removes listener');

  let requestedUrl;
  let requestSignal;
  let abortEvents = 0;
  const mockApiClient = { get: async (url, { signal }) => {
    requestedUrl = url;
    requestSignal = signal;
    signal.addEventListener('abort', () => abortEvents++, { once: true });
    return { data: { id: 1, name: 'Test' } };
  } };
  const [result, fetchApp] = withSetup(() => useFetch('/api/test'), { provide: { apiClient: mockApiClient } });
  liveApps.add(fetchApp);
  await flushPromises();
  assert.equal(requestedUrl, '/api/test');
  assert.deepEqual(result.data.value, { id: 1, name: 'Test' });
  assert.equal(result.loading.value, false);
  assert.equal(result.error.value, null);
  assert.equal(requestSignal.aborted, false);
  fetchApp.unmount();
  liveApps.delete(fetchApp);
  assert.equal(requestSignal.aborted, true);
  assert.equal(abortEvents, 1);
  assert.deepEqual(warnings, []);
  console.log('PASS: documented useFetch gets injected client on mount, exposes expected result, and aborts exactly once on unmount');
  console.log(`Versions: vue ${req('vue/package.json').version}; jsdom ${req('jsdom/package.json').version}; @vue/test-utils ${req('@vue/test-utils/package.json').version}`);
  console.log('PASS: 12 behavior assertions and no Vue warnings; two exact Markdown code blocks executed');
  console.log('Scope: Vue mount/inject/unmount in jsdom. No Portal, focus, geometry, animation, SSR, or hydration claim.');
} finally {
  for (const app of liveApps) app.unmount();
  console.warn = originalWarn;
  dom.window.close();
}
```
