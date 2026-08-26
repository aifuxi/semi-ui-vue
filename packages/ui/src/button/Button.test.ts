import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Button from './Button.vue';
import ButtonGroup from './ButtonGroup';
import SplitButtonGroup from './SplitButtonGroup.vue';

describe('Button', () => {
  it('renders the pinned default DOM and forwards native attributes', () => {
    const wrapper = mount(Button, {
      attrs: {
        'aria-label': '保存方案',
        class: 'consumer-class',
        'data-consumer': 'button',
        style: { marginRight: '8px' },
      },
      slots: { default: '保存方案' },
    });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes()).toMatchObject({
      'aria-disabled': 'false',
      'aria-label': '保存方案',
      'data-consumer': 'button',
      type: 'button',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-button',
        'semi-button-primary',
        'semi-button-light',
        'consumer-class',
      ]),
    );
    expect(wrapper.get('.semi-button-content').attributes('x-semi-prop')).toBe('children');
    expect(wrapper.get('.semi-button-content').text()).toBe('保存方案');
    expect((wrapper.element as HTMLButtonElement).style.marginRight).toBe('8px');
  });

  it('maps variants, size, block, circle, content class and native htmlType', () => {
    const wrapper = mount(Button, {
      props: {
        block: true,
        circle: true,
        contentClass: 'custom-content',
        htmlType: 'submit',
        size: 'large',
        theme: 'solid',
        type: 'danger',
      },
      slots: { default: '删除' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-button-danger',
        'semi-button-solid',
        'semi-button-size-large',
        'semi-button-block',
        'semi-button-circle',
      ]),
    );
    expect(wrapper.attributes('type')).toBe('submit');
    expect(wrapper.get('.semi-button-content').classes()).toContain('custom-content');
  });

  it('emits public mouse events and suppresses them while disabled', async () => {
    const wrapper = mount(Button, { slots: { default: '执行' } });

    await wrapper.trigger('mousedown');
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    await wrapper.trigger('click');

    expect(wrapper.emitted('mousedown')).toHaveLength(1);
    expect(wrapper.emitted('mouseenter')).toHaveLength(1);
    expect(wrapper.emitted('mouseleave')).toHaveLength(1);
    expect(wrapper.emitted('click')).toHaveLength(1);

    await wrapper.setProps({ disabled: true });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.attributes()).toMatchObject({
      'aria-disabled': 'true',
      disabled: '',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-button-disabled', 'semi-button-primary-disabled']),
    );
    expect(wrapper.classes()).not.toContain('semi-button-primary');
  });

  it('renders icon, position, icon-only, loading and horizontal padding contracts', async () => {
    const wrapper = mount(Button, {
      props: {
        iconPosition: 'right',
        noHorizontalPadding: ['left', 'right'],
      },
      slots: {
        default: '展开选项',
        icon: '<svg data-testid="slot-icon" />',
      },
    });

    expect(wrapper.classes()).toContain('semi-button-with-icon');
    expect(wrapper.classes()).not.toContain('semi-button-with-icon-only');
    expect(wrapper.get('.semi-button-content-left').text()).toBe('展开选项');
    expect(wrapper.find('[data-testid="slot-icon"]').exists()).toBe(true);
    expect((wrapper.element as HTMLButtonElement).style.paddingLeft).toBe('0px');
    expect((wrapper.element as HTMLButtonElement).style.paddingRight).toBe('0px');

    const iconOnly = mount(Button, { slots: { icon: '<svg aria-hidden="true" />' } });
    expect(iconOnly.classes()).toContain('semi-button-with-icon-only');

    await wrapper.setProps({ loading: true });
    expect(wrapper.classes()).toContain('semi-button-loading');
    expect(wrapper.find('[data-icon="spin"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="slot-icon"]').exists()).toBe(false);
  });

  it('exposes the colorful icon fill contract through the Vue icon slot', () => {
    const iconSlot = vi.fn(({ fill }) =>
      h('span', { 'data-testid': 'colorful-icon', 'data-fill': JSON.stringify(fill) }),
    );
    const wrapper = mount(Button, {
      props: { colorful: true, theme: 'light', type: 'primary' },
      slots: { icon: iconSlot },
    });

    expect(iconSlot).toHaveBeenCalled();
    const dataFill = wrapper.get('[data-testid="colorful-icon"]').attributes('data-fill');
    expect(dataFill).toBeDefined();
    expect(JSON.parse(dataFill ?? 'null')).toEqual([
      'var(--semi-button-colorful-multiple-fill-0)',
      'var(--semi-button-colorful-multiple-fill-1)',
      'var(--semi-button-colorful-multiple-fill-2)',
      'var(--semi-button-colorful-multiple-fill-3)',
    ]);
  });

  it('is safe to render without a DOM', async () => {
    const html = await renderToString(
      h(Button, { type: 'warning', loading: true }, { default: () => '撤销' }),
    );

    expect(html).toContain('semi-button-warning');
    expect(html).toContain('semi-button-loading');
    expect(html).toContain('data-icon="spin"');
  });
});

describe('ButtonGroup', () => {
  it('propagates group props, preserves child overrides and inserts source-compatible lines', () => {
    const wrapper = mount(ButtonGroup, {
      props: { disabled: true, size: 'large', theme: 'solid', type: 'danger' },
      attrs: { 'aria-label': '批量操作' },
      slots: {
        default: () => [
          h(Button, null, { default: () => '删除' }),
          h(Button, { disabled: false, type: 'secondary' }, { default: () => '取消' }),
        ],
      },
    });

    expect(wrapper.attributes()).toMatchObject({ 'aria-label': '批量操作', role: 'group' });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.classes()).toEqual(
      expect.arrayContaining([
        'semi-button-size-large',
        'semi-button-danger-disabled',
        'semi-button-solid',
      ]),
    );
    expect(buttons[1]?.classes()).toEqual(
      expect.arrayContaining([
        'semi-button-size-large',
        'semi-button-secondary',
        'semi-button-solid',
      ]),
    );
    expect(wrapper.findAll('.semi-button-group-line')).toHaveLength(1);
  });

  it('does not add separator lines between outline buttons', () => {
    const wrapper = mount(ButtonGroup, {
      props: { theme: 'outline' },
      slots: {
        default: () => [
          h(Button, null, { default: () => '上一页' }),
          h(Button, null, { default: () => '下一页' }),
        ],
      },
    });

    expect(wrapper.findAll('.semi-button-group-line')).toHaveLength(0);
  });
});

describe('SplitButtonGroup', () => {
  it('marks the first and last descendant buttons and cleans up safely', async () => {
    const wrapper = mount(SplitButtonGroup, {
      attrs: { 'aria-label': '项目操作' },
      slots: {
        default: () => [
          h(Button, null, { default: () => '保存' }),
          h(Button, null, { default: () => '更多' }),
        ],
      },
    });
    await nextTick();

    const buttons = wrapper.findAll('button');
    expect(wrapper.attributes()).toMatchObject({ 'aria-label': '项目操作', role: 'group' });
    expect(buttons[0]?.classes()).toContain('semi-button-first');
    expect(buttons[1]?.classes()).toContain('semi-button-last');

    wrapper.unmount();
  });
});
