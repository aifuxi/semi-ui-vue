import { expect, it } from 'vitest';
import { createContext } from './verify-slot-render-usage.mjs';

/** 这些入口都会在 computed/watch 内执行插槽，包含声明顺序与传递辅助调用。 */
const rejected = [
  ['直接调用', 'computed(() => slots.default?.());'],
  ['已声明箭头函数', 'const render = () => slots.default?.(); computed(() => render());'],
  ['后声明函数', 'computed(() => render()); function render() { return slots.default?.(); }'],
  ['直接传入回调', 'const render = () => slots.default?.(); computed(render);'],
  ['watch 直接回调', 'const render = () => slots.default?.(); watch(source, render);'],
  [
    '条件分支中的调用',
    'const render = () => slots.default?.(); computed(() => visible.value ? render() : []);',
  ],
  [
    '数组回调中的调用',
    'const render = () => slots.file?.(); computed(() => files.value.map(file => render(file)));',
  ],
  [
    '传递调用',
    'computed(() => outer()); function outer() { return inner(); } function inner() { return slots.default?.(); }',
  ],
];

// 原检查器直接插槽用例通过，其余辅助函数用例因收集顺序或 AST 遍历早停而漏检。
it.each(rejected)('拒绝缓存插槽：%s', (_name, source) => {
  expect(createContext(source, 'fixture.ts').violations.length).toBeGreaterThan(0);
});

/** 函数值、存在性判断与受支持的渲染期入口均不在缓存调用禁令内。 */
const accepted = [
  [
    '对象中保留函数引用',
    'const render = () => slots.default?.(); computed(() => ({ renderLabel: render }));',
  ],
  ['返回函数值', 'const render = () => slots.default?.(); computed(() => render);'],
  [
    '对象中保留延后调用',
    'const render = () => slots.default?.(); computed(() => ({ renderLabel: () => render() }));',
  ],
  ['返回延后插槽函数', 'computed(() => () => slots.default?.());'],
  [
    'VNode 插槽只在子组件渲染期执行',
    'const inner = () => slots.default?.(); function render() { return h(Tag, {}, { default: () => inner() }); } computed(() => render());',
  ],
  [
    '传递返回函数值',
    'function render() { return slots.default?.(); } function outer() { return render; } computed(() => outer());',
  ],
  ['仅检查插槽存在', 'computed(() => Boolean(slots.default));'],
  ['渲染期计算', 'const render = () => slots.default?.(); useRenderComputed(render);'],
  [
    '无插槽的循环调用',
    'function first() { return second(); } function second() { return first(); } computed(first);',
  ],
];

// Cascader、TreeSelect 在 computed 中组装 renderer props，只传函数引用，必须继续允许。
it.each(accepted)('允许非缓存调用：%s', (_name, source) => {
  expect(createContext(source, 'fixture.ts').violations).toEqual([]);
});

// 行号用于 CLI 定位和已有 allow 标记，不能因 Vue script 偏移而失真。
it('Vue script 内的违规保留完整文件行号', () => {
  /** 模板占两行，缓存入口位于完整 SFC 的第五行。 */
  const source = `<template>文本</template>

<script setup lang="ts">
const render = () => slots.default?.();
computed(() => render());
</script>`;
  expect(createContext(source, 'fixture.vue').violations).toEqual([
    { kind: 'computed 回调调用了读取插槽的函数 render', line: 5 },
  ]);
});
