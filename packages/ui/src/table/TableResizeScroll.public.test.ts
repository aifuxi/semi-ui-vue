import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, rs } from '@rstest/core';
import { Table } from './index';

afterEach(() => {
  rs.restoreAllMocks();
  rs.unstubAllGlobals();
});

describe('Table 列伸缩与滚动边界公开契约', () => {
  it('固定模式观察根容器，在通知后的动画帧更新边界并清理卸载后的工作', async () => {
    const listeners = new Map<Element, () => void>();
    class TestResizeObserver {
      private targets = new Set<Element>();
      constructor(private callback: ResizeObserverCallback) {}
      observe(target: Element) {
        this.targets.add(target);
        listeners.set(target, () => this.callback([], this));
      }
      unobserve(target: Element) {
        this.targets.delete(target);
        listeners.delete(target);
      }
      disconnect() {
        for (const target of this.targets) listeners.delete(target);
        this.targets.clear();
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
    const ordinary = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', width: 120 }],
        dataSource: [],
        pagination: false,
        resizable: true,
      },
    });
    expect(listeners.has(ordinary.element)).toBe(false);
    ordinary.unmount();
    const wrapper = mount(Table, {
      props: {
        columns: [{ key: 'name', title: 'Name', dataIndex: 'name', width: 120, fixed: true }],
        dataSource: [{ key: 'one', name: 'One' }],
        pagination: false,
        resizable: true,
      },
    });
    const body = wrapper.get('.semi-table-body');
    let tableWidth = 200;
    rs.spyOn(body.element, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 200, 100));
    rs.spyOn(body.get('table').element, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, tableWidth, 100),
    );
    const boundary = wrapper.get('.semi-table-scroll-position-left');
    const notify = listeners.get(wrapper.element);
    expect(notify).toBeDefined();
    notify!();
    expect(frames.size).toBe(1);
    // Geometry can settle between observer delivery and the next paint.
    tableWidth = 240;
    expect(boundary.classes()).toContain('semi-table-scroll-position-right');
    const pending = [...frames.entries()];
    frames.clear();
    for (const [, callback] of pending) callback(0);
    await nextTick();
    expect(boundary.classes()).toContain('semi-table-scroll-position-left');
    expect(boundary.classes()).not.toContain('semi-table-scroll-position-right');
    notify!();
    expect(frames.size).toBe(1);
    wrapper.unmount();
    expect(listeners.size).toBe(0);
    expect(frames.size).toBe(0);
    notify!();
    expect(frames.size).toBe(0);
  });

  it('列伸缩保留已有滚动边界，真实横滚后更新为中间与两端状态', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ key: 'name', title: 'Name', dataIndex: 'name', width: 120 }],
        dataSource: [{ key: 'one', name: 'One' }],
        pagination: false,
        resizable: true,
      },
    });
    const body = wrapper.get('.semi-table-body');
    const table = body.get('table');
    let tableWidth = 200;
    const bodyRect = rs
      .spyOn(body.element, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(0, 0, 200, 100));
    const tableRect = rs
      .spyOn(table.element, 'getBoundingClientRect')
      .mockImplementation(() => new DOMRect(0, 0, tableWidth, 100));
    await body.trigger('scroll');
    const frame = wrapper.get('.semi-table-scroll-position-left');
    expect(frame.classes()).toContain('semi-table-scroll-position-right');
    await wrapper
      .get('.react-resizable-handle')
      .trigger('pointerdown', { clientX: 100, button: 0 });
    tableWidth = 240;
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 140 }));
    await nextTick();
    expect(frame.classes()).toContain('semi-table-scroll-position-left');
    expect(frame.classes()).toContain('semi-table-scroll-position-right');
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 140 }));
    await nextTick();
    expect(frame.classes()).toContain('semi-table-scroll-position-right');
    await wrapper.setProps({ direction: 'rtl' });
    expect(frame.classes()).toContain('semi-table-scroll-position-right');
    body.element.scrollLeft = -20;
    await body.trigger('scroll');
    expect(frame.classes()).toContain('semi-table-scroll-position-middle');
    expect(frame.classes()).not.toContain('semi-table-scroll-position-left');
    expect(frame.classes()).not.toContain('semi-table-scroll-position-right');
    body.element.scrollLeft = -40;
    await body.trigger('scroll');
    expect(frame.classes()).toContain('semi-table-scroll-position-right');
    body.element.scrollLeft = 0;
    await body.trigger('scroll');
    expect(frame.classes()).toContain('semi-table-scroll-position-left');
    expect(frame.classes()).not.toContain('semi-table-scroll-position-right');
    tableRect.mockRestore();
    bodyRect.mockRestore();
    wrapper.unmount();
  });
});
