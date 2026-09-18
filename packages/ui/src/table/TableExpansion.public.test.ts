import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Table } from './index';
import TableDescriptionsExpansion from './test-fixtures/TableDescriptionsExpansion.vue';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Table 公开展开列契约', () => {
  it('虚拟表格在挂载同一 tick 卸载后不发送初始滚动通知', async () => {
    const onScroll = vi.fn();
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
    const construct = vi.fn();
    const observe = vi.fn();
    const disconnect = vi.fn();
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
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return new DOMRect(
        0,
        0,
        this.classList.contains('semi-table-wrapper') ? rootWidth : 300,
        100,
      );
    });
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.style.overflowY === 'scroll' ? 50 : 300;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
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
      const disconnect = vi.fn();
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
      vi.stubGlobal('ResizeObserver', TestResizeObserver);
      vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        frames.set(++frameId, callback);
        return frameId;
      });
      vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        return new DOMRect(
          0,
          0,
          this.classList.contains('semi-table-wrapper') ? rootWidth : 300,
          100,
        );
      });
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.style.overflowY === 'scroll' ? 50 : 300;
      });
      vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (
        this: Element,
      ) {
        return this instanceof HTMLElement && this.style.overflowY === 'scroll'
          ? 50 - scrollbarWidth
          : 300;
      });
      const appended = vi.spyOn(document.body, 'appendChild');
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

  it('对象展开结果的附加列属性作用于展开单元格且 fixed 保持元数据', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alpha' }],
        pagination: false,
        expandedRowRender: () => ({
          children: h('p', 'Details'),
          align: 'right',
          className: 'column-class',
          fixed: 'left',
          onCell: (record?: Record<string, unknown>) => ({
            'data-cell': `cell-${String(record?.key)}`,
            className: 'cell-class',
            style: { color: 'red' },
          }),
        }),
      },
    });
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    const cell = wrapper.get('.semi-table-row-expand td');
    expect(cell.classes()).toEqual(
      expect.arrayContaining(['semi-table-row-cell', 'column-class', 'cell-class']),
    );
    expect(cell.attributes('data-cell')).toBe('cell-a');
    expect(cell.attributes('colspan')).toBe('1');
    expect(cell.attributes('fixed')).toBeUndefined();
    expect((cell.element as HTMLElement).style.color).toBe('red');
    expect((cell.element as HTMLElement).style.textAlign).toBe('right');
    expect(cell.get('.semi-table-expand-inner').text()).toBe('Details');
    wrapper.unmount();
  });

  it('对象展开结果的 render 覆盖默认内容并合并返回的单元格 props', async () => {
    const calls: Array<{ text: unknown; index: number; name: unknown }> = [];
    const renderCalls = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alpha' }],
        pagination: false,
        expandedRowRender: () => {
          renderCalls();
          return {
            children: h('p', 'default-details'),
            render: (text: unknown, record: Record<string, unknown>, index: number) => {
              calls.push({ text, index, name: record.name });
              return {
                children: h('p', { class: 'custom-render' }, `custom-${String(record.name)}`),
                props: { colSpan: 2 },
              };
            },
          };
        },
      },
    });
    expect(renderCalls).not.toHaveBeenCalled();
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(renderCalls).toHaveBeenCalledTimes(1);
    const cell = wrapper.get('.semi-table-row-expand td');
    expect(cell.get('.custom-render').text()).toBe('custom-Alpha');
    expect(cell.text()).not.toContain('default-details');
    expect(cell.attributes('colspan')).toBe('2');
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ index: 0, name: 'Alpha' });
    expect(calls[0]?.text).toMatchObject({ key: 'a', name: 'Alpha' });
    wrapper.unmount();
  });
});
