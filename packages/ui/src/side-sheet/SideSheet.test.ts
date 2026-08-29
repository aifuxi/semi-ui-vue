import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider, semiGlobal } from '../config-provider';
import { SideSheet } from './index';

async function settle(): Promise<void> {
  await nextTick();
  await nextTick();
}

async function mountVisible(props: Record<string, unknown> = {}): Promise<VueWrapper> {
  const wrapper = mount(SideSheet, {
    attachTo: document.body,
    props: { motion: false, title: '资源详情', visible: true, ...props },
    slots: { default: () => h('p', { id: 'sheet-body' }, '正文') },
  });
  await settle();
  return wrapper;
}

describe('SideSheet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
    document.body.style.overflow = '';
    document.body.style.width = '';
    delete semiGlobal.config.overrideDefaultProps;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
    document.body.style.overflow = '';
    document.body.style.width = '';
    delete semiGlobal.config.overrideDefaultProps;
    vi.restoreAllMocks();
  });

  it('渲染固定 dialog/header/body/footer DOM、样式、data 与默认尺寸', async () => {
    const wrapper = mount(SideSheet, {
      attachTo: document.body,
      attrs: { 'data-trace': 'side-sheet' },
      props: {
        bodyStyle: { color: 'rgb(1, 2, 3)' },
        className: 'sheet-extra',
        headerStyle: { borderBottomWidth: '2px' },
        maskStyle: { opacity: 0.5 },
        motion: false,
        style: { backgroundColor: 'rgb(4, 5, 6)' },
        title: '资源详情',
        visible: true,
        zIndex: 1200,
      },
      slots: {
        default: () => h('p', '正文'),
        footer: () => h('button', { id: 'footer-action' }, '保存'),
      },
    });
    await settle();

    const portal = document.body.querySelector<HTMLElement>(':scope > .semi-portal');
    const root = portal?.querySelector<HTMLElement>('.semi-sidesheet');
    const dialog = root?.querySelector<HTMLElement>('[role="dialog"]');
    expect(portal?.style.zIndex).toBe('1200');
    expect(root?.classList).toContain('semi-sidesheet-right');
    expect(root?.classList).toContain('sheet-extra');
    expect(root?.dataset.trace).toBe('side-sheet');
    expect(dialog?.classList).toContain('semi-sidesheet-size-small');
    expect(dialog?.style.height).toBe('100%');
    expect(dialog?.style.backgroundColor).toBe('rgb(4, 5, 6)');
    expect(root?.querySelector('[role="heading"]')?.getAttribute('aria-level')).toBe('1');
    expect(root?.querySelector('.semi-sidesheet-title')?.textContent).toBe('资源详情');
    expect(root?.querySelector('.semi-sidesheet-body')?.textContent).toBe('正文');
    expect(root?.querySelector('.semi-sidesheet-footer #footer-action')).not.toBeNull();
    expect(root?.querySelector<HTMLElement>('.semi-sidesheet-mask')?.style.opacity).toBe('0.5');
    expect(
      root?.querySelector<HTMLElement>('.semi-sidesheet-header')?.style.borderBottomWidth,
    ).toBe('2px');
    expect(root?.querySelector<HTMLElement>('.semi-sidesheet-body')?.style.color).toBe(
      'rgb(1, 2, 3)',
    );
    wrapper.unmount();
  });

  it('区分默认 true Boolean 的缺省、显式 false/true 与 SideSheet 全局覆盖', async () => {
    const defaults = await mountVisible();
    expect(document.querySelector('.semi-sidesheet-mask')).not.toBeNull();
    expect(document.querySelector('.semi-sidesheet-close')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    defaults.unmount();

    const explicitFalse = await mountVisible({
      closable: false,
      disableScroll: false,
      mask: false,
    });
    expect(document.querySelector('.semi-sidesheet-mask')).toBeNull();
    expect(document.querySelector('.semi-sidesheet-close')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    explicitFalse.unmount();

    semiGlobal.config.overrideDefaultProps = {
      SideSheet: { closable: false, disableScroll: false, mask: false, maskClosable: false },
    };
    const inherited = await mountVisible();
    expect(document.querySelector('.semi-sidesheet-mask')).toBeNull();
    expect(document.querySelector('.semi-sidesheet-close')).toBeNull();
    inherited.unmount();

    const explicitTrue = await mountVisible({
      closable: true,
      disableScroll: true,
      mask: true,
      maskClosable: true,
    });
    expect(document.querySelector('.semi-sidesheet-mask')).not.toBeNull();
    expect(document.querySelector('.semi-sidesheet-close')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    explicitTrue.unmount();
  });

  it('四个 placement、width/height、mask=false 与 canVerticalSetWidth 保留固定布局', async () => {
    const wrapper = await mountVisible({ placement: 'left', width: '413px' });
    const dialog = () => document.querySelector<HTMLElement>('.semi-sidesheet-inner')!;
    const root = () => document.querySelector<HTMLElement>('.semi-sidesheet')!;
    expect(dialog().style.width).toBe('413px');
    expect(dialog().style.height).toBe('100%');

    await wrapper.setProps({ height: '320px', placement: 'top', width: '413px' });
    await settle();
    expect(root().classList).toContain('semi-sidesheet-horizontal');
    expect(dialog().style.width).toBe('100%');
    expect(dialog().style.height).toBe('320px');

    await wrapper.setProps({ canVerticalSetWidth: true });
    await settle();
    expect(dialog().style.width).toBe('413px');

    await wrapper.setProps({ canVerticalSetWidth: false, mask: false, placement: 'right' });
    await settle();
    expect(root().classList).toContain('semi-sidesheet-fixed');
    expect(root().style.width).toBe('413px');
    expect(dialog().style.width).toBe('100%');
    wrapper.unmount();
  });

  it('title/footer/closeIcon slot 优先于 prop，并保留显式空 footer', async () => {
    const wrapper = mount(SideSheet, {
      attachTo: document.body,
      props: {
        closeIcon: 'prop-close',
        footer: 'prop-footer',
        motion: false,
        title: 'prop-title',
        visible: true,
      },
      slots: {
        closeIcon: () => h('span', { id: 'slot-close' }, '×'),
        default: () => 'slot-body',
        footer: () => h('span', { id: 'slot-footer' }, 'slot-footer'),
        title: () => h('span', { id: 'slot-title' }, 'slot-title'),
      },
    });
    await settle();
    expect(document.querySelector('#slot-title')).not.toBeNull();
    expect(document.querySelector('#slot-footer')).not.toBeNull();
    expect(document.querySelector('#slot-close')).not.toBeNull();
    expect(document.body.textContent).not.toContain('prop-title');
    expect(document.body.textContent).not.toContain('prop-footer');
    wrapper.unmount();
  });

  it('close、mask 与 Escape 按 update -> cancel 顺序触发，并只在开启时响应', async () => {
    const order: string[] = [];
    const visible = ref(true);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SideSheet,
            {
              'onUpdate:visible': (next: boolean) => {
                order.push(`update:${next}`);
                visible.value = next;
              },
              closeOnEsc: true,
              motion: false,
              onCancel: () => order.push('cancel'),
              title: '可关闭',
              visible: visible.value,
            },
            () => h('button', { id: 'inside' }, 'inside'),
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await settle();

    document.querySelector<HTMLButtonElement>('.semi-sidesheet-close')?.click();
    expect(order).toEqual(['update:false', 'cancel']);
    await settle();
    expect(document.querySelector('.semi-sidesheet')).toBeNull();

    visible.value = true;
    await settle();
    document.querySelector<HTMLElement>('.semi-sidesheet-mask')?.click();
    expect(order.slice(-2)).toEqual(['update:false', 'cancel']);

    visible.value = true;
    await settle();
    window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 27 }));
    expect(order.slice(-2)).toEqual(['update:false', 'cancel']);
    wrapper.unmount();

    const onDisabledCancel = vi.fn();
    const disabled = await mountVisible({ closeOnEsc: false, onCancel: onDisabledCancel });
    window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 27 }));
    expect(onDisabledCancel).not.toHaveBeenCalled();
    disabled.unmount();
  });

  it('稳定自定义容器首次 visible 即为 Portal 父节点、继承 RTL 且不锁 body', async () => {
    const target = document.createElement('div');
    target.style.position = 'relative';
    document.body.appendChild(target);
    const wrapper = mount(ConfigProvider, {
      attachTo: document.body,
      props: { direction: 'rtl', getPopupContainer: () => target },
      slots: {
        default: () => h(SideSheet, { motion: false, title: 'RTL', visible: true }, () => '正文'),
      },
    });
    await settle();

    const portal = target.querySelector<HTMLElement>(':scope > .semi-portal');
    expect(portal).not.toBeNull();
    expect(portal?.style.position).toBe('static');
    expect(portal?.querySelector('.semi-sidesheet-popup')).not.toBeNull();
    expect(portal?.querySelector('.semi-sidesheet-rtl')).not.toBeNull();
    expect(document.body.style.overflow).toBe('');
    wrapper.unmount();
    expect(target.querySelector('.semi-portal')).toBeNull();
  });

  it('keepDOM 与 motion 生命周期只触发一次可见回调并完整清理 body', async () => {
    const changes: boolean[] = [];
    const wrapper = mount(SideSheet, {
      attachTo: document.body,
      props: {
        afterVisibleChange: (visible: boolean) => changes.push(visible),
        keepDOM: true,
        visible: false,
      },
      slots: { default: () => h('input', { value: 'stable' }) },
    });
    await settle();
    expect(document.querySelector('.semi-sidesheet-hidden')).not.toBeNull();

    await wrapper.setProps({ visible: true });
    await settle();
    expect(changes).toEqual([true]);
    expect(document.body.style.overflow).toBe('hidden');

    await wrapper.setProps({ visible: false });
    await settle();
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('.semi-sidesheet-inner')?.className).toContain(
      'semi-sidesheet-animation-content_hide_right',
    );
    document
      .querySelector<HTMLElement>('.semi-sidesheet-inner')
      ?.dispatchEvent(new Event('animationend', { bubbles: true }));
    await settle();
    expect(changes).toEqual([true, false]);
    expect(document.querySelector('.semi-sidesheet-hidden input')?.getAttribute('value')).toBe(
      'stable',
    );

    await vi.advanceTimersByTimeAsync(180);
    expect(changes).toEqual([true, false]);
    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
