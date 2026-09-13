/* eslint-disable vue/one-component-per-file -- template and render hosts cover Vue-native slot and VNode inputs. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Empty, { EMPTY_LAYOUTS } from './index';

afterEach(() => {
  document.body.removeAttribute('theme-mode');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Empty', () => {
  it('渲染固定默认 DOM、垂直布局与无图片标题分支', () => {
    const wrapper = mount(Empty, {
      props: { title: '没有结果', description: '请调整筛选条件' },
      slots: { default: '<button>重置</button>' },
    });

    expect(EMPTY_LAYOUTS).toEqual(['vertical', 'horizontal']);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-empty', 'semi-empty-vertical']),
    );
    expect(wrapper.get('.semi-empty-image').attributes('x-semi-prop')).toBe('image,darkModeImage');
    expect(wrapper.get('.semi-empty-image').find('img, svg, span').exists()).toBe(false);
    const title = wrapper.get('h6.semi-typography.semi-empty-title');
    expect(title.text()).toBe('没有结果');
    expect(title.attributes('style')).toContain('font-weight: 400');
    expect(wrapper.get('.semi-empty-description').text()).toBe('请调整筛选条件');
    expect(wrapper.get('.semi-empty-footer button').text()).toBe('重置');
  });

  it('支持字符串、SVG 描述对象和自定义 VNode 图片', () => {
    const stringImage = mount(Empty, {
      props: {
        image: '/empty.png',
        imageStyle: { width: '150px' },
        title: '空状态',
        description: '暂无数据',
      },
    });
    const image = stringImage.get('.semi-empty-image img');
    expect(image.attributes()).toMatchObject({ alt: '暂无数据', src: '/empty.png' });
    expect(stringImage.get('.semi-empty-image').attributes('style')).toContain('width: 150px');
    expect(stringImage.get('h4.semi-empty-title').text()).toBe('空状态');

    const svgImage = mount(Empty, {
      props: { image: { id: 'empty-symbol', viewBox: '0 0 20 20' } },
    });
    expect(svgImage.get('.semi-empty-image svg').attributes('aria-hidden')).toBe('true');
    const use = svgImage.get('.semi-empty-image use').element;
    expect(
      use.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ?? use.getAttribute('href'),
    ).toBe('#empty-symbol');
    expect(svgImage.find('.semi-empty-image img').exists()).toBe(false);

    const customImage = mount(
      defineComponent({
        render: () => h(Empty, { image: h('span', { class: 'custom-image' }, 'IMG') as never }),
      }),
    );
    expect(customImage.get('.custom-image').text()).toBe('IMG');
  });

  it('让命名 slot 覆盖同名 props，并跳过空内容 wrapper', () => {
    const wrapper = mount(
      defineComponent({
        components: { Empty },
        template: `
          <Empty title="prop title" description="prop description" image="/prop.png">
            <template #image><span class="slot-image">slot image</span></template>
            <template #title><strong>slot title</strong></template>
            <template #description><em>slot description</em></template>
            <button>创建</button>
          </Empty>
        `,
      }),
    );
    expect(wrapper.get('.slot-image').text()).toBe('slot image');
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get('.semi-empty-title strong').text()).toBe('slot title');
    expect(wrapper.get('.semi-empty-description em').text()).toBe('slot description');
    expect(wrapper.get('.semi-empty-footer button').text()).toBe('创建');

    const empty = mount(Empty, {
      props: { title: '', description: '', image: '', layout: 'horizontal' },
    });
    expect(empty.classes()).toContain('semi-empty-horizontal');
    expect(empty.find('.semi-empty-title').exists()).toBe(false);
    expect(empty.find('.semi-empty-description').exists()).toBe(false);
    expect(empty.find('.semi-empty-footer').exists()).toBe(false);
    expect(empty.get('.semi-empty-image img').attributes()).toMatchObject({ alt: '', src: '' });
  });

  it('按固定 React truthy 分支保留数组内容 wrapper', () => {
    const wrapper = mount(
      defineComponent({
        render: () =>
          h(
            Empty,
            {
              image: [] as never,
              title: [] as never,
              description: [] as never,
            },
            { default: () => [] },
          ),
      }),
    );

    expect(wrapper.get('.semi-empty-image').find('img, svg').exists()).toBe(false);
    expect(wrapper.find('h4.semi-empty-title').exists()).toBe(true);
    expect(wrapper.find('.semi-empty-description').exists()).toBe(true);
    expect(wrapper.find('.semi-empty-footer').exists()).toBe(true);
  });

  it('合并兼容 class、Vue attrs/style 并保留根节点原生事件', async () => {
    const click = vi.fn();
    const wrapper = mount(Empty, {
      props: {
        class: 'vue-class',
        className: 'compat-class',
        layout: 'horizontal',
        style: { color: 'red' },
      },
      attrs: {
        'aria-label': '空状态',
        'data-probe': 'empty',
        role: 'status',
        onClick: click,
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-empty', 'semi-empty-horizontal', 'vue-class', 'compat-class']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '空状态',
      'data-probe': 'empty',
      role: 'status',
    });
    expect(wrapper.attributes('style')).toContain('color: red');
    await wrapper.trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
    expect(click.mock.calls[0]![0]).toBeInstanceOf(MouseEvent);
  });

  it('按 body theme-mode 初始值与 mutation 切换暗色图片', async () => {
    document.body.setAttribute('theme-mode', 'dark');
    const wrapper = mount(Empty, {
      props: { image: '/light.png', darkModeImage: '/dark.png', description: '空' },
    });
    await nextTick();
    expect(wrapper.get('img').attributes('src')).toBe('/dark.png');

    document.body.setAttribute('theme-mode', 'light');
    await vi.waitFor(() => expect(wrapper.get('img').attributes('src')).toBe('/light.png'));
    document.body.setAttribute('theme-mode', 'dark');
    await vi.waitFor(() => expect(wrapper.get('img').attributes('src')).toBe('/dark.png'));
  });

  it('没有暗色图片时不创建 observer，并在卸载时断开已创建 observer', async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const Observer = vi.fn(function (this: MutationObserver) {
      return { observe, disconnect } as unknown as MutationObserver;
    });
    vi.stubGlobal('MutationObserver', Observer);

    const lightOnly = mount(Empty, { props: { image: '/light.png' } });
    expect(Observer).not.toHaveBeenCalled();
    lightOnly.unmount();

    const dark = mount(Empty, { props: { image: '/light.png', darkModeImage: '/dark.png' } });
    await nextTick();
    expect(Observer).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(document.body, {
      attributes: true,
      childList: false,
      subtree: false,
    });
    dark.unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('非字符串描述为字符串图片提供固定 empty alt', () => {
    const wrapper = mount(Empty, {
      props: { image: '/empty.png', description: h('span', '自定义描述') as never },
    });
    expect(wrapper.get('img').attributes('alt')).toBe('empty');
    expect(wrapper.get('.semi-empty-description').text()).toBe('自定义描述');
  });
});
