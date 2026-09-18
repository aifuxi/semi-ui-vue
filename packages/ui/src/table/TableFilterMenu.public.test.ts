import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './index';
import { Dropdown } from '../dropdown';

function mountFilteredTable(
  renderFilterDropdownItem: (props?: Record<string, unknown>) => ReturnType<typeof h> | null,
) {
  return mount(Table, {
    attachTo: document.body,
    props: {
      pagination: false,
      dataSource: [
        { key: 'a', name: 'Alpha' },
        { key: 'b', name: 'Beta' },
      ],
      columns: [
        {
          key: 'name',
          dataIndex: 'name',
          title: 'Name',
          filters: [
            { text: 'Alpha', value: 'Alpha' },
            { text: 'Beta', value: 'Beta' },
          ],
          onFilter: (value, row) => row?.name === value,
          filterDropdownVisible: true,
          renderFilterDropdownItem,
        },
      ],
    },
  });
}

describe('Table public custom filter items', () => {
  it('renders each custom item once with its text and filters on one public click', async () => {
    const renderItem = vi.fn((props?: Record<string, unknown>) =>
      h(
        Dropdown.Item,
        {
          active: Boolean(props?.checked),
          onClick: props?.onChange as (event: MouseEvent) => void,
        },
        () => String(props?.text),
      ),
    );
    const wrapper = mountFilteredTable(renderItem);
    await flushPromises();
    const items = [
      ...document.querySelectorAll<HTMLLIElement>('.semi-table-column-filter-dropdown li'),
    ];
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.textContent)).toEqual(['Alpha', 'Beta']);
    expect(document.querySelector('.semi-table-column-filter-dropdown li li')).toBeNull();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Alpha',
        value: 'Alpha',
        checked: false,
        filterMultiple: true,
        filteredValue: [],
        level: 0,
        onChange: expect.any(Function),
      }),
    );
    items[0]!.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(wrapper.find('tbody').text()).toBe('Alpha');
    wrapper.unmount();
  });

  it('falls back to normal filter choices when a custom renderer returns no VNode', async () => {
    const wrapper = mountFilteredTable(() => null);
    await flushPromises();
    const panel = document.querySelector('.semi-table-column-filter-dropdown');
    expect(panel?.querySelectorAll('li')).toHaveLength(2);
    expect(panel?.querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
    expect(panel?.textContent).toContain('Alpha');
    wrapper.unmount();
  });
});

it('filters once when the text inside a default checkbox item is clicked', async () => {
  const wrapper = mountFilteredTable(() => null);
  await flushPromises();
  const addon = document.querySelector<HTMLSpanElement>(
    '.semi-table-column-filter-dropdown .semi-checkbox-addon',
  );
  expect(addon?.textContent).toBe('Alpha');
  addon!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
  await flushPromises();
  addon!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
  addon!.click();
  await flushPromises();
  expect(wrapper.findAll('tbody tr')).toHaveLength(1);
  expect(wrapper.find('tbody').text()).toBe('Alpha');
  wrapper.unmount();
});
