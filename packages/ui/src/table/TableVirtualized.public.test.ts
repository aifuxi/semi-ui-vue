import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, rs } from '@rstest/core';
import { Table, type TableVirtualizedListRef } from './index';

const records = Array.from({ length: 1000 }, (_, index) => ({
  key: String(index),
  name: `Row ${index}`,
}));

function geometry(body: HTMLElement, height: number, scrollHeight: number) {
  Object.defineProperties(body, {
    clientHeight: { configurable: true, value: height },
    offsetHeight: { configurable: true, value: height },
    scrollHeight: { configurable: true, value: scrollHeight },
    clientWidth: { configurable: true, value: 300 },
    scrollWidth: { configurable: true, value: 400 },
  });
}

function clampScrollToRenderedHeight(body: HTMLElement, height: number) {
  geometry(body, height, 0);
  const tbody = body.querySelector('.semi-table-tbody') as HTMLElement;
  let scrollTop = 0;
  const writeScrollTop = rs.fn((value: number) => {
    scrollTop = Math.max(0, Math.min(value, body.scrollHeight - body.clientHeight));
  });
  // jsdom does not lay out scroll containers. Model the browser's native
  // scrollTop clamp using the actual, currently committed tbody height.
  Object.defineProperties(body, {
    scrollHeight: { configurable: true, get: () => Number.parseFloat(tbody.style.height) },
    scrollTop: { configurable: true, get: () => scrollTop, set: writeScrollTop },
  });
  return writeScrollTop;
}

