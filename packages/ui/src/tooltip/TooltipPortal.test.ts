import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { Text, h, nextTick } from 'vue';

import TooltipPortal from './TooltipPortal.vue';
import type { TooltipState } from './types';

// Exercise the portal's input/output boundary for positioning states that jsdom
// cannot produce through layout. Real positioning remains covered by Chromium.
function mountPortal(stateOverrides: Partial<TooltipState> = {}) {
  const state: TooltipState = {
    containerStyle: { left: '12px', top: '24px', transformOrigin: 'center' },
    displayNone: false,
    isInsert: true,
    isPositionUpdated: false,
    placement: 'top',
    portalEventSet: {},
    transitionState: '',
    triggerEventSet: {},
    visible: true,
    ...stateOverrides,
  };
  return mount(TooltipPortal, {
    props: {
      clickToHide: false,
      content: '内容',
      direction: 'ltr',
      initialFocusRef: () => undefined,
      motion: true,
      portalTarget: document.body,
      prefixCls: 'semi-tooltip',
      role: 'tooltip',
      showArrow: true,
      state,
      stopPropagation: true,
    },
    slots: { arrow: () => h(Text) },
  });
}

afterEach(() => document.body.replaceChildren());

describe('TooltipPortal 渲染边界', () => {
  it('保留字符串坐标和箭头偏移，定位完成前隐藏用户 opacity', async () => {
    const wrapper = mountPortal({
      containerStyle: {
        left: '12px',
        top: '24px',
        '--semi-tooltip-arrow-offset-x': '3px',
        '--semi-tooltip-arrow-offset-y': '4px',
      },
    });
    await wrapper.setProps({ popupStyle: { opacity: 0.6, backgroundColor: 'red' } });
    const popup = document.body.querySelector<HTMLElement>('[role="tooltip"]')!;
    const inner = document.body.querySelector<HTMLElement>('.semi-portal-inner')!;
    expect(inner.style.left).toBe('12px');
    expect(inner.style.top).toBe('24px');
    expect(popup.style.opacity).toBe('0');
    expect(popup.style.getPropertyValue('--semi-tooltip-arrow-offset-x')).toBe('3px');
    expect(popup.style.getPropertyValue('--semi-tooltip-arrow-offset-y')).toBe('4px');
    await wrapper.setProps({ state: { ...wrapper.props('state'), isPositionUpdated: true } });
    expect(popup.style.opacity).toBe('0.6');
    await wrapper.setProps({ showArrow: h('i', { class: 'prop-arrow' }) });
    expect(popup.querySelector('.prop-arrow')).not.toBeNull();
    await wrapper.setProps({ showArrow: undefined });
    expect(popup.querySelector('svg')).toBeNull();
    wrapper.unmount();
  });

  it('无过渡时忽略迟到的动画通知，保留键盘事件并按配置阻止冒泡', async () => {
    const wrapper = mountPortal();
    await nextTick();
    const popup = document.body.querySelector<HTMLElement>('[role="tooltip"]')!;
    const inner = document.body.querySelector<HTMLElement>('.semi-portal-inner')!;
    popup.dispatchEvent(new Event('animationstart'));
    popup.dispatchEvent(new Event('animationend'));
    await nextTick();
    expect(wrapper.emitted('animationStart')).toBeUndefined();
    expect(wrapper.emitted('animationEnd')).toBeUndefined();
    const click = new MouseEvent('click', { bubbles: true });
    let bubbled = 0;
    const onClick = () => {
      bubbled += 1;
    };
    document.body.addEventListener('click', onClick);
    inner.dispatchEvent(click);
    expect(bubbled).toBe(0);
    expect(wrapper.emitted('hide')).toBeUndefined();
    await wrapper.setProps({ stopPropagation: false, clickToHide: true });
    inner.click();
    expect(bubbled).toBe(1);
    expect(wrapper.emitted('hide')).toHaveLength(1);
    document.body.removeEventListener('click', onClick);
    const keydown = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    inner.dispatchEvent(keydown);
    expect(wrapper.emitted('keydown')).toEqual([[keydown]]);
    wrapper.unmount();
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
  });
});
