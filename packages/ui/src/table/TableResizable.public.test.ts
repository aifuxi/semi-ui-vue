import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './index';
import ConfigProvider from '../config-provider/ConfigProvider.vue';

describe('Table public resizable columns', () => {
  it('only exposes handles for numeric widths that are not disabled', () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        resizable: true,
        dataSource: [{ key: 'one' }],
        columns: [
          { key: 'numeric', title: 'Numeric', width: 120 },
          { key: 'auto', title: 'Auto' },
          { key: 'string', title: 'String', width: '120px' },
          { key: 'disabled', title: 'Disabled', width: 120, resize: false },
        ],
      },
    });
    expect(wrapper.findAll('.react-resizable-handle')).toHaveLength(1);
    expect(wrapper.find('th').classes()).toContain('react-resizable');
    expect(wrapper.find('.react-resizable-handle').classes()).toContain(
      'react-resizable-handle-se',
    );
    wrapper.unmount();
  });
  for (const direction of ['ltr', 'rtl'] as const)
    it(`retains the east resize delta and minimum width in ${direction}`, async () => {
      const onResize = vi.fn();
      const wrapper = mount(() =>
        h(ConfigProvider, { direction }, () =>
          h(Table, {
            pagination: false,
            resizable: { onResize },
            dataSource: [{ key: 'one' }],
            columns: [
              { key: 'width', title: 'Width', width: 120 },
              { key: 'auto', title: 'Auto' },
            ],
          }),
        ),
      );
      await wrapper
        .find('.react-resizable-handle')
        .trigger('pointerdown', { clientX: 100, button: 0 });
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 130 }));
      await nextTick();
      expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({ width: 150 }));
      expect(onResize).toHaveBeenCalledTimes(1);
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 130 }));
      await nextTick();
      expect(onResize).toHaveBeenCalledTimes(1);
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: -100 }));
      await nextTick();
      expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({ width: 20 }));
      expect(onResize).toHaveBeenCalledTimes(2);
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: -90 }));
      await nextTick();
      expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({ width: 20 }));
      expect(onResize).toHaveBeenCalledTimes(2);
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10 }));
      await nextTick();
      expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({ width: 30 }));
      expect(onResize).toHaveBeenCalledTimes(3);
      window.dispatchEvent(new MouseEvent('pointerup', { clientX: 10 }));
      wrapper.unmount();
    });
  it('merges resize callback attributes through start, move and stop', async () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [{ key: 'one', name: 'One' }],
        columns: [{ key: 'name', dataIndex: 'name', title: 'Name', width: 120 }],
        resizable: {
          handlerClassName: 'dragging-column',
          onResizeStart: (column) => ({ className: `${column.className} custom-resizing` }),
          onResize: () => ({ title: 'Resized' }),
          onResizeStop: (column) => ({
            className: (column.className ?? '').replace('custom-resizing', '').trim(),
          }),
        },
      },
    });
    await wrapper
      .find('.react-resizable-handle')
      .trigger('pointerdown', { clientX: 100, button: 0 });
    expect(wrapper.find('th').classes()).toContain('dragging-column');
    expect(wrapper.find('th').classes()).toContain('custom-resizing');
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 130 }));
    await nextTick();
    expect(wrapper.find('th').text()).toBe('Resized');
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 130 }));
    await nextTick();
    expect(wrapper.find('th').classes()).not.toContain('dragging-column');
    expect(wrapper.find('th').classes()).not.toContain('custom-resizing');
    wrapper.unmount();
  });
  it('keeps resized widths while accepting updated columns and releasing removed columns', async () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [{ key: 'one', name: 'One' }],
        columns: [{ key: 'name', dataIndex: 'name', title: 'Name', width: 120 }],
        resizable: {
          onResize: () => ({ title: 'Temporary heading', className: 'resize-feedback' }),
        },
      },
    });
    await wrapper
      .find('.react-resizable-handle')
      .trigger('pointerdown', { clientX: 100, button: 0 });
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 130 }));
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 130 }));
    await nextTick();
    await wrapper.setProps({
      columns: [
        {
          key: 'name',
          dataIndex: 'name',
          title: 'Updated heading',
          width: 80,
          render: (text: unknown) => `Updated ${text}`,
        },
        { key: 'new', title: 'New column', width: 90 },
      ],
    });
    expect(wrapper.find('th').text()).toBe('Updated heading');
    expect(wrapper.find('tbody td').text()).toBe('Updated One');
    expect(wrapper.find('col').attributes('style')).toContain('width: 150px');
    expect(wrapper.find('th').classes()).toContain('resize-feedback');
    expect(wrapper.findAll('.react-resizable-handle')).toHaveLength(2);
    await wrapper.setProps({ columns: [{ key: 'new', title: 'New column', width: 90 }] });
    expect(wrapper.findAll('th')).toHaveLength(1);
    expect(wrapper.find('th').text()).toBe('New column');
    await wrapper.setProps({ columns: [{ key: 'name', title: 'Reintroduced', width: 80 }] });
    expect(wrapper.find('col').attributes('style')).toContain('width: 80px');
    expect(wrapper.find('th').classes()).not.toContain('resize-feedback');
    wrapper.unmount();
  });
  it('does not sort after a resize gesture even when the final click targets the header', async () => {
    const onHeaderClick = vi.fn();
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        resizable: true,
        columns: [
          {
            key: 'size',
            dataIndex: 'size',
            title: 'Size',
            width: 120,
            sorter: (a, b) => Number(a.size) - Number(b.size),
            onHeaderCell: () => ({ onClick: onHeaderClick }),
          },
        ],
        dataSource: [
          { key: 'a', size: 2 },
          { key: 'b', size: 1 },
        ],
      },
    });
    const header = wrapper.get('th');
    const handle = header.get('.react-resizable-handle');
    await handle.trigger('pointerdown', { clientX: 100, button: 0 });
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 140 }));
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 140 }));
    await nextTick();
    await header.trigger('click', { clientX: 140 });
    expect(wrapper.find('.semi-table-column-sorter-up.on').exists()).toBe(false);
    expect(wrapper.findAll('tbody tr').map((row) => row.attributes('data-row-key'))).toEqual([
      'a',
      'b',
    ]);
    expect(onHeaderClick).toHaveBeenCalledTimes(1);
    await header.trigger('mousedown', { clientX: 100, button: 0 });
    await header.trigger('click', { clientX: 100 });
    expect(wrapper.find('.semi-table-column-sorter-up.on').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr').map((row) => row.attributes('data-row-key'))).toEqual([
      'b',
      'a',
    ]);
    expect(onHeaderClick).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });
  it('measures every move in the moving and scrolling offset parent coordinate system', async () => {
    let width = 200;
    const onResize = vi.fn((column) => {
      width = column.width;
    });
    const wrapper = mount(() =>
      h(ConfigProvider, { direction: 'rtl' }, () =>
        h(Table, {
          pagination: false,
          resizable: { onResize },
          columns: [{ key: 'width', title: 'Width', width: 200 }],
          dataSource: [{ key: 'one' }],
        }),
      ),
    );
    const header = wrapper.get('th');
    const handle = wrapper.get('.react-resizable-handle');
    Object.defineProperty(handle.element, 'offsetParent', {
      configurable: true,
      get: () => header.element,
    });
    vi.spyOn(header.element, 'getBoundingClientRect').mockImplementation(() => ({
      left: 400 - (width - 200),
      right: 600,
      width,
      top: 0,
      bottom: 40,
      height: 40,
      x: 400 - (width - 200),
      y: 0,
      toJSON: () => ({}),
    }));
    await handle.trigger('pointerdown', { clientX: 404, button: 0 });
    for (const clientX of [412, 420, 428, 436, 444]) {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX }));
      await nextTick();
    }
    expect(onResize.mock.calls.map((call) => call[0].width)).toEqual([208, 224, 248, 280, 320]);
    // Parent scrolling is part of the local pointer position even without client motion.
    (header.element as HTMLElement).scrollLeft = 10;
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 444 }));
    await nextTick();
    expect(width).toBe(370);
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 444 }));
    wrapper.unmount();
  });
  it('clears the starting selection without preventing native mouse selection and cancels touch scrolling', async () => {
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        pagination: false,
        resizable: true,
        columns: [{ key: 'name', title: 'Selectable heading', width: 120 }],
        dataSource: [{ key: 'one' }],
      },
    });
    const header = wrapper.get('th');
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(header.element);
    selection.addRange(range);
    expect(selection.toString()).toContain('Selectable heading');
    const event = new MouseEvent('pointerdown', {
      clientX: 100,
      button: 0,
      cancelable: true,
      bubbles: true,
    });
    wrapper.get('.react-resizable-handle').element.dispatchEvent(event);
    expect(selection.toString()).toBe('');
    expect(event.defaultPrevented).toBe(false);
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 100 }));
    const touch = new Event('touchstart', { cancelable: true, bubbles: true });
    wrapper.get('.react-resizable-handle').element.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(true);
    wrapper.unmount();
  });
});
