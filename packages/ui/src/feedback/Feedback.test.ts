import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref, type VNodeChild } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { LocaleProvider } from '../locale';
import Feedback from './Feedback.vue';

async function settle(): Promise<void> {
  await nextTick();
  await nextTick();
}

async function mountVisible(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
): Promise<VueWrapper> {
  const wrapper = mount(Feedback, {
    attachTo: document.body,
    props: { motion: false, title: '反馈', visible: true, ...props },
    slots,
  });
  await settle();
  return wrapper;
}

afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.style.overflow = '';
  document.body.style.width = '';
  document.body.replaceChildren();
  await nextTick();
});

describe('Feedback', () => {
  it('默认 popup/emoji DOM、默认容器参数、值通知与坏评原因对齐', async () => {
    const values: unknown[] = [];
    const wrapper = await mountVisible({ onValueChange: (value: unknown) => values.push(value) });
    const root = document.querySelector<HTMLElement>('.semi-sidesheet.semi-feedback');
    expect(root?.classList).toContain('semi-feedback-emoji');
    expect(root?.classList).toContain('semi-sidesheet-bottom');
    expect(root?.querySelector('.semi-sidesheet-mask')).toBeNull();
    expect(root?.querySelectorAll('.semi-feedback-emoji-item')).toHaveLength(3);
    expect(root?.querySelectorAll('.semi-feedback-footer .semi-button')).toHaveLength(2);
    expect(root?.querySelectorAll('.semi-feedback-footer .semi-button')[0]?.textContent).toBe(
      '取消',
    );
    expect(root?.querySelectorAll('.semi-feedback-footer .semi-button')[1]?.textContent).toBe(
      '提交',
    );
    expect(root?.querySelectorAll('.semi-feedback-footer .semi-button')[1]?.classList).toContain(
      'semi-button-disabled',
    );

    const bad = root?.querySelector<HTMLElement>('[data-value="😞"]');
    bad?.click();
    await settle();
    expect(values).toEqual([{ emoji: '😞' }]);
    expect(bad?.classList).toContain('semi-feedback-emoji-item-selected');
    const textarea = document.querySelector<HTMLTextAreaElement>('.semi-feedback textarea');
    expect(textarea?.placeholder).toBe('Provider additional feedback(optional)');
    if (textarea) {
      textarea.value = '需要改进';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    await settle();
    expect(values).toEqual([{ emoji: '😞' }, { emoji: '😞', text: '需要改进' }]);
    expect(
      root?.querySelectorAll('.semi-feedback-footer .semi-button')[1]?.classList,
    ).not.toContain('semi-button-disabled');
    wrapper.unmount();
  });

  it('text/radio/checkbox 按固定事件顺序通知并维持提交禁用规则', async () => {
    const textValues: unknown[] = [];
    const text = await mountVisible({
      type: 'text',
      onValueChange: (value: unknown) => textValues.push(value),
    });
    const textarea = document.querySelector<HTMLTextAreaElement>('.semi-feedback textarea')!;
    textarea.value = '建议';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    expect(textValues).toEqual(['建议']);
    text.unmount();

    const radioOrder: string[] = [];
    const radio = await mountVisible({
      type: 'radio',
      radioGroupProps: {
        onChange: () => radioOrder.push('group'),
        options: ['访客', '开发者'],
      },
      onValueChange: (value: unknown) => radioOrder.push(`value:${String(value)}`),
    });
    document.querySelectorAll<HTMLInputElement>('.semi-feedback input[type="radio"]')[1]?.click();
    await settle();
    expect(radioOrder).toEqual(['group', 'value:开发者']);
    radio.unmount();

    const checkboxOrder: string[] = [];
    const checkbox = await mountVisible({
      type: 'checkbox',
      checkboxGroupProps: {
        onChange: () => checkboxOrder.push('group'),
        options: ['抖音', '豆包'],
      },
      onValueChange: (value: unknown) =>
        checkboxOrder.push(`value:${(value as unknown[]).join(',')}`),
    });
    const inputs = document.querySelectorAll<HTMLInputElement>(
      '.semi-feedback input[type="checkbox"]',
    );
    inputs[0]?.click();
    inputs[1]?.click();
    await settle();
    expect(checkboxOrder).toEqual(['group', 'value:抖音', 'group', 'value:抖音,豆包']);
    inputs[0]?.click();
    inputs[1]?.click();
    await settle();
    expect(document.querySelectorAll('.semi-feedback-footer .semi-button')[1]?.classList).toContain(
      'semi-button-disabled',
    );
    checkbox.unmount();
  });

  it('显式 textAreaProps.onChange 按固定 spread 顺序覆盖内部值 handler', async () => {
    const textAreaChange = vi.fn();
    const valueChange = vi.fn();
    const wrapper = await mountVisible({
      onValueChange: valueChange,
      textAreaProps: { onChange: textAreaChange, placeholder: '自定义占位符' },
      type: 'text',
    });
    const textarea = document.querySelector<HTMLTextAreaElement>('.semi-feedback textarea')!;
    expect(textarea.placeholder).toBe('自定义占位符');
    textarea.value = '只通知 TextArea';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    expect(textAreaChange).toHaveBeenCalledWith('只通知 TextArea', expect.any(Event));
    expect(valueChange).not.toHaveBeenCalled();
    expect(document.querySelectorAll('.semi-feedback-footer .semi-button')[1]?.classList).toContain(
      'semi-button-disabled',
    );
    wrapper.unmount();
  });

  it('custom slot、content 包裹、footer/null 与按钮 props 按 spread 优先级生效', async () => {
    const customClick = vi.fn();
    const wrapper = await mountVisible(
      {
        footer: null,
        okButtonProps: { disabled: false, onClick: customClick },
        renderContent: (content: unknown) =>
          h('section', { id: 'content-wrap' }, [content as VNodeChild]),
        type: 'custom',
      },
      { default: () => h('strong', { id: 'custom-content' }, '自定义反馈') },
    );
    expect(document.querySelector('#content-wrap #custom-content')?.textContent).toBe('自定义反馈');
    expect(document.querySelector('.semi-feedback-footer')).toBeNull();
    wrapper.unmount();

    const buttons = await mountVisible({
      okButtonProps: { disabled: false, onClick: customClick },
    });
    const submit = document.querySelectorAll<HTMLButtonElement>('.semi-feedback-footer button')[1]!;
    expect(submit.disabled).toBe(false);
    submit.click();
    expect(customClick).toHaveBeenCalledTimes(1);
    buttons.unmount();
  });

  it('popup Promise 确定显示 loading、resolve 后清值，取消同步清值', async () => {
    let resolveOk!: () => void;
    const okPromise = new Promise<void>((resolve) => {
      resolveOk = resolve;
    });
    const onCancel = vi.fn();
    const wrapper = await mountVisible({ onCancel, onOk: () => okPromise });
    document.querySelector<HTMLElement>('[data-value="😃"]')?.click();
    await settle();
    const buttons = document.querySelectorAll<HTMLButtonElement>('.semi-feedback-footer button');
    buttons[1]?.click();
    await settle();
    expect(buttons[1]?.classList).toContain('semi-button-loading');
    resolveOk();
    await flushPromises();
    await settle();
    expect(buttons[1]?.classList).not.toContain('semi-button-loading');
    expect(buttons[1]?.classList).toContain('semi-button-disabled');

    document.querySelector<HTMLElement>('[data-value="😐"]')?.click();
    buttons[0]?.click();
    await settle();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(buttons[1]?.classList).toContain('semi-button-disabled');
    wrapper.unmount();
  });

  it('modal 使用容器 Promise loading、用户 okButtonProps 覆盖默认 disabled，并转发 v-model', async () => {
    const visible = ref(true);
    let resolveOk!: () => void;
    const okPromise = new Promise<void>((resolve) => {
      resolveOk = resolve;
    });
    const Host = defineComponent({
      setup() {
        return () =>
          h(Feedback, {
            'onUpdate:visible': (next: boolean) => {
              visible.value = next;
            },
            mode: 'modal',
            motion: false,
            okButtonProps: { disabled: false },
            onOk: () => okPromise,
            title: 'Modal 反馈',
            visible: visible.value,
          });
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await settle();
    const confirm = document.querySelector<HTMLButtonElement>('[aria-label="confirm"]')!;
    expect(confirm.disabled).toBe(false);
    confirm.click();
    await settle();
    expect(confirm.classList).toContain('semi-button-loading');
    resolveOk();
    await flushPromises();
    expect(confirm.classList).not.toContain('semi-button-loading');

    document.querySelector<HTMLButtonElement>('.semi-modal-close')?.click();
    await settle();
    expect(visible.value).toBe(false);
    wrapper.unmount();
  });

  it('稳定自定义容器首次挂载、RTL/Locale 与卸载清理沿用容器契约', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    const wrapper = mount(ConfigProvider, {
      attachTo: document.body,
      props: {
        direction: 'rtl',
        getPopupContainer: () => target,
        locale: { code: 'test', Feedback: { cancel: 'Abort', submit: 'Send' } },
      },
      slots: {
        default: () => h(Feedback, { motion: false, title: 'RTL', visible: true }),
      },
    });
    await settle();
    expect(target.querySelector(':scope > .semi-portal .semi-feedback')).not.toBeNull();
    expect(target.querySelector('.semi-sidesheet-rtl')).not.toBeNull();
    expect(target.querySelectorAll('.semi-feedback-footer button')[0]?.textContent).toBe('Abort');
    expect(target.querySelectorAll('.semi-feedback-footer button')[1]?.textContent).toBe('Send');
    wrapper.unmount();
    await settle();
    expect(target.querySelector('.semi-portal')).toBeNull();
  });

  it('脱离 ConfigProvider 时读取 LocaleProvider 的 Feedback 文案', async () => {
    const wrapper = mount(LocaleProvider, {
      attachTo: document.body,
      props: {
        locale: { code: 'feedback-test', Feedback: { cancel: 'Back', submit: 'Send' } },
      },
      slots: {
        default: () => h(Feedback, { motion: false, title: 'Locale', visible: true }),
      },
    });
    await settle();
    expect(document.querySelectorAll('.semi-feedback-footer button')[0]?.textContent).toBe('Back');
    expect(document.querySelectorAll('.semi-feedback-footer button')[1]?.textContent).toBe('Send');
    wrapper.unmount();
  });
});
