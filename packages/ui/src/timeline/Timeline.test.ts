import { Fragment, defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem } from './index';

describe('Timeline', () => {
  it('渲染默认 mode、固定 DOM、ARIA 与装饰节点', () => {
    const wrapper = mount(Timeline, {
      attrs: { 'aria-label': '事故处理时间线', 'data-origin': 'slot' },
      slots: {
        default: () => h(TimelineItem, { time: '09:00' }, () => '创建现场'),
      },
    });

    const root = wrapper.get('ul');
    expect(root.classes()).toEqual(expect.arrayContaining(['semi-timeline', 'semi-timeline-left']));
    expect(root.attributes('aria-label')).toBe('事故处理时间线');
    expect(root.attributes('data-origin')).toBe('slot');
    expect(root.get('li').classes()).toContain('semi-timeline-item-left');
    expect(root.get('.semi-timeline-item-tail').attributes('aria-hidden')).toBe('true');
    expect(root.get('.semi-timeline-item-head').attributes('aria-hidden')).toBe('true');
    expect(root.get('.semi-timeline-item-content').text()).toBe('创建现场09:00');
  });

  it.each(['default', 'ongoing', 'success', 'warning', 'error'] as const)(
    '渲染 %s 节点类型',
    (type) => {
      const wrapper = mount(TimelineItem, { props: { type } });
      expect(wrapper.get('.semi-timeline-item-head').classes()).toContain(
        `semi-timeline-item-head-${type}`,
      );
    },
  );

  it('渲染自定义 dot、颜色、extra/time 与 slots 优先级', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        color: 'rgb(255, 192, 203)',
        dot: 'prop-dot',
        extra: 'prop-extra',
        time: 'prop-time',
      },
      slots: {
        default: () => '节点内容',
        dot: () => h('span', { 'data-dot': 'slot' }, '!'),
        extra: () => 'slot-extra',
        time: () => h('time', 'slot-time'),
      },
    });

    const dot = wrapper.get('.semi-timeline-item-head');
    expect(dot.classes()).toContain('semi-timeline-item-head-custom');
    expect(dot.attributes('style')).toContain('background-color: rgb(255, 192, 203)');
    expect(dot.get('[data-dot="slot"]').text()).toBe('!');
    expect(wrapper.get('.semi-timeline-item-content-extra').text()).toBe('slot-extra');
    expect(wrapper.get('.semi-timeline-item-content-time').text()).toBe('slot-time');
  });

  it('dataSource 非空时优先于 slot，浅复制内容并保留回调和 data 属性', async () => {
    const clicked: string[] = [];
    const dataSource = [
      {
        content: h('strong', '数据节点'),
        time: '10:35',
        extra: '辅助说明',
        type: 'ongoing' as const,
        'data-row': 'first',
        onClick: () => clicked.push('data'),
      },
    ];
    const wrapper = mount(Timeline, {
      props: { dataSource },
      slots: { default: () => h(TimelineItem, null, () => 'slot 节点') },
    });

    expect(wrapper.findAll('.semi-timeline-item')).toHaveLength(1);
    expect(wrapper.text()).toContain('数据节点辅助说明10:35');
    expect(wrapper.text()).not.toContain('slot 节点');
    expect(wrapper.get('li').attributes('data-row')).toBe('first');
    await wrapper.get('li').trigger('click');
    expect(clicked).toEqual(['data']);
    expect(dataSource[0]).not.toHaveProperty('class');
  });

  it('空 dataSource 回退到默认 slot', () => {
    const wrapper = mount(Timeline, {
      props: { dataSource: [] },
      slots: { default: () => h(TimelineItem, null, () => 'slot 节点') },
    });
    expect(wrapper.text()).toContain('slot 节点');
  });

  it.each([
    ['left', ['left', 'left', 'left']],
    ['right', ['right', 'right', 'right']],
    ['center', ['left', 'right', 'left']],
    ['alternate', ['left', 'right', 'left']],
  ] as const)('%s mode 计算并覆盖子项位置', (mode, positions) => {
    const wrapper = mount(Timeline, {
      props: { mode },
      slots: {
        default: () => [h(TimelineItem), h(TimelineItem, { position: 'right' }), h(TimelineItem)],
      },
    });
    expect(wrapper.findAll('.semi-timeline-item').map((item) => item.classes())).toEqual(
      positions.map((position) => expect.arrayContaining([`semi-timeline-item-${position}`])),
    );
  });

  it('真实模板宿主跳过注释和空白，保留 class 并按有效子项交替', () => {
    const Host = defineComponent({
      components: { Timeline, TimelineItem },
      template: `
        <Timeline mode="alternate">
          <!-- ignored -->
          <TimelineItem class="first">A</TimelineItem>

          <TimelineItem class-name="second" position="left">B</TimelineItem>
          <TimelineItem>C</TimelineItem>
        </Timeline>
      `,
    });
    const wrapper = mount(Host);
    const items = wrapper.findAll('.semi-timeline-item');
    expect(items).toHaveLength(3);
    expect(items[0]!.classes()).toEqual(
      expect.arrayContaining(['first', 'semi-timeline-item-left']),
    );
    expect(items[1]!.classes()).toEqual(
      expect.arrayContaining(['second', 'semi-timeline-item-left']),
    );
    expect(items[2]!.classes()).toContain('semi-timeline-item-left');
  });

  it('render function 展开 Fragment、保留 key/class，并装饰普通有效元素', () => {
    const wrapper = mount(Timeline, {
      props: { mode: 'alternate' },
      slots: {
        default: () =>
          h(Fragment, null, [
            h(TimelineItem, { class: 'first', key: 'first' }, () => 'A'),
            h('li', { class: 'foreign', key: 'foreign' }, 'B'),
            h(TimelineItem, { className: 'third', key: 'third' }, () => 'C'),
          ]),
      },
    });
    const children = wrapper.get('ul').findAll(':scope > li');
    expect(children[0]!.classes()).toEqual(
      expect.arrayContaining(['first', 'semi-timeline-item-left']),
    );
    expect(children[1]!.classes()).toEqual(
      expect.arrayContaining(['foreign', 'semi-timeline-item-right']),
    );
    expect(children[2]!.classes()).toEqual(
      expect.arrayContaining(['third', 'semi-timeline-item-left']),
    );
  });

  it('合并根与子项 class/style，点击只发出公开事件', async () => {
    const wrapper = mount(Timeline, {
      props: { ariaLabel: '发布轨迹', className: 'timeline-custom', style: { width: '320px' } },
      attrs: { class: 'timeline-attr', style: { color: 'red' } },
      slots: {
        default: () =>
          h(
            TimelineItem,
            { className: 'item-custom', style: { cursor: 'pointer' }, 'data-id': 'one' },
            () => '发布',
          ),
      },
    });
    expect(wrapper.get('ul').classes()).toEqual(
      expect.arrayContaining(['timeline-custom', 'timeline-attr']),
    );
    expect(wrapper.get('ul').attributes('style')).toContain('width: 320px');
    const item = wrapper.get('li');
    expect(item.classes()).toContain('item-custom');
    expect(item.attributes('style')).toContain('cursor: pointer');
    expect(item.attributes('data-id')).toBe('one');
    await item.trigger('click');
    expect(wrapper.findComponent(TimelineItem).emitted('click')).toHaveLength(1);
  });
});
