import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import TagInput from './index';

async function setInput(wrapper: ReturnType<typeof mount>, value: string): Promise<void> {
  await wrapper.get('input').setValue(value);
  await nextTick();
}

async function pressInput(
  wrapper: ReturnType<typeof mount>,
  key: string,
  keyCode: number,
): Promise<void> {
  await wrapper.get('input').trigger('keydown', { key, keyCode });
  await nextTick();
}

async function flushPortal(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('TagInput', () => {
  beforeEach(() => document.body.replaceChildren());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('保留固定 DOM、尺寸、校验、前后缀、ARIA 与 data-*', () => {
    const wrapper = mount(TagInput, {
      attrs: { 'aria-label': '标签编辑器', 'data-source': 'unit' },
      props: {
        defaultValue: ['Semi'],
        disabled: true,
        insetLabel: '平台',
        insetLabelId: 'platform-label',
        size: 'large',
        suffix: '个',
        validateStatus: 'error',
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-tagInput',
        'semi-tagInput-disabled',
        'semi-tagInput-error',
        'semi-tagInput-large',
        'semi-tagInput-with-prefix',
        'semi-tagInput-with-suffix',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-disabled': 'true',
      'aria-invalid': 'true',
      'aria-label': '标签编辑器',
      'data-source': 'unit',
    });
    expect(wrapper.get('#platform-label').text()).toBe('平台');
    expect(wrapper.get('.semi-tag-content').text()).toBe('Semi');
    expect(wrapper.get('input').attributes()).toMatchObject({
      'aria-label': 'input value',
      disabled: '',
    });
  });

  it('Enter 批量添加并过滤空白，Backspace/删除按钮保持事件顺序', async () => {
    const order: string[] = [];
    const wrapper = mount(TagInput, {
      props: {
        defaultValue: ['base'],
        separator: [',', '|'],
        onAdd: () => order.push('add'),
        onChange: () => order.push('change'),
        onInputChange: () => order.push('input'),
        onRemove: () => order.push('remove'),
      },
    });
    await setInput(wrapper, 'one,,two|  ');
    order.length = 0;
    await pressInput(wrapper, 'Enter', 13);
    expect(wrapper.findAll('.semi-tag-content').map((item) => item.text())).toEqual([
      'base',
      'one',
      'two',
    ]);
    expect(order).toEqual(['change', 'add', 'input']);

    order.length = 0;
    await pressInput(wrapper, 'Backspace', 8);
    expect(order).toEqual(['change', 'remove']);
    expect(wrapper.findAll('.semi-tag-content').map((item) => item.text())).toEqual([
      'base',
      'one',
    ]);

    order.length = 0;
    await wrapper.findAll('.semi-tag-close')[0]!.trigger('click');
    expect(order).toEqual(['change', 'remove']);
    expect(wrapper.findAll('.semi-tag-content').map((item) => item.text())).toEqual(['one']);
  });

  it.each([
    ['missing', {}, 2],
    ['explicit false', { allowDuplicates: false }, 1],
    ['explicit true', { allowDuplicates: true }, 2],
  ] as const)('区分 allowDuplicates %s', async (_label, extraProps, count) => {
    const wrapper = mount(TagInput, {
      props: { defaultValue: ['same'], ...extraProps },
    });
    await setInput(wrapper, 'same');
    await pressInput(wrapper, 'Enter', 13);
    expect(wrapper.findAll('.semi-tag-content')).toHaveLength(count);
  });

  it.each([
    ['missing', {}, true],
    ['explicit false', { showContentTooltip: false }, false],
    ['explicit true', { showContentTooltip: true }, true],
  ] as const)('区分 showContentTooltip %s', (_label, extraProps, enabled) => {
    const wrapper = mount(TagInput, {
      props: { defaultValue: ['content'], ...extraProps },
    });
    expect(wrapper.findComponent({ name: 'Tooltip' }).exists()).toBe(enabled);
  });

  it('仅在内容溢出时显示提示，并映射 tooltip/popover 配置', async () => {
    const wrapper = mount(TagInput, {
      props: {
        defaultValue: ['very long content'],
        showContentTooltip: {
          opts: { className: 'custom-tip', mouseEnterDelay: 12, position: 'bottom' },
          type: 'popover',
        },
      },
    });
    const text = wrapper.get('.semi-tagInput-wrapper-typo').element;
    Object.defineProperties(text, {
      clientWidth: { configurable: true, value: 40 },
      scrollWidth: { configurable: true, value: 120 },
    });
    await wrapper.get('.semi-tag').trigger('mouseenter');
    const tooltip = wrapper.findComponent({ name: 'Tooltip' });
    expect(tooltip.props()).toMatchObject({
      class: 'custom-tip',
      condition: true,
      mouseEnterDelay: 12,
      position: 'bottom',
      prefixCls: 'semi-popover',
      role: 'dialog',
    });
  });

  it('区分 showRestTagsPopover/expandRestTagsOnClick 缺省与显式 false', async () => {
    const defaultWrapper = mount(TagInput, {
      props: { defaultValue: ['a', 'b', 'c'], maxTagCount: 1 },
    });
    expect(defaultWrapper.get('.semi-tagInput-wrapper-n').text()).toBe('+2');
    expect(defaultWrapper.findComponent({ name: 'Tooltip' }).exists()).toBe(true);
    await defaultWrapper.trigger('click');
    expect(defaultWrapper.find('.semi-tagInput-wrapper-n').exists()).toBe(false);
    expect(defaultWrapper.findAll('.semi-tag-content')).toHaveLength(3);

    const fixed = mount(TagInput, {
      props: {
        defaultValue: ['a', 'b', 'c'],
        expandRestTagsOnClick: false,
        maxTagCount: 1,
        showRestTagsPopover: false,
      },
    });
    await fixed.trigger('click');
    expect(fixed.get('.semi-tagInput-wrapper-n').text()).toBe('+2');
    expect(fixed.findAll('.semi-tag-content')).toHaveLength(1);
  });

  it('受控 value/modelValue/显式 undefined 只通知并等待回写', async () => {
    const controlled = mount(TagInput, { props: { value: ['a'] } });
    await setInput(controlled, 'b');
    await pressInput(controlled, 'Enter', 13);
    expect(controlled.findAll('.semi-tag-content').map((item) => item.text())).toEqual(['a']);
    expect(controlled.emitted('change')?.at(-1)).toEqual([['a', 'b']]);
    expect(controlled.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']]);
    await controlled.setProps({ value: ['a', 'b'] });
    expect(controlled.findAll('.semi-tag-content')).toHaveLength(2);

    const model = mount(TagInput, { props: { modelValue: ['x'] } });
    await model.find('.semi-tag-close').trigger('click');
    expect(model.findAll('.semi-tag-content')).toHaveLength(1);
    expect(model.emitted('update:modelValue')).toEqual([[[]]]);

    const explicitUndefined = mount(TagInput, {
      props: { defaultValue: ['fallback'], value: undefined },
    });
    expect(explicitUndefined.findAll('.semi-tag-content')).toHaveLength(0);
  });

  it('执行 max/maxLength/IME 和 addOnBlur 门禁', async () => {
    const wrapper = mount(TagInput, { props: { max: 2, maxLength: 3 } });
    await setInput(wrapper, 'toolong');
    expect(wrapper.emitted('inputExceed')).toEqual([['toolong']]);
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('');

    await wrapper.get('input').trigger('compositionstart');
    await wrapper.get('input').setValue('abcd');
    await wrapper.get('input').trigger('compositionend');
    expect(wrapper.emitted('inputExceed')?.at(-1)).toEqual(['abcd']);
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('abc');

    await pressInput(wrapper, 'Enter', 13);
    await setInput(wrapper, 'two');
    await pressInput(wrapper, 'Enter', 13);
    await setInput(wrapper, 'thr');
    await pressInput(wrapper, 'Enter', 13);
    expect(wrapper.findAll('.semi-tag-content')).toHaveLength(2);
    expect(wrapper.emitted('exceed')).toBeTruthy();

    const blur = mount(TagInput, { props: { addOnBlur: true } });
    await setInput(blur, 'blurred');
    await blur.get('input').trigger('blur');
    expect(blur.findAll('.semi-tag-content').map((item) => item.text())).toEqual(['blurred']);
  });

  it('clear、公开 focus/blur、autoFocus 与 disabled 遵循公开合同', async () => {
    const wrapper = mount(TagInput, {
      attachTo: document.body,
      props: { autoFocus: true, defaultValue: ['a'], inputValue: 'draft', showClear: true },
    });
    await nextTick();
    expect(document.activeElement).toBe(wrapper.get('input').element);
    await wrapper.trigger('mouseenter');
    await wrapper.get('[aria-label="Clear TagInput value"]').trigger('click');
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[]]);
    expect(wrapper.emitted('inputChange')?.at(-1)?.[0]).toBe('');
    const exposed = wrapper.vm as unknown as { blur(): void; focus(): void };
    exposed.blur();
    expect(document.activeElement).not.toBe(wrapper.get('input').element);
    exposed.focus();
    expect(document.activeElement).toBe(wrapper.get('input').element);
    wrapper.unmount();

    const disabled = mount(TagInput, { props: { defaultValue: ['a'], disabled: true } });
    (disabled.vm as unknown as { focus(): void }).focus();
    expect(disabled.get('input').element).not.toBe(document.activeElement);
    await disabled.get('.semi-tag').trigger('keydown', { key: 'Delete' });
    expect(disabled.findAll('.semi-tag-content')).toHaveLength(1);
  });

  it('tag slot/函数 prop 获得 close，并在原生拖放后重排', async () => {
    const slotWrapper = mount(TagInput, {
      props: { defaultValue: ['slot'] },
      slots: {
        tag: ({ value, close }: { close: () => void; value: string }) =>
          h('button', { class: 'custom-tag', onClick: close }, value),
      },
    });
    expect(slotWrapper.get('.custom-tag').text()).toBe('slot');
    await slotWrapper.get('.custom-tag').trigger('click');
    expect(slotWrapper.emitted('change')).toEqual([[[]]]);

    const renderWrapper = mount(TagInput, {
      props: {
        defaultValue: ['render'],
        renderTagItem: (value, _index, close) =>
          h('button', { class: 'render-tag', onClick: close }, value),
      },
    });
    await renderWrapper.get('.render-tag').trigger('click');
    expect(renderWrapper.emitted('change')).toEqual([[[]]]);

    const draggable = mount(TagInput, {
      props: { defaultValue: ['a', 'b', 'c'], draggable: true },
    });
    await draggable.trigger('click');
    const tags = draggable.findAll('.semi-tag');
    await tags[0]!.trigger('dragstart');
    await tags[2]!.trigger('drop');
    expect(draggable.findAll('.semi-tag-content').map((item) => item.text())).toEqual([
      'b',
      'c',
      'a',
    ]);
    expect(draggable.emitted('change')).toEqual([[['b', 'c', 'a']]]);
  });

  it('剩余标签 Portal 首次进入稳定自定义容器并在卸载时清理', async () => {
    vi.useFakeTimers();
    const popupRoot = document.createElement('div');
    document.body.append(popupRoot);
    const wrapper = mount(TagInput, {
      attachTo: document.body,
      props: {
        defaultValue: ['a', 'b', 'c'],
        maxTagCount: 1,
        restTagsPopoverProps: { getPopupContainer: () => popupRoot },
      },
    });
    const trigger = wrapper.get('.semi-tagInput-wrapper-n');
    vi.spyOn(trigger.element, 'matches').mockImplementation((selector) => selector === ':hover');
    await trigger.trigger('mouseenter');
    await flushPortal();
    expect(popupRoot.querySelector('.semi-portal')).not.toBeNull();
    expect(popupRoot.querySelector('.semi-popover-wrapper')?.textContent).toContain('b');
    wrapper.unmount();
    expect(popupRoot.querySelector('.semi-portal')).toBeNull();
  });
});
