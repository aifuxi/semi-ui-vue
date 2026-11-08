import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { Table, type TableColumnProps } from './index';

// 平台替身只提供几何与 ResizeObserver，不替换 Table 的偏移计算。
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** 提供与 CSS 渲染等价的表头几何，并保留通知目标以验证列宽独立变化。 */
function prepareGeometry() {
  /** 首列模拟 rowSelection 的主题宽度，其余键对应公开列。 */
  const widths = new Map([
    ['selection', 56],
    ['name', 240],
    ['middle', 480],
    ['action', 96],
    ['last', 80],
  ]);
  /** 当前仍被观察的节点；表头单元格必须能独立触发重测。 */
  const listeners = new Map<Element, () => void>();
  /** Observer 工作在下一动画帧，测试按该生命周期交付回调。 */
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  class TestResizeObserver {
    /** 保存平台传入的回调，模拟每个目标的尺寸通知。 */
    constructor(private callback: ResizeObserverCallback) {}
    /** 建立当前实例对节点的观察关系。 */
    observe(target: Element) {
      // 通知参数不携带几何，组件必须读取当前 DOM。
      listeners.set(target, () => this.callback([], this));
    }
    /** 列被替换后应移除旧单元格。 */
    unobserve(target: Element) {
      listeners.delete(target);
    }
    /** 单表卸载时不保留任何目标。 */
    disconnect() {
      listeners.clear();
    }
  }
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  // 使用可控帧队列验证通知和测量之间的顺序，不等待固定时长。
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  // 卸载时取消尚未交付的工作。
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  // 仅表头的实际宽度参与测量，数值列仍应优先使用声明宽度。
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    /** 选择列由 Table 自动注入，其余列通过公开 onHeaderCell 提供识别属性。 */
    const key = this.classList.contains('semi-table-column-selection')
      ? 'selection'
      : this.dataset.column;
    return new DOMRect(0, 0, key ? (widths.get(key) ?? 0) : 600, 40);
  });
  return { widths, listeners, frames };
}

/** 标准声明同时包含 CSS var、calc、px 及右固定列，避免只修复某种字符串。 */
function columns(numeric = false): TableColumnProps[] {
  /** 显式声明列类型，避免 map 前将 fixed 推断为普通字符串。 */
  const declared: TableColumnProps[] = [
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      width: numeric ? 240 : 'calc(var(--name) + 20px)',
    },
    { key: 'middle', title: '内容', dataIndex: 'middle', width: 480 },
    { key: 'action', title: '操作', dataIndex: 'action', fixed: 'right', width: '96px' },
    {
      key: 'last',
      title: '末列',
      dataIndex: 'last',
      fixed: 'right',
      width: numeric ? 72 : 'var(--last)',
    },
  ];
  return declared.map(
    // 只通过原生 cell attrs 定位测试对象，不写入 sticky 样式。
    (column) => ({
      ...column,
      // 表头与正文必须分别使用自己的公开布局结果。
      onHeaderCell: () => ({ 'data-column': column.key }),
      // 保留默认渲染和偏移，只添加识别属性。
      onCell: () => ({ 'data-column': column.key }),
    }),
  );
}

// 数值列优先规则不能被 CSS 字符串修复替换为统一读取 DOM。
it.each(['ltr', 'rtl'] as const)('CSS 与数值列的左右固定偏移一致：%s', async (direction) => {
  prepareGeometry();
  /** 独立表头的公开 scroll.y 路径与工单一致。 */
  const wrapper = mount(Table, {
    props: {
      columns: columns(),
      dataSource: [{ key: 'one', name: '第一行' }],
      pagination: false,
      rowSelection: { fixed: 'left', width: 'var(--selection)' },
      scroll: { x: 1000, y: 200 },
      direction,
    },
  });
  await nextTick();
  /** 左右在 RTL 下交换物理 CSS 属性，偏移数值保留列语义。 */
  const left = direction === 'rtl' ? 'right' : 'left';
  /** 右固定列对称验证末列宽度的累积。 */
  const right = direction === 'rtl' ? 'left' : 'right';
  for (const section of ['thead', 'tbody']) {
    expect(
      (wrapper.get(`${section} [data-column="name"]`).element as HTMLElement).style[left],
    ).toBe('56px');
    expect(
      (wrapper.get(`${section} [data-column="action"]`).element as HTMLElement).style[right],
    ).toBe('80px');
  }
  await wrapper.setProps({ columns: columns(true), rowSelection: { fixed: 'left', width: 48 } });
  for (const section of ['thead', 'tbody']) {
    expect(
      (wrapper.get(`${section} [data-column="name"]`).element as HTMLElement).style[left],
    ).toBe('48px');
    expect(
      (wrapper.get(`${section} [data-column="action"]`).element as HTMLElement).style[right],
    ).toBe('72px');
  }
  wrapper.unmount();
});

// 主题更新可能只改变单元格宽度，根容器不发生 resize。
it('表头单元格通知重测字符串宽度，并在卸载后释放观察', async () => {
  /** 保留可变几何和 Observer，模拟 CSS 变量更新后的浏览器通知。 */
  const geometry = prepareGeometry();
  /** 与真实缺陷列表相同的固定选择列和独立滚动表头。 */
  const wrapper = mount(Table, {
    props: {
      columns: columns(),
      dataSource: [{ key: 'one' }],
      pagination: false,
      showHeader: true,
      rowSelection: { fixed: 'left', width: 'var(--selection)' },
      scroll: { x: 1000, y: 200 },
    },
  });
  await nextTick();
  /** 选择列宽变化影响后续名称列偏移。 */
  const selection = wrapper.get('thead .semi-table-column-selection').element;
  expect(geometry.listeners.has(selection)).toBe(true);
  geometry.widths.set('selection', 72);
  geometry.widths.set('last', 112);
  geometry.listeners.get(selection)!();
  for (const callback of geometry.frames.values()) callback(0);
  geometry.frames.clear();
  await nextTick();
  for (const section of ['thead', 'tbody']) {
    expect((wrapper.get(`${section} [data-column="name"]`).element as HTMLElement).style.left).toBe(
      '72px',
    );
    expect(
      (wrapper.get(`${section} [data-column="action"]`).element as HTMLElement).style.right,
    ).toBe('112px');
  }
  await wrapper.setProps({ showHeader: false });
  await nextTick();
  expect(geometry.listeners.has(selection)).toBe(false);
  await wrapper.setProps({ showHeader: true });
  await nextTick();
  /** 重建表头后只观察新节点，旧节点不应长期保留。 */
  const nextSelection = wrapper.get('thead .semi-table-column-selection').element;
  expect(nextSelection).not.toBe(selection);
  expect(geometry.listeners.has(nextSelection)).toBe(true);
  /** 卸载前排队的通知及卸载后的迟到通知都不应继续测量。 */
  const lateNotification = geometry.listeners.get(nextSelection)!;
  lateNotification();
  expect(geometry.frames.size).toBe(1);
  wrapper.unmount();
  expect(geometry.listeners.size).toBe(0);
  expect(geometry.frames.size).toBe(0);
  lateNotification();
  expect(geometry.frames.size).toBe(0);
});
