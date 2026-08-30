import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import IconButton from './IconButton';

function ScenarioIcon() {
  return h('svg', { 'aria-hidden': 'true', viewBox: '0 0 16 16' }, h('path', { d: 'M3 8h10' }));
}

describe('IconButton', () => {
  it('缺省与显式空 icon 都保持固定 icon-only DOM/class，并透传原生 attrs', () => {
    const omitted = mount(IconButton, {
      attrs: { 'aria-label': '空图标按钮', class: 'custom', 'data-kind': 'omitted' },
    });
    expect(omitted.get('button').classes()).toEqual(
      expect.arrayContaining([
        'semi-button',
        'semi-button-primary',
        'semi-button-light',
        'semi-button-with-icon',
        'semi-button-with-icon-only',
        'custom',
      ]),
    );
    expect(omitted.get('.semi-button-content').attributes('x-semi-prop')).toBeUndefined();
    expect(omitted.attributes()).toMatchObject({
      'aria-disabled': 'false',
      'aria-label': '空图标按钮',
      'data-kind': 'omitted',
      type: 'button',
    });
    expect(omitted.find('svg').exists()).toBe(false);

    const explicit = mount(IconButton, { slots: { icon: () => [] } });
    expect(explicit.classes()).toContain('semi-button-with-icon-only');
    expect(explicit.find('.semi-button-content-right').exists()).toBe(false);
  });

  it('template 宿主按位置输出 icon 与文字，并保留 content class 与 slot props', () => {
    const Host = defineComponent({
      components: { IconButton },
      template: `
        <IconButton
          icon-position="right"
          icon-size="large"
          :icon-style="{ color: 'red' }"
          content-class="custom-content"
          aria-label="展开选项"
        >
          <template #icon="slotProps">
            <svg data-icon="template" :data-size="slotProps.iconSize" :style="slotProps.iconStyle" />
          </template>
          展开选项
        </IconButton>
      `,
    });
    const wrapper = mount(Host);
    const content = wrapper.get('.semi-button-content');
    expect(content.classes()).toContain('custom-content');
    expect(content.get('.semi-button-content-left').text()).toContain('展开选项');
    expect(content.element.lastElementChild?.getAttribute('data-icon')).toBe('template');
    expect(content.get('[data-icon="template"]').attributes('data-size')).toBe('large');
    expect((content.get('[data-icon="template"]').element as SVGElement).style.color).toBe('red');
  });

  it('h() 宿主覆盖样式、尺寸、htmlType 与分方向 noHorizontalPadding', () => {
    const wrapper = mount(IconButton, {
      props: {
        block: true,
        circle: true,
        htmlType: 'submit',
        noHorizontalPadding: ['left'],
        size: 'large',
        theme: 'outline',
        type: 'danger',
      },
      attrs: { style: { marginRight: '8px' } },
      slots: { default: () => '删除', icon: ScenarioIcon },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-button-danger',
        'semi-button-outline',
        'semi-button-size-large',
        'semi-button-block',
        'semi-button-circle',
        'semi-button-with-icon',
      ]),
    );
    expect(wrapper.classes()).not.toContain('semi-button-with-icon-only');
    expect(wrapper.attributes('type')).toBe('submit');
    expect((wrapper.element as HTMLButtonElement).style.paddingLeft).toBe('0px');
    expect((wrapper.element as HTMLButtonElement).style.paddingRight).toBe('');
    expect((wrapper.element as HTMLButtonElement).style.marginRight).toBe('8px');
  });

  it('loading 优先替换 icon，disabled loading 保留 icon，并匹配 AI loading 分支', () => {
    const loading = mount(IconButton, {
      props: { loading: true },
      slots: { icon: ScenarioIcon },
    });
    expect(loading.classes()).toContain('semi-button-loading');
    expect(loading.find('[data-icon="spin"]').exists()).toBe(true);
    expect(loading.find('[viewBox="0 0 16 16"]').exists()).toBe(false);

    const disabled = mount(IconButton, {
      props: { disabled: true, loading: true },
      slots: { icon: ScenarioIcon },
    });
    expect(disabled.classes()).toContain('semi-button-loading');
    expect(disabled.find('[data-icon="spin"]').exists()).toBe(false);
    expect(disabled.find('[viewBox="0 0 16 16"]').exists()).toBe(true);

    const solidTertiary = mount(IconButton, {
      props: { loading: true, theme: 'solid', type: 'tertiary' },
    });
    expect(solidTertiary.find('.semi-button-content-loading-icon').exists()).toBe(true);
  });

  it('colorful 只向 icon VNode 注入固定 fill，并覆盖 disabled fill', () => {
    const colorful = mount(IconButton, {
      props: { colorful: true, theme: 'light', type: 'primary' },
      slots: { icon: ScenarioIcon },
    });
    expect(colorful.get('svg').attributes('fill')).toBe(
      'var(--semi-button-colorful-multiple-fill-0),var(--semi-button-colorful-multiple-fill-1),var(--semi-button-colorful-multiple-fill-2),var(--semi-button-colorful-multiple-fill-3)',
    );

    const disabled = mount(IconButton, {
      props: { colorful: true, disabled: true, theme: 'outline', type: 'tertiary' },
      slots: { icon: ScenarioIcon },
    });
    expect(disabled.get('svg').attributes('fill')).toBe(
      'var(--semi-color-disabled-text),var(--semi-color-disabled-text)',
    );
  });

  it('按原生交互顺序发出事件且 disabled 不发出公开事件', async () => {
    const order: string[] = [];
    const wrapper = mount(IconButton, {
      attrs: {
        onClick: () => order.push('listener-click'),
        onMousedown: () => order.push('listener-mousedown'),
        onMouseenter: () => order.push('listener-enter'),
        onMouseleave: () => order.push('listener-leave'),
      },
      slots: { icon: ScenarioIcon },
    });
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mousedown');
    await wrapper.trigger('click');
    await wrapper.trigger('mouseleave');
    expect(order).toEqual([
      'listener-enter',
      'listener-mousedown',
      'listener-click',
      'listener-leave',
    ]);
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('mousedown')).toHaveLength(1);
    expect(wrapper.emitted('mouseenter')).toHaveLength(1);
    expect(wrapper.emitted('mouseleave')).toHaveLength(1);

    const onClick = vi.fn();
    const disabled = mount(IconButton, {
      props: { disabled: true, onClick },
      slots: { icon: ScenarioIcon },
    });
    await disabled.trigger('click');
    await disabled.trigger('mousedown');
    expect(onClick).not.toHaveBeenCalled();
    expect(disabled.emitted('click')).toBeUndefined();
    expect(disabled.emitted('mousedown')).toBeUndefined();
  });
});
