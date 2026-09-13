/* eslint-disable vue/one-component-per-file -- test hosts cover template and render VNode inputs. */

import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Badge, { BADGE_POSITIONS, BADGE_THEMES, BADGE_TYPES } from './index';

describe('Badge', () => {
  it('渲染默认计数、点状、自定义节点和无内容边界', () => {
    const host = mount(
      defineComponent({
        components: { Badge },
        template: `
          <div>
            <Badge :count="5"><i class="base" /></Badge>
            <Badge :count="0"><i /></Badge>
            <Badge count=""><i /></Badge>
            <Badge :count="null"><i /></Badge>
            <Badge dot :count="8"><i /></Badge>
            <Badge><template #count><strong class="custom">C</strong></template><i /></Badge>
          </div>
        `,
      }),
    );
    const badges = host.findAll('.semi-badge');
    expect(badges[0]!.get('.semi-badge-count').text()).toBe('5');
    expect(badges[0]!.get('[x-semi-prop="count"]').classes()).toEqual(
      expect.arrayContaining(['semi-badge-primary', 'semi-badge-solid', 'semi-badge-rightTop']),
    );
    expect(badges[1]!.get('.semi-badge-count').text()).toBe('0');
    expect(badges[2]!.get('.semi-badge-count').text()).toBe('');
    expect(badges[3]!.find('.semi-badge-count').exists()).toBe(false);
    expect(badges[4]!.get('.semi-badge-dot').text()).toBe('');
    const custom = badges[5]!.get('.semi-badge-custom');
    expect(custom.get('.custom').text()).toBe('C');
    expect(custom.classes()).not.toContain('semi-badge-primary');
    expect(custom.classes()).not.toContain('semi-badge-solid');
  });

  it('覆盖六种 type、三种 theme 与四个显式位置', () => {
    for (const type of BADGE_TYPES) {
      const wrapper = mount(Badge, { props: { count: 1, type }, slots: { default: 'base' } });
      expect(wrapper.get('[x-semi-prop="count"]').classes()).toContain(`semi-badge-${type}`);
    }
    for (const theme of BADGE_THEMES) {
      const wrapper = mount(Badge, { props: { count: 1, theme }, slots: { default: 'base' } });
      expect(wrapper.get('[x-semi-prop="count"]').classes()).toContain(`semi-badge-${theme}`);
    }
    for (const position of BADGE_POSITIONS) {
      const wrapper = mount(Badge, {
        props: { count: 1, position },
        slots: { default: 'base' },
      });
      expect(wrapper.get('[x-semi-prop="count"]').classes()).toContain(`semi-badge-${position}`);
    }
  });

  it('按 ConfigProvider 方向选择缺省位置，显式位置优先', () => {
    const wrapper = mount(
      defineComponent({
        components: { Badge, ConfigProvider },
        template: `
          <ConfigProvider direction="rtl">
            <Badge :count="1"><i /></Badge>
            <Badge :count="2" position="rightBottom"><i /></Badge>
          </ConfigProvider>
        `,
      }),
    );
    expect(wrapper.findAll('[x-semi-prop="count"]')[0]!.classes()).toContain('semi-badge-leftTop');
    expect(wrapper.findAll('[x-semi-prop="count"]')[1]!.classes()).toContain(
      'semi-badge-rightBottom',
    );
  });

  it('独立使用附加 block 且不附加 position class', () => {
    const wrapper = mount(Badge, { props: { count: 'NEW', position: 'leftBottom' } });
    const count = wrapper.get('[x-semi-prop="count"]');
    expect(count.classes()).toEqual(
      expect.arrayContaining(['semi-badge-block', 'semi-badge-count', 'semi-badge-primary']),
    );
    for (const position of BADGE_POSITIONS) {
      expect(count.classes()).not.toContain(`semi-badge-${position}`);
    }
  });

  it('只对数字应用固定 overflowCount truthy 边界', () => {
    const render = (count: number | string, overflowCount?: number) =>
      mount(Badge, {
        props: overflowCount === undefined ? { count } : { count, overflowCount },
        slots: { default: 'base' },
      });
    expect(render(100, 99).get('.semi-badge-count').text()).toBe('99+');
    expect(render(99, 99).get('.semi-badge-count').text()).toBe('99');
    expect(render(10, 0).get('.semi-badge-count').text()).toBe('10');
    expect(render(10, -1).get('.semi-badge-count').text()).toBe('-1+');
    expect(render('100', 5).get('.semi-badge-count').text()).toBe('100');
  });

  it('按固定落点合并 class/attrs，并让 style 优先于 countStyle', () => {
    const wrapper = mount(Badge, {
      props: {
        class: 'vue-class',
        className: 'compat-class',
        count: 5,
        countClassName: 'count-class',
        countStyle: { color: 'blue', marginLeft: '2px' },
        style: { color: 'red' },
      },
      attrs: { 'aria-label': '消息数', 'data-probe': 'badge', title: 'Badge' },
      slots: { default: '<i class="base" />' },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-badge', 'vue-class', 'compat-class']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '消息数',
      'data-probe': 'badge',
      title: 'Badge',
    });
    const count = wrapper.get('.count-class');
    expect(count.attributes('style')).toContain('color: red');
    expect(count.attributes('style')).not.toContain('margin-left');
    expect(wrapper.attributes('style')).toBeUndefined();
  });

  it('从根节点各派发一次原生鼠标事件', async () => {
    const click = vi.fn();
    const enter = vi.fn();
    const leave = vi.fn();
    const wrapper = mount(Badge, {
      props: { count: 1, onClick: click, onMouseenter: enter, onMouseleave: leave },
      slots: { default: 'base' },
    });
    await wrapper.trigger('click');
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    expect(click).toHaveBeenCalledTimes(1);
    expect(enter).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(1);
    expect(click.mock.calls[0]![0]).toBeInstanceOf(MouseEvent);
  });

  it('支持 render function 传入自定义 count VNode', () => {
    const wrapper = mount(
      defineComponent({
        render: () => h(Badge, { count: h('em', { class: 'render-count' }, 'R') }, () => 'base'),
      }),
    );
    expect(wrapper.get('.semi-badge-custom .render-count').text()).toBe('R');
  });
});
