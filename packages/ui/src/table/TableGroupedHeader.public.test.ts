import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from '@rstest/core';
import { Table, type TableColumnProps } from './index';

const columns: TableColumnProps[] = [
  { key: 'leading', title: 'Leading', dataIndex: 'leading', width: 24, fixed: true },
  {
    key: 'left-group',
    title: 'Left group',
    fixed: 'left',
    children: [
      { dataIndex: 'a', title: 'A', width: 80, fixed: true },
      { dataIndex: 'b', title: 'B', width: 120, fixed: true },
    ],
  },
  { dataIndex: 'middle', title: 'Middle', width: 100 },
  {
    key: 'right-group',
    title: 'Right group',
    fixed: 'right',
    children: [
      { dataIndex: 'd', title: 'D', width: 40, fixed: 'right' },
      { dataIndex: 'e', title: 'E', width: 60, fixed: 'right' },
    ],
  },
  { dataIndex: 'trailing', title: 'Trailing', width: 30, fixed: 'right' },
];

describe('Table 分组表头公开契约', () => {
  for (const direction of ['ltr', 'rtl'] as const) {
    it(`${direction} 父组按本层列计算固定偏移与边缘，只有叶子自动补 rowSpan`, async () => {
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: [{ key: 'row', a: 'Alpha' }],
          rowSelection: { fixed: true, width: 48 },
          pagination: false,
          direction,
          scroll: { y: 400 },
        },
      });
      await nextTick();
      const headers = wrapper.findAll('.semi-table-thead > tr');
      const first = headers[0]!.findAll('th');
      const left = first.find((cell) => cell.text() === 'Left group')!;
      const right = first.find((cell) => cell.text() === 'Right group')!;
      const leftSide = direction === 'rtl' ? 'right' : 'left';
      const rightSide = direction === 'rtl' ? 'left' : 'right';
      for (const cell of [left, right]) {
        expect(cell.attributes('colspan')).toBe('2');
        expect(cell.attributes('rowspan')).toBeUndefined();
        expect((cell.element as HTMLElement).style.position).toBe('sticky');
      }
      expect((left.element as HTMLElement).style[leftSide]).toBe('72px');
      expect((right.element as HTMLElement).style[rightSide]).toBe('30px');
      expect(left.classes()).toContain(`semi-table-cell-fixed-${leftSide}`);
      expect(left.classes()).toContain(
        `semi-table-cell-fixed-${leftSide}-${leftSide === 'left' ? 'last' : 'first'}`,
      );
      expect(right.classes()).toContain(`semi-table-cell-fixed-${rightSide}`);
      expect(right.classes()).toContain(
        `semi-table-cell-fixed-${rightSide}-${rightSide === 'left' ? 'last' : 'first'}`,
      );
      expect(first.find((cell) => cell.text() === 'Middle')!.attributes('rowspan')).toBe('2');
      expect(headers[1]!.findAll('th').map((cell) => cell.attributes('rowspan'))).toEqual([
        '1',
        '1',
        '1',
        '1',
      ]);
      await wrapper.setProps({
        columns: columns.map((column) =>
          column.key === 'left-group' ? { ...column, rowSpan: 1 } : column,
        ),
      });
      expect(
        wrapper
          .findAll('.semi-table-thead > tr')
          .at(0)!
          .findAll('th')
          .find((cell) => cell.text() === 'Left group')!
          .attributes('rowspan'),
      ).toBe('1');
      wrapper.unmount();
    });
  }
});
