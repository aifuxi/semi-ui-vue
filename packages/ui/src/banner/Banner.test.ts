/* eslint-disable vue/one-component-per-file -- template and render hosts cover Vue Boolean/slot inputs. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Banner, { BANNER_TYPES } from './index';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Banner', () => {
  it('渲染默认 info/full DOM、图标、关闭按钮与 alert 语义', () => {
    const wrapper = mount(Banner, {
      props: { title: '版本提示', description: '新版本已经可用' },
      slots: { default: '<button>立即查看</button>' },
    });

    expect(BANNER_TYPES).toEqual(['info', 'success', 'danger', 'warning']);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-banner', 'semi-banner-info', 'semi-banner-full']),
    );
    expect(wrapper.attributes('role')).toBe('alert');
    expect(wrapper.get('.semi-banner-icon').attributes('x-semi-prop')).toBe('icon');
    expect(wrapper.get('.semi-banner-icon .semi-icon-info_circle').attributes('aria-label')).toBe(
      'info',
    );
    expect(wrapper.find('.semi-banner-icon .semi-icon-large').exists()).toBe(true);
    expect(wrapper.get('.semi-banner-title').text()).toBe('版本提示');
    expect(wrapper.get('.semi-banner-title').element.tagName).toBe('DIV');
    expect(wrapper.get('.semi-banner-description').text()).toBe('新版本已经可用');
    expect(wrapper.get('.semi-banner-extra button').text()).toBe('立即查看');
    const close = wrapper.get('button.semi-banner-close');
    expect(close.attributes()).toMatchObject({ 'aria-label': 'Close', type: 'button' });
    expect(close.classes()).toEqual(
      expect.arrayContaining([
        'semi-button-size-small',
        'semi-button-borderless',
        'semi-button-with-icon-only',
      ]),
    );
    expect(close.get('.semi-icon-close').attributes()).toMatchObject({
      'aria-hidden': 'true',
      'x-semi-prop': 'closeIcon',
    });
  });

  it('覆盖四种 type 的默认图标与 class', () => {
    const expectedIcons = {
      danger: 'alert_circle',
      info: 'info_circle',
      success: 'tick_circle',
      warning: 'alert_triangle',
    } as const;

    for (const type of BANNER_TYPES) {
      const wrapper = mount(Banner, { props: { type } });
      expect(wrapper.classes()).toContain(`semi-banner-${type}`);
      expect(wrapper.get(`.semi-icon-${expectedIcons[type]}`).attributes('aria-label')).toBe(type);
      wrapper.unmount();
    }
  });

  it('区分 fullMode 缺省、SFC 裸属性、显式 false/true 与 h() 输入', () => {
    const templateHost = mount(
      defineComponent({
        components: { Banner },
        template: `
          <section>
            <Banner data-probe="default" />
            <Banner data-probe="bare" full-mode />
            <Banner data-probe="false" :full-mode="false" bordered />
            <Banner data-probe="true" :full-mode="true" bordered />
          </section>
        `,
      }),
    );
    expect(templateHost.get('[data-probe="default"]').classes()).toContain('semi-banner-full');
    expect(templateHost.get('[data-probe="bare"]').classes()).toContain('semi-banner-full');
    expect(templateHost.get('[data-probe="false"]').classes()).toEqual(
      expect.arrayContaining(['semi-banner-in-container', 'semi-banner-bordered']),
    );
    expect(templateHost.get('[data-probe="true"]').classes()).not.toContain('semi-banner-bordered');

    const renderHost = mount(
      defineComponent({
        render: () =>
          h('section', [
            h(Banner, { 'data-probe': 'render-false', bordered: true, fullMode: false }),
            h(Banner, { 'data-probe': 'render-true', bordered: true, fullMode: true }),
          ]),
      }),
    );
    expect(renderHost.get('[data-probe="render-false"]').classes()).toEqual(
      expect.arrayContaining(['semi-banner-in-container', 'semi-banner-bordered']),
    );
    expect(renderHost.get('[data-probe="render-true"]').classes()).toContain('semi-banner-full');
  });

  it('让命名 slot 覆盖同名 prop，并支持自定义 VNode 图标和关闭图标', () => {
    const wrapper = mount(
      defineComponent({
        components: { Banner },
        template: `
          <Banner title="prop title" description="prop description">
            <template #icon><span class="custom-icon">I</span></template>
            <template #title><strong>slot title</strong></template>
            <template #description><em>slot description</em></template>
            <template #closeIcon><span class="custom-close">X</span></template>
            <button class="extra-action">处理</button>
          </Banner>
        `,
      }),
    );

    expect(wrapper.get('.custom-icon').text()).toBe('I');
    expect(wrapper.find('.semi-icon-info_circle').exists()).toBe(false);
    expect(wrapper.get('.semi-banner-title strong').text()).toBe('slot title');
    expect(wrapper.get('.semi-banner-description em').text()).toBe('slot description');
    expect(wrapper.get('.custom-close').text()).toBe('X');
    expect(wrapper.get('.semi-banner-extra .extra-action').text()).toBe('处理');
  });

  it('保留 icon/closeIcon null 与 false 的固定差异', () => {
    const hidden = mount(Banner, { props: { closeIcon: null, icon: null } });
    expect(hidden.find('.semi-banner-icon').exists()).toBe(false);
    expect(hidden.find('.semi-banner-close').exists()).toBe(false);

    const falseNodes = mount(Banner, { props: { closeIcon: false, icon: false } });
    expect(falseNodes.find('.semi-banner-icon').exists()).toBe(false);
    expect(falseNodes.find('.semi-banner-close').exists()).toBe(true);
    expect(falseNodes.find('.semi-icon-close').exists()).toBe(true);
  });

  it('按 React truthy 分支跳过空标量并保留数组 wrapper', () => {
    const scalars = mount(Banner, {
      props: { description: 0, title: '' },
      slots: { default: () => false },
    });
    expect(scalars.find('.semi-banner-title').exists()).toBe(false);
    expect(scalars.find('.semi-banner-description').exists()).toBe(false);
    expect(scalars.find('.semi-banner-extra').exists()).toBe(false);

    const arrays = mount(
      defineComponent({
        render: () =>
          h(
            Banner,
            { description: [false] as never, icon: [false] as never, title: [] as never },
            { default: () => [] },
          ),
      }),
    );
    expect(arrays.find('.semi-banner-icon').exists()).toBe(true);
    expect(arrays.find('.semi-banner-title').exists()).toBe(true);
    expect(arrays.find('.semi-banner-description').exists()).toBe(true);
    expect(arrays.find('.semi-banner-extra').exists()).toBe(true);
  });

  it('关闭时先通知、阻止冒泡，再移除整个 alert DOM', async () => {
    const parentClick = vi.fn();
    const close = vi.fn((event: MouseEvent) => {
      expect(event).toBeInstanceOf(MouseEvent);
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });
    const wrapper = mount(
      defineComponent({
        components: { Banner },
        setup: () => ({ close, parentClick }),
        template: `<div @click="parentClick"><Banner description="可关闭" @close="close" /></div>`,
      }),
    );

    const closeButton = wrapper.get('button.semi-banner-close');
    await closeButton.trigger('click');
    expect(close).toHaveBeenCalledTimes(1);
    expect(close.mock.calls[0]![0]).toBeInstanceOf(MouseEvent);
    expect(parentClick).not.toHaveBeenCalled();
    await nextTick();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('合并 class/style 和 Vue 根 attrs/原生事件', async () => {
    const click = vi.fn();
    const wrapper = mount(Banner, {
      props: {
        class: 'vue-class',
        className: 'compat-class',
        style: { color: 'red' },
      },
      attrs: {
        'aria-label': '发布通知',
        'data-parity-target': 'banner',
        onClick: click,
        style: { width: '320px' },
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-banner', 'vue-class', 'compat-class']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '发布通知',
      'data-parity-target': 'banner',
      role: 'alert',
    });
    expect(wrapper.attributes('style')).toContain('color: red');
    await wrapper.trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
});
