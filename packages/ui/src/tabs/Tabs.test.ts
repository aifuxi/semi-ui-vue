/* eslint-disable vue/one-component-per-file -- test hosts cover template Boolean props and reactive pane collection. */
import { mount } from '@vue/test-utils';
import { Fragment, defineComponent, h, nextTick, shallowRef, type VNodeChild } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TabItem from './TabItem.vue';
import TabPane from './TabPane.vue';
import Tabs from './Tabs.vue';

const wrappers: Array<ReturnType<typeof mount>> = [];

function panes() {
  return [
    h(TabPane, { itemKey: 'docs', tab: '文档' }, () => '文档内容'),
    h(TabPane, { disabled: true, itemKey: 'start', tab: '快速起步' }, () => '起步内容'),
    h(TabPane, { closable: true, itemKey: 'help', tab: '帮助' }, () => '帮助内容'),
  ];
}

function mountTabs(props: Record<string, unknown> = {}, slot: () => VNodeChild = panes) {
  const wrapper = mount(Tabs, {
    attachTo: document.body,
    props,
    slots: { default: slot },
  });
  wrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Tabs', () => {
  it('从直接 TabPane 收集首个非禁用项并保留默认 DOM、class、ARIA 与 data', () => {
    const wrapper = mountTabs({
      class: 'vue-tabs',
      className: 'custom-tabs',
      style: { width: '600px' },
      'aria-label': '文档标签',
      'data-owner': 'docs',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-tabs', 'semi-tabs-top', 'vue-tabs', 'custom-tabs']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '文档标签',
      'data-owner': 'docs',
    });
    expect((wrapper.element as HTMLElement).style.width).toBe('600px');
    expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe('horizontal');

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.text())).toEqual(['文档', '快速起步', '帮助']);
    expect(tabs[0]!.attributes()).toMatchObject({
      'aria-controls': 'semiTabPaneldocs',
      'aria-selected': 'true',
      tabindex: '0',
    });
    expect(tabs[1]!.attributes('aria-disabled')).toBe('true');
    expect(tabs[2]!.find('.semi-tabs-tab-icon-close').exists()).toBe(true);

    const panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels).toHaveLength(3);
    expect(panels[0]!.attributes('aria-hidden')).toBe('false');
    expect(panels[1]!.attributes('aria-hidden')).toBe('true');
    expect(panels[0]!.text()).toBe('文档内容');
  });

  it.each(['line', 'card', 'button', 'slash'] as const)('保留 %s 类型 DOM class', (type) => {
    const wrapper = mountTabs({ type });
    expect(wrapper.get('[role="tablist"]').classes()).toContain(`semi-tabs-bar-${type}`);
    expect(wrapper.get('[role="tab"]').classes()).toContain(`semi-tabs-tab-${type}`);
  });

  it('left/size/extra/content/bar style 与 slot 优先级正确', () => {
    const wrapper = mount(Tabs, {
      attachTo: document.body,
      props: {
        contentStyle: { paddingLeft: '12px' },
        size: 'small',
        tabBarExtraContent: 'prop extra',
        tabBarStyle: { width: '180px' },
        tabPosition: 'left',
      },
      slots: {
        default: panes,
        tabBarExtraContent: () => h('button', { class: 'extra-action' }, '新增'),
      },
    });
    wrappers.push(wrapper);
    expect(wrapper.classes()).toContain('semi-tabs-left');
    expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.get('[role="tablist"]').classes()).toContain('semi-tabs-bar-left');
    expect((wrapper.get('[role="tablist"]').element as HTMLElement).style.width).toBe('180px');
    expect(wrapper.get('[role="tab"]').classes()).toContain('semi-tabs-tab-small');
    expect(wrapper.get('.extra-action').text()).toBe('新增');
    expect((wrapper.get('.semi-tabs-content').element as HTMLElement).style.paddingLeft).toBe(
      '12px',
    );
  });

  it('非受控切换严格按 change/update/update/tabClick 顺序且当前项不重复 change', async () => {
    const order: string[] = [];
    const wrapper = mountTabs({
      onChange: (key: string) => order.push(`change:${key}`),
      'onUpdate:activeKey': (key: string) => order.push(`active:${key}`),
      'onUpdate:modelValue': (key: string) => order.push(`model:${key}`),
      onTabClick: (key: string) => order.push(`click:${key}`),
    });
    await wrapper.findAll('[role="tab"]')[2]!.trigger('click');
    expect(order).toEqual(['change:help', 'active:help', 'model:help', 'click:help']);
    expect(wrapper.findAll('[role="tab"]')[2]!.attributes('aria-selected')).toBe('true');
    order.length = 0;
    await wrapper.findAll('[role="tab"]')[2]!.trigger('click');
    expect(order).toEqual(['click:help']);
    await wrapper.findAll('[role="tab"]')[1]!.trigger('click');
    expect(order).toEqual(['click:help']);
  });

  it('activeKey 受控与 modelValue 受控只等待父回写，默认值不误判为受控', async () => {
    const controlled = mountTabs({ activeKey: 'docs' });
    await controlled.findAll('[role="tab"]')[2]!.trigger('click');
    expect(controlled.emitted('change')?.[0]).toEqual(['help']);
    expect(controlled.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe('true');
    await controlled.setProps({ activeKey: 'help' });
    expect(controlled.findAll('[role="tab"]')[2]!.attributes('aria-selected')).toBe('true');

    const model = mountTabs({ modelValue: 'docs' });
    await model.findAll('[role="tab"]')[2]!.trigger('click');
    expect(model.emitted('update:modelValue')?.[0]).toEqual(['help']);
    expect(model.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe('true');

    const uncontrolled = mountTabs({ defaultActiveKey: 'help' });
    expect(uncontrolled.findAll('[role="tab"]')[2]!.attributes('aria-selected')).toBe('true');
  });

  it('keepDOM 缺省/裸属性/false/true 与 lazyRender 在 SFC 模板和 h() 均正确', async () => {
    const TemplateHost = defineComponent({
      components: { TabPane, Tabs },
      template: `
        <div>
          <Tabs data-testid="default"><TabPane item-key="a" tab="A">A</TabPane><TabPane item-key="b" tab="B">B</TabPane></Tabs>
          <Tabs data-testid="bare" keep-d-o-m><TabPane item-key="a" tab="A">A</TabPane><TabPane item-key="b" tab="B">B</TabPane></Tabs>
          <Tabs data-testid="false" :keep-d-o-m="false"><TabPane item-key="a" tab="A">A</TabPane><TabPane item-key="b" tab="B">B</TabPane></Tabs>
        </div>`,
    });
    const host = mount(TemplateHost);
    wrappers.push(host);
    expect(host.get('[data-testid="default"]').findAll('[role="tabpanel"]')).toHaveLength(2);
    expect(host.get('[data-testid="bare"]').findAll('[role="tabpanel"]')).toHaveLength(2);
    expect(host.get('[data-testid="false"]').findAll('[role="tabpanel"]')).toHaveLength(1);

    const lazy = mountTabs({ lazyRender: true });
    expect(lazy.findAll('[role="tabpanel"]')[1]!.text()).toBe('');
    await lazy.findAll('[role="tab"]')[2]!.trigger('click');
    expect(lazy.findAll('[role="tabpanel"]')[2]!.text()).toBe('帮助内容');
    await lazy.findAll('[role="tab"]')[0]!.trigger('click');
    expect(lazy.findAll('[role="tabpanel"]')[2]!.text()).toBe('帮助内容');
  });

  it('tabList 优先提供 bar，默认 slot 作为调用方控制的当前内容', () => {
    const wrapper = mountTabs(
      {
        tabList: [
          { itemKey: 'one', tab: 'One' },
          { itemKey: 'two', tab: 'Two', icon: h('i', { class: 'plain-icon' }) },
        ],
      },
      () => h('strong', { class: 'external-content' }, 'Active content'),
    );
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2);
    expect(wrapper.find('.plain-icon').exists()).toBe(true);
    expect(wrapper.get('.external-content').text()).toBe('Active content');
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(0);
  });

  it('Fragment/注释/空白不污染 pane 收集，动态删除当前项回退首个可用项', async () => {
    const keys = shallowRef(['a', 'b']);
    const Host = defineComponent({
      setup() {
        return () =>
          h(Tabs, { defaultActiveKey: 'b' }, () => [
            h(
              Fragment,
              null,
              keys.value.map((key) => h(TabPane, { itemKey: key, tab: key }, () => key)),
            ),
          ]);
      },
    });
    const wrapper = mount(Host);
    wrappers.push(wrapper);
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2);
    expect(wrapper.findAll('[role="tab"]')[1]!.attributes('aria-selected')).toBe('true');
    keys.value = ['a'];
    await nextTick();
    await nextTick();
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(1);
    expect(wrapper.get('[role="tab"]').attributes('aria-selected')).toBe('true');
  });

  it('方向键/Home/End 只移动焦点，Enter/Space 激活并跳过 disabled', async () => {
    const wrapper = mountTabs({ preventScroll: true });
    const tabs = wrapper.findAll<HTMLElement>('[role="tab"]');
    tabs[0]!.element.focus();
    await tabs[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[2]!.element);
    expect(tabs[0]!.attributes('aria-selected')).toBe('true');
    await tabs[2]!.trigger('keydown', { key: 'Home' });
    expect(document.activeElement).toBe(tabs[0]!.element);
    await tabs[2]!.trigger('keydown', { key: 'Enter' });
    expect(tabs[2]!.attributes('aria-selected')).toBe('true');
    await tabs[2]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[0]!.element);
  });

  it('Close click 与 Delete 仅派发 tabClose 且不会冒泡选择', async () => {
    const wrapper = mountTabs();
    await wrapper.get('.semi-tabs-tab-icon-close').trigger('click');
    expect(wrapper.emitted('tabClose')?.[0]).toEqual(['help']);
    expect(wrapper.emitted('tabClick')).toBeUndefined();
    await wrapper.findAll('[role="tab"]')[2]!.trigger('keydown', { key: 'Delete' });
    expect(wrapper.emitted('tabClose')?.[1]).toEqual(['help']);
  });

  it('more 与 collapsible 输出固定触发、OverflowList class 和可见项 Map', async () => {
    const more = mountTabs({ more: 1, type: 'card' });
    expect(more.findAll('[role="tab"]')).toHaveLength(2);
    expect(more.get('.semi-tabs-bar-more-trigger').text()).toContain('更多');

    const visible: Map<string, boolean>[] = [];
    const collapsed = mountTabs({
      collapsible: true,
      onVisibleTabsChange: (state: Map<string, boolean>) => visible.push(state),
    });
    await nextTick();
    expect(collapsed.get('.semi-tabs-bar').classes()).toContain('semi-tabs-bar-collapse');
    expect(collapsed.get('.semi-overflow-list').classes()).toContain('semi-tabs-bar-overflow-list');
    expect(collapsed.findAll('.semi-tabs-bar-arrow')).toHaveLength(2);
    expect(visible.at(-1)).toBeInstanceOf(Map);
  });

  it('公开 TabItem 可独立复用并保留 attrs/ref 所需 DOM', async () => {
    const wrapper = mount(TabItem, {
      props: { itemKey: 'drag', selected: true, tab: 'Drag', type: 'card' },
      attrs: { 'data-dnd': 'true' },
    });
    wrappers.push(wrapper);
    expect(wrapper.attributes()).toMatchObject({
      'data-dnd': 'true',
      'data-tabkey': 'semiTabdrag',
      role: 'tab',
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')?.[0]?.[0]).toBe('drag');
  });
});
