import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, rs } from '@rstest/core';

import { Table } from './index';
import TableDescriptionsExpansion from './test-fixtures/TableDescriptionsExpansion.vue';

afterEach(() => {
  rs.restoreAllMocks();
  rs.unstubAllGlobals();
});

describe('Table 公开展开列契约', () => {
  it('虚拟表格在挂载同一 tick 卸载后不发送初始滚动通知', async () => {
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 100 }],
        dataSource: [{ key: 'a', name: 'Alpha' }],
        pagination: false,
        scroll: { y: 400 },
        virtualized: { onScroll },
      },
    });
    wrapper.unmount();
    await nextTick();
    expect(onScroll).not.toHaveBeenCalled();
  });

  it('挂载后启用固定选择列时补装一次根观察器并测量后续展开宽度', async () => {
    let rootWidth = 750;
    let notify: (() => void) | undefined;
    const construct = rs.fn();
    const observe = rs.fn();
    const disconnect = rs.fn();
    class TestResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        construct();
        notify = () => callback([], this);
      }
      observe(target: Element) {
        observe(target);
      }
      unobserve() {}
      disconnect() {
        disconnect();
      }
    }
    const frames = new Map<number, FrameRequestCallback>();
    let frameId = 0;
    rs.stubGlobal('ResizeObserver', TestResizeObserver);
    rs.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    rs.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    rs.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return new DOMRect(
        0,
        0,
        this.classList.contains('semi-table-wrapper') ? rootWidth : 300,
        100,
      );
    });
    rs.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.style.overflowY === 'scroll' ? 50 : 300;
    });
    rs.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
      return this instanceof HTMLElement && this.style.overflowY === 'scroll' ? 50 : 300;
    });
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alpha' }],
        pagination: false,
        expandedRowRender: () => h('p', 'Details'),
      },
    });
    await nextTick();
    expect(construct).not.toHaveBeenCalled();
    await wrapper.setProps({ rowSelection: { fixed: true } });
    await nextTick();
    expect(construct).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledExactlyOnceWith(wrapper.element);
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    const width = () =>
      (wrapper.get('.semi-table-expand-inner').element as HTMLElement).style.width;
    expect(width()).toBe('716px');
    await wrapper.setProps({ direction: 'rtl' });
    await nextTick();
    expect(construct).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledOnce();
    notify!();
    rootWidth = 630;
    expect(width()).toBe('716px');
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
    await nextTick();
    expect(width()).toBe('596px');
    notify!();
    expect(frames.size).toBe(1);
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    notify!();
    expect(frames.size).toBe(0);
  });

  for (const scrollbarWidth of [0, 15]) {
    it(`${scrollbarWidth ? '固定选择列' : '分组固定列'}的展开宽度使用根容器与独立滚动条测量`, async () => {
      let rootWidth = 750;
      let observed: Element | undefined;
      let notify: (() => void) | undefined;
      const disconnect = rs.fn();
      class TestResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          notify = () => callback([], this);
        }
        observe(target: Element) {
          observed = target;
        }
        unobserve() {}
        disconnect() {
          disconnect();
        }
      }
      const frames = new Map<number, FrameRequestCallback>();
      let frameId = 0;
      rs.stubGlobal('ResizeObserver', TestResizeObserver);
      rs.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        frames.set(++frameId, callback);
        return frameId;
      });
      rs.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
      rs.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        return new DOMRect(
          0,
          0,
          this.classList.contains('semi-table-wrapper') ? rootWidth : 300,
          100,
        );
      });
      rs.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.style.overflowY === 'scroll' ? 50 : 300;
      });
      rs.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (
        this: Element,
      ) {
        return this instanceof HTMLElement && this.style.overflowY === 'scroll'
          ? 50 - scrollbarWidth
          : 300;
      });
      const appended = rs.spyOn(document.body, 'appendChild');
      const wrapper = mount(Table, {
        props: {
          columns: [
            {
              title: 'Details',
              children: [{ dataIndex: 'name', width: 100, fixed: scrollbarWidth === 0 }],
            },
          ],
          dataSource: [{ key: 'a', name: 'Alpha' }],
          pagination: false,
          rowSelection: scrollbarWidth ? { fixed: true } : false,
          scroll: { y: 400 },
          defaultExpandedRowKeys: ['a'],
          expandedRowRender: () => h('p', 'Details'),
        },
      });
      await nextTick();
      const width = () =>
        (wrapper.get('.semi-table-expand-inner').element as HTMLElement).style.width;
      expect(width()).toBe(`${716 - scrollbarWidth}px`);
      expect(observed).toBe(wrapper.element);
      const probe = appended.mock.calls.find(
        ([node]) => node instanceof HTMLElement && node.style.overflowY === 'scroll',
      )?.[0];
      expect(probe).toBeDefined();
      expect(probe!.isConnected).toBe(false);
      const flushFrame = async () => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback(0));
        await nextTick();
      };
      notify!();
      rootWidth = 630;
      expect(width()).toBe(`${716 - scrollbarWidth}px`);
      await flushFrame();
      expect(width()).toBe(`${596 - scrollbarWidth}px`);
      rootWidth = 630.25;
      notify!();
      await flushFrame();
      expect(width()).toBe(`${596 - scrollbarWidth}px`);
      await wrapper.setProps({
        columns: [{ title: 'Details', children: [{ dataIndex: 'name', width: 100 }] }],
        rowSelection: false,
      });
      expect(width()).toBe('');
      notify!();
      expect(frames.size).toBe(1);
      wrapper.unmount();
      expect(disconnect).toHaveBeenCalledOnce();
      expect(frames.size).toBe(0);
      notify!();
      expect(frames.size).toBe(0);
    });
  }

  it('对象形式展开内容保留 VNode，折叠重开不会将对象作为文本渲染', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alpha' }],
        pagination: false,
        expandedRowRender: (record) => ({ children: h('p', String(record?.name)), fixed: 'left' }),
      },
    });
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(wrapper.get('.semi-table-expand-inner > p').text()).toBe('Alpha');
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(wrapper.find('.semi-table-row-expand').exists()).toBe(false);
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(wrapper.get('.semi-table-expand-inner > p').text()).toBe('Alpha');
    wrapper.unmount();
  });

  it('rowExpandable=false 的独立展开格不带展开列 class，展开图标主动关闭仍保留列 class', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [
          { key: 'enabled', name: 'Enabled' },
          { key: 'disabled', name: 'Disabled' },
        ],
        hideExpandedColumn: false,
        pagination: false,
        rowExpandable: (record) => record?.key !== 'disabled',
        expandedRowRender: () => h('p', 'Details'),
      },
    });
    expect(wrapper.findAll('tbody > tr')[0]!.get('td').classes()).toContain(
      'semi-table-column-expand',
    );
    expect(wrapper.findAll('tbody > tr')[1]!.get('td').classes()).not.toContain(
      'semi-table-column-expand',
    );
    expect(wrapper.findAll('tbody > tr')[1]!.get('td').text()).toBe('');
    await wrapper.setProps({ expandIcon: false });
    expect(wrapper.findAll('tbody > tr')[0]!.get('td').classes()).toContain(
      'semi-table-column-expand',
    );
    wrapper.unmount();
  });

  it('编译 SFC 展开 slot 卸载重挂后保留 data 中的 Tag VNode', async () => {
    const wrapper = mount(TableDescriptionsExpansion);
    await wrapper.get('tbody > tr').trigger('mouseenter');
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    await wrapper.get('tbody > tr').trigger('mouseleave');
    expect(wrapper.get('.semi-tag').text()).toBe('Design');
    await wrapper.get('tbody > tr').trigger('mouseenter');
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(wrapper.find('.semi-descriptions').exists()).toBe(false);
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    await wrapper.get('tbody > tr').trigger('mouseleave');
    expect(wrapper.get('.semi-tag').text()).toBe('Design');
    wrapper.unmount();
  });

  for (const hideExpandedColumn of [true, false]) {
    it(`${hideExpandedColumn ? '内嵌三角' : '独立箭头'}只渲染展开控件并支持折叠重开`, async () => {
      const wrapper = mount(Table, {
        props: {
          columns: [{ dataIndex: 'name', title: 'Name' }],
          dataSource: [{ key: 'a', name: 'Alpha' }],
          pagination: false,
          hideExpandedColumn,
          expandedRowRender: () => h('p', 'Expanded details'),
        },
      });
      const icon = wrapper.get('.semi-table-expand-icon .semi-icon');
      expect(icon.classes()).toContain(
        hideExpandedColumn ? 'semi-icon-tree_triangle_right' : 'semi-icon-chevron_right',
      );
      expect(icon.classes()).toContain(
        hideExpandedColumn ? 'semi-icon-small' : 'semi-icon-default',
      );
      expect(wrapper.get('tbody').text()).toBe('Alpha');
      if (!hideExpandedColumn) {
        expect(wrapper.get('tbody .semi-table-column-expand').text()).toBe('');
      }
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.get('tbody > tr').attributes('aria-expanded')).toBe('true');
      const expanded = wrapper.get('.semi-table-row-expand');
      expect(expanded.attributes('data-row-key')).toBe('a-expanded-row');
      expect(expanded.attributes('aria-level')).toBe('2');
      expect(expanded.get('td').attributes('aria-colindex')).toBe('1');
      expect(expanded.get('td').attributes('colspan')).toBe(hideExpandedColumn ? '1' : '2');
      expect(expanded.get('.semi-table-expand-inner').text()).toBe('Expanded details');
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.find('.semi-table-row-expand').exists()).toBe(false);
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.get('.semi-table-expand-inner').text()).toBe('Expanded details');
      wrapper.unmount();
    });
  }
});
