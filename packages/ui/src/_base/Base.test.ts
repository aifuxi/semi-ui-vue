/* eslint-disable vue/one-component-per-file -- lifecycle probes are local test fixtures. */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import BaseComponent, { useBaseComponent } from './base-component';
import {
  isClassComponent,
  isCompositeTypeElement,
  isElement,
  isEmptyChildren,
  isFunctionalComponent,
  isHTMLElement,
  isVueComponent,
} from './component-utils';
import { BaseFoundation, VALIDATE_STATUSES } from './index';
import type { BaseProps } from './base';

type TestProps = BaseProps & {
  value?: string | undefined;
  'data-probe'?: string;
};
type TestState = Record<string, unknown> & { count: number };

describe('_base', () => {
  it('控制器保持 Foundation 生命周期、state/cache 与受控判断', async () => {
    const controller = new BaseComponent<TestProps, TestState, { locale: string }>({
      props: { value: undefined, 'data-probe': 'base' },
      state: { count: 0 },
      context: { locale: 'zh-CN' },
    });
    const init = vi.fn();
    const destroy = vi.fn();
    controller.foundation = { init, destroy };

    controller.mount();
    expect(init).toHaveBeenCalledOnce();
    expect(controller.isControlled('value')).toBe(true);
    expect(controller.isControlled('missing')).toBe(false);
    expect(controller.getDataAttr()).toEqual({ 'data-probe': 'base' });
    expect(controller.adapter.getContext('locale')).toBe('zh-CN');

    const stateCallback = vi.fn();
    controller.adapter.setState({ count: 1 }, stateCallback);
    expect(controller.state.count).toBe(1);
    expect(stateCallback).toHaveBeenCalledOnce();
    await controller.setStateAsync({ count: 2 });
    expect(controller.state.count).toBe(2);

    controller.adapter.setCache('probe', 42);
    expect(controller.adapter.getCache('probe')).toBe(42);
    controller.unmount();
    expect(destroy).toHaveBeenCalledOnce();
    expect(controller.adapter.getCache('probe')).toBeUndefined();
  });

  it('adapter 停止包装事件传播并保留无操作 persistEvent', () => {
    const controller = new BaseComponent({ props: {} });
    const stop = vi.fn();
    const immediate = vi.fn();
    controller.adapter.stopPropagation({
      stopPropagation: stop,
      nativeEvent: { stopImmediatePropagation: immediate },
    });
    expect(stop).toHaveBeenCalledOnce();
    expect(immediate).toHaveBeenCalledOnce();
    expect(controller.adapter.persistEvent({})).toBeUndefined();
  });

  it('useBaseComponent 将 init/destroy 接到 Vue 生命周期', () => {
    const init = vi.fn();
    const destroy = vi.fn();
    const Host = defineComponent({
      setup() {
        const controller = useBaseComponent({ props: {} });
        controller.foundation = { init, destroy };
        return () => h('span', 'base');
      },
    });
    const wrapper = mount(Host);
    expect(init).toHaveBeenCalledOnce();
    wrapper.unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });

  it('导出固定校验状态与可实例化的固定 BaseFoundation', () => {
    expect(VALIDATE_STATUSES).toEqual(['default', 'error', 'warning', 'success']);
    const foundation = new BaseFoundation({});
    expect(foundation.getProps()).toBeUndefined();
    expect(foundation.getStates()).toBeUndefined();
  });

  it('Vue component-utils 识别组件、VNode、DOM 与空 children', () => {
    const Functional = () => h('span', 'functional');
    const ObjectComponent = defineComponent({ render: () => h('span', 'object') });
    const ClassComponent = Object.assign(function ClassComponent() {}, { __vccOpts: {} });
    const componentNode = h(ObjectComponent);

    expect(isFunctionalComponent(Functional)).toBe(true);
    expect(isClassComponent(ClassComponent)).toBe(true);
    expect(isVueComponent(ObjectComponent)).toBe(true);
    expect(isElement(componentNode)).toBe(true);
    expect(isCompositeTypeElement(componentNode)).toBe(true);
    expect(isCompositeTypeElement(h('div'))).toBe(false);
    expect(isHTMLElement(document.createElement('div'))).toBe(true);
    expect(isEmptyChildren([null, false, h('!')])).toBe(false);
    expect(isEmptyChildren([null, false])).toBe(true);
  });
});
