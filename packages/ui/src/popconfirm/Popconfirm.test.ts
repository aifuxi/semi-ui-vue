import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../button';
import { ConfigProvider, semiGlobal } from '../config-provider';

import Popconfirm from './Popconfirm.vue';

async function flushPopconfirm(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

function popup(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.semi-popconfirm');
}

function action(kind: 'cancel' | 'ok'): HTMLButtonElement {
  return document.body.querySelector<HTMLButtonElement>(`[data-type=${kind}]`)!;
}

describe('Popconfirm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
    delete semiGlobal.config.overrideDefaultProps;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
    delete semiGlobal.config.overrideDefaultProps;
    vi.restoreAllMocks();
  });

  it('点击 trigger 打开固定 DOM，取消按钮先回调再关闭并恢复焦点', async () => {
    const events: string[] = [];
    const wrapper = mount(Popconfirm, {
      attachTo: document.body,
      props: {
        content: '此修改将不可逆',
        motion: false,
        onCancel: () => events.push(`cancel:${String(Boolean(popup()))}`),
        onVisibleChange: (visible) => events.push(`visible:${String(visible)}`),
        title: '确定是否保存？',
      },
      slots: { default: () => h(Button, { id: 'trigger' }, () => '保存') },
    });

    await flushPopconfirm();
    await wrapper.get('#trigger').trigger('click');
    await flushPopconfirm();
    expect(popup()?.querySelector('.semi-popconfirm-header-title')?.textContent).toBe(
      '确定是否保存？',
    );
    expect(popup()?.querySelector('.semi-popconfirm-body')?.textContent).toBe('此修改将不可逆');
    expect(
      popup()?.querySelector('.semi-popconfirm-header-icon .semi-icon-alert_triangle'),
    ).not.toBeNull();
    expect(popup()?.querySelector('.semi-popconfirm-btn-close')).not.toBeNull();
    expect(action('cancel').textContent).toContain('取消');
    expect(action('ok').textContent).toContain('确定');

    action('cancel').click();
    await flushPopconfirm();
    expect(events).toEqual(['visible:true', 'cancel:true', 'visible:false']);
    expect(popup()).toBeNull();
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('defaultVisible、受控 visible 与 disabled 保持独立语义', async () => {
    const defaults = mount(Popconfirm, {
      props: { content: '默认打开', defaultVisible: true, motion: false },
      slots: { default: '<button>默认</button>' },
    });
    await flushPopconfirm();
    expect(popup()?.textContent).toContain('默认打开');
    defaults.unmount();
    await flushPopconfirm();

    const visible = shallowRef(true);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Popconfirm,
            {
              'onUpdate:visible': (nextVisible: boolean) => (visible.value = nextVisible),
              content: '受控',
              motion: false,
              visible: visible.value,
            },
            { default: () => h('button', { id: 'controlled' }, '受控') },
          );
      },
    });
    const controlled = mount(Host);
    await flushPopconfirm();
    action('ok').click();
    await flushPopconfirm();
    expect(visible.value).toBe(false);
    expect(popup()).toBeNull();
    controlled.unmount();

    const disabled = mount(Popconfirm, {
      props: { defaultVisible: true, disabled: true },
      slots: { default: '<button id="disabled-trigger">禁用</button>' },
    });
    await flushPopconfirm();
    expect(disabled.get('#disabled-trigger').attributes('id')).toBe('disabled-trigger');
    expect(document.body.querySelector('.semi-popover-wrapper')).toBeNull();
  });

  it('showCloseIcon 缺省、显式 false/true 与全局覆盖优先级正确', async () => {
    semiGlobal.config.overrideDefaultProps = {
      Popconfirm: { disabled: true, showCloseIcon: false, stopPropagation: false },
    };
    const globallyDisabled = mount(Popconfirm, {
      props: { content: '全局', defaultVisible: true, motion: false },
      slots: { default: '<button>全局</button>' },
    });
    await flushPopconfirm();
    expect(globallyDisabled.find('.semi-popover-wrapper').exists()).toBe(false);
    globallyDisabled.unmount();

    const inherited = mount(Popconfirm, {
      props: { content: '继承', defaultVisible: true, disabled: false, motion: false },
      slots: { default: '<button>继承</button>' },
    });
    await flushPopconfirm();
    expect(popup()?.querySelector('.semi-popconfirm-btn-close')).toBeNull();
    inherited.unmount();
    await flushPopconfirm();

    const explicit = mount(Popconfirm, {
      props: {
        content: '显式',
        defaultVisible: true,
        disabled: false,
        motion: false,
        showCloseIcon: true,
        stopPropagation: true,
      },
      slots: { default: '<button>显式</button>' },
    });
    await flushPopconfirm();
    expect(popup()?.querySelector('.semi-popconfirm-btn-close')).not.toBeNull();
    expect(document.body.querySelector('.semi-popover-wrapper')).not.toBeNull();
    explicit.unmount();

    delete semiGlobal.config.overrideDefaultProps;
    const explicitFalse = mount(Popconfirm, {
      props: { content: '关闭', defaultVisible: true, motion: false, showCloseIcon: false },
      slots: { default: '<button>关闭</button>' },
    });
    await flushPopconfirm();
    expect(popup()?.querySelector('.semi-popconfirm-btn-close')).toBeNull();
    explicitFalse.unmount();
  });

  it('确认 Promise resolve 保持 loading 后关闭，reject 只结束 loading', async () => {
    let resolveConfirm!: () => void;
    const confirm = new Promise<void>((resolve) => (resolveConfirm = resolve));
    const resolved = mount(Popconfirm, {
      props: {
        content: '异步确认',
        defaultVisible: true,
        motion: false,
        onConfirm: () => confirm,
      },
      slots: { default: '<button>异步</button>' },
    });
    await flushPopconfirm();
    action('ok').click();
    await nextTick();
    expect(action('ok').classList).toContain('semi-button-loading');
    expect(popup()).not.toBeNull();
    resolveConfirm();
    await flushPromises();
    await flushPopconfirm();
    expect(popup()).toBeNull();
    resolved.unmount();

    const rejected = mount(Popconfirm, {
      props: {
        content: '异步取消',
        defaultVisible: true,
        motion: false,
        onCancel: () => Promise.reject(new Error('keep open')),
      },
      slots: { default: '<button>异步</button>' },
    });
    await flushPopconfirm();
    action('cancel').click();
    await flushPromises();
    await nextTick();
    expect(popup()).not.toBeNull();
    expect(action('cancel').classList).not.toContain('semi-button-loading');
    rejected.unmount();
  });

  it('Button props 可覆盖类型/loading/onClick，autoFocus 不落到 DOM', async () => {
    const customClick = vi.fn();
    mount(Popconfirm, {
      attachTo: document.body,
      props: {
        cancelButtonProps: { autoFocus: true, class: 'custom-cancel', type: 'danger' },
        content: '按钮',
        motion: false,
        okButtonProps: { loading: true, onClick: customClick, type: 'warning' },
      },
      slots: { default: '<button id="button-props-trigger">按钮</button>' },
    });
    await flushPopconfirm();
    document.querySelector<HTMLButtonElement>('#button-props-trigger')!.click();
    await flushPopconfirm();
    expect(action('cancel').classList).toContain('semi-button-danger');
    expect(action('cancel').classList).toContain('custom-cancel');
    expect(action('cancel').hasAttribute('autofocus')).toBe(false);
    expect(document.activeElement).toBe(action('cancel'));
    expect(action('ok').classList).toContain('semi-button-warning');
    expect(action('ok').classList).toContain('semi-button-loading');
    action('ok').click();
    await nextTick();
    expect(customClick).toHaveBeenCalledOnce();
    expect(popup()).not.toBeNull();
  });

  it('title/content/icon slots、initialFocusRef 与空节点保持 Vue 原生映射', async () => {
    mount(Popconfirm, {
      props: {
        content: 'prop content',
        defaultVisible: true,
        icon: null,
        motion: false,
        title: null,
      },
      slots: {
        content: ({ initialFocusRef }) =>
          h('input', { id: 'slot-input', ref: initialFocusRef, value: 'slot content' }),
        default: '<button>slot</button>',
        icon: () => h('span', { id: 'slot-icon' }, '!'),
        title: () => h('strong', { id: 'slot-title' }, 'slot title'),
      },
    });
    await flushPopconfirm();
    expect(popup()?.querySelector('#slot-icon')).not.toBeNull();
    expect(popup()?.querySelector('#slot-title')?.textContent).toBe('slot title');
    expect(popup()?.querySelector<HTMLInputElement>('#slot-input')?.value).toBe('slot content');
    expect(popup()?.textContent).not.toContain('prop content');
    expect(document.activeElement?.id).toBe('slot-input');
  });

  it('ConfigProvider locale、RTL 默认位置与稳定自定义容器首次挂载对齐', async () => {
    const target = document.createElement('div');
    target.style.position = 'relative';
    document.body.appendChild(target);
    const wrapper = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        getPopupContainer: () => target,
        locale: { code: 'en-US', Popconfirm: { cancel: 'Cancel', confirm: 'Confirm' } },
      },
      slots: {
        default: () =>
          h(
            Popconfirm,
            { content: 'RTL', defaultVisible: true, motion: false },
            { default: () => h('button', 'RTL') },
          ),
      },
    });
    await flushPopconfirm();
    expect(target.querySelector(':scope > .semi-portal')).not.toBeNull();
    expect(target.querySelector('.semi-popover-wrapper')?.getAttribute('x-placement')).toBe(
      'bottomRight',
    );
    expect(target.querySelector('.semi-popconfirm-rtl')).not.toBeNull();
    expect(action('cancel').textContent).toContain('Cancel');
    expect(action('ok').textContent).toContain('Confirm');
    wrapper.unmount();
    expect(target.querySelector('.semi-portal')).toBeNull();
  });

  it('点击卡片内部不触发 outside，外部点击转发 clickOutside', async () => {
    const outside = vi.fn();
    mount(Popconfirm, {
      props: {
        content: '内部',
        defaultVisible: true,
        motion: false,
        onClickOutside: outside,
      },
      slots: { default: '<button>外部</button>' },
    });
    await flushPopconfirm();
    popup()!.click();
    await flushPopconfirm();
    expect(outside).not.toHaveBeenCalled();

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushPopconfirm();
    expect(outside).toHaveBeenCalledOnce();
  });
});