describe('Table 真实虚拟表体公开契约', () => {
  it('远跳尾部先提交增大的总高，再设置滚动位置和通知调用方', async () => {
    let list: TableVirtualizedListRef | null = null;
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: records,
        pagination: false,
        virtualized: { onScroll },
        scroll: { x: 400, y: 400 },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    await nextTick();
    const body = wrapper.get('.semi-table-body').element as HTMLElement;
    clampScrollToRenderedHeight(body, 400);
    onScroll.mockClear();
    const statesAtNotification: Array<{ offset: number; height: number; targetVisible: boolean }> =
      [];
    onScroll.mockImplementation(() => {
      statesAtNotification.push({
        offset: body.scrollTop,
        height: body.scrollHeight,
        targetVisible: Boolean(body.querySelector('[data-row-key="999"]')),
      });
    });
    expect(body.scrollHeight).toBe(50030);
    list!.scrollToItem(999);
    await nextTick();
    expect(body.scrollTop).toBe(52600);
    expect(body.scrollHeight).toBe(53000);
    expect(wrapper.get('[data-row-key="999"]').attributes('aria-rowindex')).toBe('1000');
    expect(statesAtNotification).toEqual([{ offset: 52600, height: 53000, targetVisible: true }]);
    expect(onScroll).toHaveBeenLastCalledWith({
      scrollOffset: 52600,
      scrollDirection: 'forward',
      scrollUpdateWasRequested: true,
    });
    await wrapper.get('.semi-table-body').trigger('scroll');
    expect(onScroll).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('同一提交周期连续程序滚动仅写入最后一个请求', async () => {
    let list: TableVirtualizedListRef | null = null;
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: records,
        pagination: false,
        virtualized: { onScroll },
        scroll: { x: 400, y: 400 },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    await nextTick();
    const body = wrapper.get('.semi-table-body').element as HTMLElement;
    const writeScrollTop = clampScrollToRenderedHeight(body, 400);
    onScroll.mockClear();
    list!.scrollToItem(100, 'start');
    list!.scrollToItem(999, 'end');
    await nextTick();
    expect(writeScrollTop.mock.calls).toEqual([[52600]]);
    expect(body.scrollTop).toBe(52600);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll).toHaveBeenLastCalledWith({
      scrollOffset: 52600,
      scrollDirection: 'forward',
      scrollUpdateWasRequested: true,
    });
    wrapper.unmount();
  });

  it('卸载取消尚未提交的滚动，保留旧ref也不再写DOM或回调', async () => {
    let list: TableVirtualizedListRef | null = null;
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: records,
        pagination: false,
        virtualized: { onScroll },
        scroll: { x: 400, y: 400 },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    await nextTick();
    const body = wrapper.get('.semi-table-body').element as HTMLElement;
    const writeScrollTop = clampScrollToRenderedHeight(body, 400);
    onScroll.mockClear();
    const retainedList = list!;
    retainedList.scrollToItem(999);
    wrapper.unmount();
    await nextTick();
    retainedList.scrollToItem(100);
    await nextTick();
    expect(writeScrollTop).not.toHaveBeenCalled();
    expect(onScroll).not.toHaveBeenCalled();
  });

  it('筛选缩短数据后清除时保留已测前缀，不退回估算高度', async () => {
    let list: TableVirtualizedListRef | null = null;
    const dataSource = records.slice(0, 20);
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource,
        pagination: false,
        virtualized: { itemSize: 56 },
        scroll: { x: 400, y: 600 },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    const height = () => (wrapper.get('.semi-table-tbody').element as HTMLElement).style.height;
    expect(height()).toBe('1078px');
    list!.scrollTo(168);
    await nextTick();
    expect(height()).toBe('1096px');
    list!.scrollTo(0);
    await nextTick();
    await wrapper.setProps({ dataSource: dataSource.filter((_, index) => index % 2 === 0) });
    expect(height()).toBe('560px');
    await wrapper.setProps({ dataSource });
    expect(height()).toBe('1096px');
    wrapper.unmount();
  });

  it('使用 div 行窗口、默认 53px 行高与已测前缀/50px估算后缀，auto 仅滚动到目标可见', async () => {
    let list: TableVirtualizedListRef | null = null;
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', title: 'Name', width: 400 }],
        dataSource: records,
        pagination: false,
        virtualized: { onScroll },
        scroll: { x: 400, y: 400 },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    await nextTick();
    const body = wrapper.get('.semi-table-body').element as HTMLElement;
    geometry(body, 400, 53000);
    expect(wrapper.find('.semi-table-body table').exists()).toBe(false);
    expect(wrapper.find('.semi-table-body colgroup').exists()).toBe(false);
    const rows = wrapper.findAll('.semi-table-tbody > div');
    expect(rows).toHaveLength(10);
    expect((rows[0]!.element as HTMLElement).style.height).toBe('53px');
    expect((wrapper.get('.semi-table-tbody').element as HTMLElement).style.height).toBe('50030px');
    expect((rows[0]!.get('.semi-table-row-cell').element as HTMLElement).style.width).toBe('400px');
    list!.scrollToItem(100);
    await nextTick();
    expect(body.scrollTop).toBe(4953);
    expect(wrapper.get('[data-row-key="100"]').attributes('aria-rowindex')).toBe('101');
    expect(onScroll).toHaveBeenLastCalledWith({
      scrollOffset: 4953,
      scrollDirection: 'forward',
      scrollUpdateWasRequested: true,
    });
    list!.scrollToItem(100);
    expect(body.scrollTop).toBe(4953);
    wrapper.unmount();
    expect(list).toBeNull();
  });

  it('逐行高度决定窗口；程序、纵向与纯横向滚动分开通知并同步表头', async () => {
    let list: TableVirtualizedListRef | null = null;
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: records.slice(0, 30),
        pagination: false,
        scroll: { x: 400, y: 120 },
        virtualized: { itemSize: (index = 0) => (index % 2 ? 120 : 40), onScroll },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    await nextTick();
    const body = wrapper.get('.semi-table-body').element as HTMLElement;
    geometry(body, 120, 2400);
    list!.scrollToItem(5, 'start');
    await nextTick();
    expect(body.scrollTop).toBe(360);
    expect((wrapper.get('[data-row-key="5"]').element as HTMLElement).style.top).toBe('360px');
    const calls = onScroll.mock.calls.length;
    await wrapper.get('.semi-table-body').trigger('scroll');
    expect(onScroll.mock.calls).toHaveLength(calls);
    body.scrollTop = 400;
    await wrapper.get('.semi-table-body').trigger('scroll');
    expect(onScroll).toHaveBeenLastCalledWith({
      scrollOffset: 400,
      scrollDirection: 'forward',
      scrollUpdateWasRequested: false,
    });
    body.scrollLeft = 100;
    await wrapper.get('.semi-table-body').trigger('scroll');
    expect(onScroll).toHaveBeenLastCalledWith({ horizontalScrolling: true });
    expect((wrapper.get('.semi-table-header').element as HTMLElement).scrollLeft).toBe(100);
    wrapper.unmount();
  });

  it('RTL 使用右侧行起点与固定列，resetAfterIndex 使调用方新高度生效', async () => {
    let list: TableVirtualizedListRef | null = null;
    let itemSize = 40;
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400, fixed: true }],
        dataSource: records.slice(0, 20),
        pagination: false,
        direction: 'rtl',
        scroll: { x: 400, y: 120 },
        virtualized: { itemSize: () => itemSize },
        getVirtualizedListRef: (ref) => {
          list = ref.current;
        },
      },
    });
    const first = wrapper.get('.semi-table-tbody > .semi-table-row');
    expect((first.element as HTMLElement).style.right).toBe('0px');
    expect((first.element as HTMLElement).style.left).toBe('');
    expect(first.get('.semi-table-row-cell').classes()).toContain('semi-table-cell-fixed-right');
    itemSize = 80;
    list!.resetAfterIndex(0);
    await nextTick();
    expect((first.element as HTMLElement).style.height).toBe('80px');
    wrapper.unmount();
  });

  it('展开内容占据独立虚拟索引，itemSize 收到对应行元数据', async () => {
    const itemSize = rs.fn(
      (_index?: number, row?: { expandedRow?: boolean; sectionRow?: boolean }) =>
        row?.expandedRow ? 90 : 53,
    );
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: records.slice(0, 10),
        pagination: false,
        defaultExpandedRowKeys: ['0'],
        expandedRowRender: () => ({ children: h('p', 'Expanded'), fixed: 'left' }),
        virtualized: { itemSize },
        scroll: { x: 400, y: 400 },
      },
    });
    expect(itemSize).toHaveBeenCalledWith(1, { expandedRow: true, sectionRow: false });
    const expanded = wrapper.get('[data-row-key="0-expanded-row"]');
    expect(expanded.attributes('aria-rowindex')).toBe('2');
    expect((expanded.element as HTMLElement).style.height).toBe('90px');
    expect(expanded.get('.semi-table-expand-inner').text()).toBe('Expanded');
    expect(wrapper.get('[data-row-key="1"]').attributes('aria-rowindex')).toBe('3');
    wrapper.unmount();
  });
});
