/* eslint-disable vue/one-component-per-file -- template hosts verify Vue-native Boolean and slot syntax. */

import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { List, ListItem } from './index';

describe('List', () => {
  it('覆盖 split/bordered/loading 的缺省、false、裸属性 true', () => {
    const wrapper = mount(
      defineComponent({
        components: { List, ListItem },
        template: `<div>
          <List><ListItem>default</ListItem></List>
          <List :split="false" :bordered="false" :loading="false"><ListItem>false</ListItem></List>
          <List split bordered loading><ListItem>true</ListItem></List>
        </div>`,
      }),
    );
    const lists = wrapper.findAll('.semi-list');
    expect(lists[0]!.classes()).toContain('semi-list-split');
    expect(lists[0]!.classes()).not.toContain('semi-list-bordered');
    expect(lists[1]!.classes()).not.toContain('semi-list-split');
    expect(lists[2]!.classes()).toEqual(
      expect.arrayContaining(['semi-list-split', 'semi-list-bordered']),
    );
    expect(lists[2]!.get('.semi-spin').classes()).not.toContain('semi-spin-hidden');
  });

  it('渲染 dataSource 的 item slot，并在空数据时使用 locale', () => {
    const wrapper = mount(
      defineComponent({
        components: { ConfigProvider, List, ListItem },
        data: () => ({ data: ['A', 'B'] }),
        template: `<ConfigProvider :locale="{ List: { emptyText: 'No rows' } }">
          <List :data-source="data"><template #item="{ item, index }"><ListItem>{{ index }}-{{ item }}</ListItem></template></List>
          <List :data-source="[]" />
        </ConfigProvider>`,
      }),
    );
    expect(
      wrapper
        .findAll('.semi-list')[0]!
        .findAll('.semi-list-item')
        .map((item) => item.text()),
    ).toEqual(['0-A', '1-B']);
    expect(wrapper.get('.semi-list-empty').text()).toBe('No rows');
  });

  it('renderItem 与默认 slot、header/footer/loadMore 保持固定顺序', () => {
    const wrapper = mount(List, {
      props: {
        dataSource: ['A'],
        renderItem: (item) => h(ListItem, null, () => `generated-${item}`),
        header: h('strong', 'header'),
        footer: h('strong', 'footer'),
        loadMore: h('button', 'more'),
      },
      attrs: { 'aria-label': 'member list', id: 'members', title: 'Members' },
      slots: { default: () => h(ListItem, null, () => 'slot') },
    });
    expect(wrapper.findAll('.semi-list-item').map((item) => item.text())).toEqual([
      'generated-A',
      'slot',
    ]);
    expect(wrapper.element.children[0]?.classList).toContain('semi-list-header');
    expect(wrapper.element.children[2]?.classList).toContain('semi-list-footer');
    expect(wrapper.element.lastElementChild?.textContent).toBe('more');
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': 'member list',
      id: 'members',
      title: 'Members',
    });
  });

  it('ListItem 本地事件覆盖 List 上下文事件', async () => {
    const parentClick = vi.fn();
    const localClick = vi.fn();
    const wrapper = mount(List, {
      props: { onClick: parentClick },
      slots: {
        default: () => [
          h(ListItem, { onClick: localClick }, () => 'local'),
          h(ListItem, null, () => 'context'),
        ],
      },
    });
    const items = wrapper.findAll('.semi-list-item');
    await items[0]!.trigger('click');
    await items[1]!.trigger('click');
    expect(localClick).toHaveBeenCalledTimes(1);
    expect(parentClick).toHaveBeenCalledTimes(1);
  });

  it('输出三种 size、horizontal、Grid Row/Col 与 gutter', () => {
    const sizes = ['small', 'default', 'large'] as const;
    for (const size of sizes) {
      const wrapper = mount(List, { props: { size }, slots: { default: () => h(ListItem) } });
      expect(wrapper.classes()).toContain(`semi-list-${size}`);
    }

    const horizontal = mount(List, {
      props: { layout: 'horizontal' },
      slots: { default: () => [h(ListItem, null, () => 'A'), h(ListItem, null, () => 'B')] },
    });
    expect(horizontal.classes()).toContain('semi-list-flex');
    expect(horizontal.get('ul').classes()).toContain('semi-list-items');
    expect(horizontal.find('.semi-list-header').exists()).toBe(false);
    expect(horizontal.find('.semi-list-footer').exists()).toBe(false);

    const grid = mount(List, {
      props: { grid: { gutter: 18, span: 6 } },
      slots: { default: () => h(ListItem, null, () => 'Grid') },
    });
    expect(grid.classes()).toContain('semi-list-grid');
    expect(grid.get('.semi-row-flex').attributes('style')).toContain('margin-left: -9px');
    expect(grid.get('.semi-col-6').attributes('style')).toContain('padding-left: 9px');
    expect(grid.get('.semi-col-6 > li').classes()).toContain('semi-list-item');
  });

  it('ListItem 渲染 header/main/default/extra、align、attrs 与 mouse events', async () => {
    const enter = vi.fn();
    const leave = vi.fn();
    const rightClick = vi.fn();
    const wrapper = mount(ListItem, {
      props: {
        align: 'baseline',
        className: 'compat-item',
        onMouseEnter: enter,
        onMouseLeave: leave,
        onRightClick: rightClick,
        style: { minHeight: '48px' },
      },
      attrs: {
        class: 'vue-item',
        'data-probe': 'item',
        'aria-label': 'row',
        title: 'Row',
      },
      slots: {
        header: () => h('i', 'H'),
        main: () => h('strong', 'M'),
        default: () => 'body',
        extra: () => h('button', 'E'),
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-list-item', 'compat-item', 'vue-item']),
    );
    expect(wrapper.attributes('data-probe')).toBe('item');
    expect(wrapper.attributes('aria-label')).toBe('row');
    expect(wrapper.attributes('title')).toBe('Row');
    expect(wrapper.get('.semi-list-item-body').classes()).toContain('semi-list-item-body-baseline');
    expect(wrapper.text()).toBe('HMbodyE');
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    await wrapper.trigger('contextmenu');
    expect(enter).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(1);
    expect(rightClick).toHaveBeenCalledTimes(1);
  });

  it('item slot 优先于 renderItem，custom empty slot 保留来源标记', () => {
    const renderItem = vi.fn(() => h(ListItem, null, () => 'render'));
    const withSlot = mount(List, {
      props: { dataSource: ['A'], renderItem },
      slots: { item: ({ item }) => h(ListItem, null, () => `slot-${String(item)}`) },
    });
    expect(withSlot.get('.semi-list-item').text()).toBe('slot-A');
    expect(renderItem).not.toHaveBeenCalled();

    const empty = mount(List, {
      props: { dataSource: [] },
      slots: { emptyContent: () => h('em', 'Nothing') },
    });
    expect(empty.get('.semi-list-empty').attributes('x-semi-prop')).toBe('emptyContent');
    expect(empty.get('.semi-list-empty').text()).toBe('Nothing');
  });

  it('loading 保留 empty/children，并在关闭时进入 hidden 终态', async () => {
    const wrapper = mount(List, { props: { dataSource: [], loading: true } });
    expect(wrapper.get('.semi-spin').classes()).not.toContain('semi-spin-hidden');
    expect(wrapper.get('.semi-spin-wrapper svg').attributes()).toMatchObject({
      'aria-hidden': 'true',
      'data-icon': 'spin',
    });
    expect(wrapper.get('.semi-list-empty').text()).toBe('暂无数据');
    await wrapper.setProps({ loading: false });
    expect(wrapper.get('.semi-spin').classes()).toContain('semi-spin-hidden');
    expect(wrapper.find('.semi-spin-wrapper').exists()).toBe(false);
  });
});
