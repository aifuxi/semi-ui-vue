import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IconSend } from '@aifuxi/semi-icons-vue';
import { DragMove } from '../drag-move';
import { ConfigProvider, semiGlobal } from '../config-provider';
import { Modal } from './index';

afterEach(async () => {
  Modal.destroyAll();
  await nextTick();
  await nextTick();
  delete semiGlobal.config.overrideDefaultProps;
  document.body.style.overflow = '';
  document.body.style.width = '';
  document.body.replaceChildren();
});

async function mountVisible(props: Record<string, unknown> = {}): Promise<VueWrapper> {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: { visible: true, motion: false, title: '标题', ...props },
    slots: { default: () => h('p', '内容') },
  });
  await nextTick();
  await nextTick();
  return wrapper;
}

describe('Modal', () => {
  it('modalRender 只包装内容节点，保留外层尺寸定位且 DragMove 作用于 dialog', async () => {
    const wrapper = await mountVisible({
      width: '600px',
      modalRender: (dialog: import('vue').VNodeChild) =>
        h('section', { 'data-modal-render': '' }, [
          h(DragMove, { positionStrategy: 'relative' }, { default: () => dialog }),
        ]),
    });
    const outer = document.querySelector<HTMLElement>('.semi-modal')!;
    const content = document.querySelector<HTMLElement>('.semi-modal-content')!;
    expect(outer.querySelector(':scope > [data-modal-render] > [role="dialog"]')).toBe(content);
    expect(outer.style.width).toBe('600px');
    expect(outer.style.cursor).toBe('');
    expect(content.style.cursor).toBe('move');
    expect(content.style.position).toBe('relative');
    const cancel = content.querySelector<HTMLButtonElement>('[aria-label="cancel"]')!;
    expect(cancel).not.toBeNull();
    cancel.click();
    await nextTick();
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
    wrapper.unmount();
    expect(document.querySelector('[data-modal-render]')).toBeNull();
  });

  it('区分默认 true Boolean 的缺省、显式 false、显式 true 与全局覆盖', async () => {
    const defaults = await mountVisible();
    expect(document.querySelector('.semi-modal-mask')).not.toBeNull();
    expect(document.querySelector('.semi-modal-close')).not.toBeNull();
    defaults.unmount();

    const explicitFalse = await mountVisible({
      closable: false,
      mask: false,
      maskClosable: false,
      closeOnEsc: false,
    });
    expect(document.querySelector('.semi-modal-mask')).toBeNull();
    expect(document.querySelector('.semi-modal-close')).toBeNull();
    explicitFalse.unmount();

    semiGlobal.config.overrideDefaultProps = {
      Modal: { closable: false, mask: false, maskClosable: false },
    };
    const globalDefaults = await mountVisible();
    expect(document.querySelector('.semi-modal-mask')).toBeNull();
    expect(document.querySelector('.semi-modal-close')).toBeNull();
    globalDefaults.unmount();

    const explicitTrue = await mountVisible({ closable: true, mask: true, maskClosable: true });
    expect(document.querySelector('.semi-modal-mask')).not.toBeNull();
    expect(document.querySelector('.semi-modal-close')).not.toBeNull();
    explicitTrue.unmount();
  });

  it('稳定自定义容器首次 visible 即为 portal 父节点并保留 popup/maskFixed 语义', async () => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.appendChild(container);
    const wrapper = await mountVisible({ getPopupContainer: () => container });
    const portal = container.querySelector(':scope > .semi-portal') as HTMLElement | null;
    expect(portal).not.toBeNull();
    expect(portal?.style.position).toBe('static');
    expect(portal?.querySelector('.semi-modal-popup')).not.toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');

    wrapper.unmount();
    container.replaceChildren();
    const fixed = await mountVisible({ getPopupContainer: () => container, maskFixed: true });
    await nextTick();
    expect(container.querySelector('.semi-modal-fixed')).not.toBeNull();
    expect(container.querySelector('.semi-modal-popup')).toBeNull();
    fixed.unmount();
  });

  it('close、mask、ESC、OK 顺序与 Promise loading 对齐', async () => {
    const order: string[] = [];
    let resolveOk!: () => void;
    const okPromise = new Promise<void>((resolve) => {
      resolveOk = resolve;
    });
    const wrapper = await mountVisible({
      onCancel: () => {
        order.push('cancel');
      },
      onOk: () => okPromise,
      'onUpdate:visible': (visible: boolean) => {
        order.push(`update:${visible}`);
        void wrapper.setProps({ visible });
      },
    });

    (document.querySelector('.semi-modal-wrap') as HTMLElement).click();
    expect(order).toEqual(['update:false', 'cancel']);
    await nextTick();
    expect(document.querySelector('.semi-modal')).toBeNull();

    await wrapper.setProps({ visible: true });
    await nextTick();
    (document.querySelector('[aria-label="confirm"]') as HTMLButtonElement).click();
    await nextTick();
    expect(document.querySelector('[aria-label="confirm"]')?.classList).toContain(
      'semi-button-loading',
    );
    resolveOk();
    await flushPromises();
    expect(document.querySelector('[aria-label="confirm"]')?.classList).not.toContain(
      'semi-button-loading',
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', keyCode: 27 }),
    );
    expect(order.slice(-2)).toEqual(['update:false', 'cancel']);
    wrapper.unmount();
  });

  it('keepDOM/lazyRender/motion 收敛到正确 DOM 和 afterClose 终态', async () => {
    const afterClose = vi.fn();
    const wrapper = mount(Modal, {
      attachTo: document.body,
      props: {
        visible: false,
        motion: false,
        keepDOM: true,
        lazyRender: false,
        onAfterClose: afterClose,
      },
      slots: { default: () => h('input', { value: 'stable' }) },
    });
    await nextTick();
    expect(document.querySelector('.semi-modal-displayNone')).not.toBeNull();
    expect(afterClose).not.toHaveBeenCalled();

    await wrapper.setProps({ visible: true });
    await nextTick();
    expect(document.querySelector('.semi-modal-displayNone')).toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(document.querySelector('.semi-modal-displayNone')).not.toBeNull();
    expect(document.querySelector('input')?.getAttribute('value')).toBe('stable');
    expect(document.body.style.overflow).toBe('');
    expect(afterClose).toHaveBeenCalledTimes(1);
    wrapper.unmount();

    const lazy = mount(Modal, {
      attachTo: document.body,
      props: { visible: false, motion: false, keepDOM: true, lazyRender: true },
    });
    await nextTick();
    expect(document.querySelector('.semi-modal')).toBeNull();
    lazy.unmount();
  });

  it('焦点陷阱、Tab 循环、关闭恢复与卸载清理对齐', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'open';
    document.body.appendChild(opener);
    opener.focus();
    const wrapper = await mountVisible({
      'onUpdate:visible': (visible: boolean) => void wrapper.setProps({ visible }),
    });
    await nextTick();
    expect((document.activeElement as HTMLElement)?.getAttribute('aria-label')).toBe('cancel');

    const buttons = [...document.querySelectorAll<HTMLButtonElement>('.semi-modal-content button')];
    const first = buttons[0]!;
    const last = buttons.at(-1)!;
    last.focus();
    last.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' }),
    );
    expect(document.activeElement).toBe(first);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', keyCode: 27 }),
    );
    await nextTick();
    expect(document.activeElement).toBe(opener);
    wrapper.unmount();
  });

  it('命令式自定义 Semi Icon 覆盖 size 和 class，普通节点与 null 保持原样', async () => {
    const original = h(IconSend, { size: 'small', class: 'custom-original' });
    const handle = Modal.info({ title: 'Custom', icon: original, motion: false });
    await nextTick();
    const icon = document.querySelector('.semi-icon-send')!;
    expect(icon.classList).toContain('semi-icon-extra-large');
    expect(icon.classList).toContain('semi-modal-confirm-icon');
    expect(icon.classList).toContain('semi-modal-info-icon');
    expect(icon.classList).not.toContain('custom-original');
    expect(original.props?.size).toBe('small');
    expect(original.props?.class).toBe('custom-original');
    handle.update({ icon: h('span', { class: 'plain-icon' }, 'plain') });
    await nextTick();
    const plain = document.querySelector('.plain-icon')!;
    expect(plain.textContent).toBe('plain');
    expect(plain.getAttribute('class')).toBe('plain-icon');
    expect(plain.hasAttribute('size')).toBe(false);
    handle.update({ icon: null });
    await nextTick();
    expect(document.querySelector('.semi-modal-icon-wrapper')).toBeNull();
    handle.destroy();
    await nextTick();
  });

  it('静态五类方法支持 update/destroy/destroyAll 与 Promise rejection 保持打开', async () => {
    const handle = Modal.confirm({ title: '旧标题', content: '旧内容', motion: false });
    await nextTick();
    expect(document.querySelector('.semi-modal-confirm-title-text')?.textContent).toBe('旧标题');
    handle.update({ title: '新标题', content: '新内容' });
    await nextTick();
    expect(document.querySelector('.semi-modal-confirm-title-text')?.textContent).toBe('新标题');
    expect(document.querySelector('.semi-modal-confirm-content')?.textContent).toBe('新内容');
    handle.destroy();
    await nextTick();
    await nextTick();
    expect(document.querySelector('.semi-modal-confirm')).toBeNull();

    Modal.info({ title: 'Info', motion: false });
    Modal.error({ title: 'Error', motion: false });
    await nextTick();
    expect(document.querySelectorAll('.semi-modal-confirm')).toHaveLength(2);
    Modal.destroyAll();
    await nextTick();
    expect(document.querySelectorAll('.semi-modal-confirm')).toHaveLength(0);

    Modal.warning({
      title: 'Reject',
      content: 'Stay',
      motion: false,
      onOk: () => Promise.reject(new Error('expected')),
    });
    await nextTick();
    (document.querySelector('[aria-label="confirm"]') as HTMLButtonElement).click();
    await flushPromises();
    expect(document.querySelector('.semi-modal-confirm')).not.toBeNull();
    expect(document.querySelector('[aria-label="confirm"]')?.classList).not.toContain(
      'semi-button-loading',
    );
  });

  it('useModal holder 保留 ConfigProvider 上下文并清理实例', async () => {
    const Host = defineComponent({
      setup() {
        const [modal, Holder] = Modal.useModal();
        onMounted(() => modal.success({ title: 'Context', content: 'Holder', motion: false }));
        return () => h(Holder);
      },
    });
    const wrapper = mount(ConfigProvider, {
      attachTo: document.body,
      props: { locale: { Modal: { confirm: 'Yes', cancel: 'No' } } },
      slots: { default: () => h(Host) },
    });
    await nextTick();
    await nextTick();
    expect(document.querySelector('[aria-label="cancel"]')?.textContent).toContain('No');
    expect(document.querySelector('[aria-label="confirm"]')?.textContent).toContain('Yes');
    (document.querySelector('[aria-label="cancel"]') as HTMLButtonElement).click();
    await nextTick();
    expect(document.querySelector('.semi-modal-confirm')).toBeNull();
    wrapper.unmount();
  });
});
