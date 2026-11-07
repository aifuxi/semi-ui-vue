import { mount } from '@vue/test-utils';
import { afterEach, expect, it } from 'vitest';

import { semiGlobal } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import { Dropdown } from './index';
import type { DropdownProps } from './types';

// 每例结束清除全局覆盖，避免影响其他组件测试。
afterEach(() => {
  semiGlobal.config = {};
});

// 未传与 undefined 均应继续查找全局覆盖；显式布尔值优先。
const overflowCases: {
  props: Pick<DropdownProps, 'autoAdjustOverflow'>;
  global: boolean | undefined;
  expected: boolean | undefined;
}[] = [
  { props: {}, global: undefined, expected: undefined },
  { props: { autoAdjustOverflow: undefined }, global: undefined, expected: undefined },
  { props: { autoAdjustOverflow: true }, global: false, expected: true },
  { props: { autoAdjustOverflow: false }, global: true, expected: false },
  { props: {}, global: false, expected: false },
  { props: {}, global: true, expected: true },
  { props: { autoAdjustOverflow: undefined }, global: false, expected: false },
];
// 每个公开输入均检查实际透传键和值，不依赖 Tooltip 对 Boolean 的二次转换。
it.each(overflowCases)('可选参数透传保留缺省语义：%j', ({ props, global, expected }) => {
  semiGlobal.config = { overrideDefaultProps: { Dropdown: { autoAdjustOverflow: global } } };
  // 保留真实 Dropdown 参数解析，只替换不参与本例的 Tooltip DOM 生命周期。
  const wrapper = mount(Dropdown, {
    props,
    slots: { default: '<button>导出</button>' },
    global: { stubs: { Tooltip: true } },
  });
  // 原始 vnode 参数能区分“未提供”和 Tooltip 自身的 Vue Boolean 转换。
  const forwarded = wrapper.getComponent(Tooltip).vm.$.vnode.props;
  expect(forwarded?.autoAdjustOverflow).toBe(expected);
  expect(Object.hasOwn(forwarded ?? {}, 'autoAdjustOverflow')).toBe(expected !== undefined);
  wrapper.unmount();
});

// 同一解析器负责这些 Tooltip 可选 Boolean，缺省时均不能制造 false。
it('其他可选 Boolean 保留下层默认值，且参数更新仍可响应', async () => {
  // 来自 tooltipBindings 的可选 Boolean 参数集合。
  const optionalKeys = [
    'arrowPointAtCenter',
    'clickToHide',
    'clickTriggerToHide',
    'condition',
    'disableArrowKeyDown',
    'disableFocusListener',
    'guardFocus',
    'keepDOM',
    'preventScroll',
    'stopPropagation',
    'transformFromCenter',
    'wrapWhenSpecial',
  ] as const satisfies readonly (keyof DropdownProps)[];
  // 首次未传参数，随后通过公开 props 更新，检查 computed 的响应依赖。
  const wrapper = mount(Dropdown, {
    slots: { default: '<button>导出</button>' },
    global: { stubs: { Tooltip: true } },
  });
  for (const key of optionalKeys) {
    expect(Object.hasOwn(wrapper.getComponent(Tooltip).vm.$.vnode.props ?? {}, key)).toBe(false);
  }
  await wrapper.setProps({ autoAdjustOverflow: false });
  expect(wrapper.getComponent(Tooltip).vm.$.vnode.props?.autoAdjustOverflow).toBe(false);
  await wrapper.setProps({ autoAdjustOverflow: undefined });
  expect(
    Object.hasOwn(wrapper.getComponent(Tooltip).vm.$.vnode.props ?? {}, 'autoAdjustOverflow'),
  ).toBe(false);
  wrapper.unmount();
});
