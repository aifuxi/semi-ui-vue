import { flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './index';

describe('Table public header content and attributes', () => {
  it('places native titles on final string headings and query title spans', () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [{ key: 'row', name: 'Alpha', score: 1 }],
        columns: [
          { key: 'plain', title: 'Plain' },
          { key: 'sort', dataIndex: 'score', title: 'Score', sorter: true },
          {
            key: 'filter',
            dataIndex: 'name',
            title: 'Name',
            filters: [{ text: 'Alpha', value: 'Alpha' }],
            onFilter: () => true,
          },
          { key: 'hidden', title: 'Hidden', ellipsis: { showTitle: false } },
          { key: 'numeric', title: 12 },
        ],
      },
    });
    const headings = wrapper.findAll('th');
    expect(headings[0]!.attributes('title')).toBe('Plain');
    expect(headings[1]!.attributes('title')).toBeUndefined();
    expect(headings[1]!.find('.semi-table-row-head-title').attributes('title')).toBe('Score');
    expect(headings[2]!.attributes('title')).toBeUndefined();
    expect(headings[2]!.find('.semi-table-row-head-title').attributes('title')).toBe('Name');
    expect(headings[3]!.attributes('title')).toBeUndefined();
    expect(headings[4]!.attributes('title')).toBeUndefined();
    wrapper.unmount();
  });

  it('resolves function titles once and preserves their final output without query wrappers', () => {
    const stringTitle = vi.fn(() => 'Computed title');
    const customTitle = vi.fn(() => h('strong', 'Custom heading'));
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        columns: [
          { key: 'text', title: stringTitle, sorter: true },
          { key: 'node', title: customTitle },
        ],
        dataSource: [{ key: 'row' }],
      },
    });
    const headings = wrapper.findAll('th');
    expect(headings[0]!.attributes('title')).toBe('Computed title');
    expect(headings[0]!.text()).toBe('Computed title');
    expect(headings[0]!.find('.semi-table-column-sorter').exists()).toBe(false);
    expect(headings[1]!.attributes('title')).toBeUndefined();
    expect(headings[1]!.find('strong').text()).toBe('Custom heading');
    expect(stringTitle).toHaveBeenCalledTimes(1);
    expect(customTitle).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('allows public row/cell attributes to override title, role and ARIA indices', () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        onHeaderRow: () => ({ 'aria-rowindex': 8, role: 'presentation' }),
        columns: [
          {
            key: 'custom',
            title: 'Default',
            onHeaderCell: () => ({ title: 'Custom', 'aria-colindex': 7, role: 'cell' }),
          },
          {
            key: 'removed',
            title: 'Default',
            onHeaderCell: () => ({ title: undefined, 'aria-colindex': undefined }),
          },
        ],
        dataSource: [{ key: 'row' }],
      },
    });
    expect(wrapper.find('thead tr').attributes()).toMatchObject({
      'aria-rowindex': '8',
      role: 'presentation',
    });
    const headings = wrapper.findAll('th');
    expect(headings[0]!.attributes()).toMatchObject({
      title: 'Custom',
      'aria-colindex': '7',
      role: 'cell',
    });
    expect(headings[1]!.attributes('title')).toBeUndefined();
    expect(headings[1]!.attributes('aria-colindex')).toBeUndefined();
    wrapper.unmount();
  });
});

describe('Table header sorting hit areas', () => {
  it('uses fixed query DOM and sorts a whole heading once per click', async () => {
    const onChange = vi.fn();
    const onHeaderClick = vi.fn();
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        onChange,
        columns: [
          {
            dataIndex: 'score',
            title: 'Score',
            sorter: true,
            onHeaderCell: () => ({ onClick: onHeaderClick }),
          },
        ],
        dataSource: [
          { key: 'a', score: 2 },
          { key: 'b', score: 1 },
        ],
      },
    });
    const heading = wrapper.find('th');
    expect(heading.classes()).toContain('semi-table-row-head-clickSort');
    expect(heading.attributes('aria-sort')).toBeUndefined();
    expect(heading.find('.semi-table-operate-wrapper').element.tagName).toBe('DIV');
    const sorter = heading.find('.semi-table-column-sorter-wrapper');
    expect(sorter.element.tagName).toBe('DIV');
    expect(sorter.find('.semi-table-column-sorter').element.tagName).toBe('DIV');
    expect(sorter.attributes('aria-label')).toBe('Current sort order is none');
    await heading.trigger('click');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].sorter.sortOrder).toBe('ascend');
    expect(sorter.attributes('aria-label')).toBe('Current sort order is ascending');
    await sorter.trigger('click');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onHeaderClick).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1]![0].sorter.sortOrder).toBe('descend');
    expect(sorter.attributes('aria-label')).toBe('Current sort order is descending');
    wrapper.unmount();
  });

  it('keeps filtering headings outside the whole-cell sort hit area', async () => {
    const onChange = vi.fn();
    const onHeaderClick = vi.fn();
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        onChange,
        columns: [
          {
            dataIndex: 'name',
            title: 'Name',
            sorter: true,
            filters: [{ text: 'Alpha', value: 'Alpha' }],
            onFilter: () => true,
            onHeaderCell: () => ({ onClick: onHeaderClick }),
          },
        ],
        dataSource: [{ key: 'row', name: 'Alpha' }],
      },
    });
    const heading = wrapper.find('th');
    expect(heading.classes()).not.toContain('semi-table-row-head-clickSort');
    const filter = heading.find('.semi-table-column-filter');
    expect(filter.element.tagName).toBe('DIV');
    expect(filter.text()).toBe('\u200b');
    expect(filter.find('[role="button"]').attributes()).toMatchObject({
      'aria-label': 'Filter data with this column',
      'aria-haspopup': 'listbox',
    });
    await heading.trigger('click');
    expect(onHeaderClick).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    await heading.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onHeaderClick).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});

describe('Table header public style precedence', () => {
  it('preserves custom positioning and alignment unless a column supplies alignment', () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        direction: 'rtl',
        headerStyle: { textAlign: 'center', left: '4px' },
        columns: [
          {
            key: 'custom',
            title: 'Custom',
            onHeaderCell: () => ({ style: { textAlign: 'right', left: '17px' } }),
          },
          {
            key: 'aligned',
            title: 'Aligned',
            align: 'right',
            onHeaderCell: () => ({ style: { textAlign: 'center', left: '23px' } }),
          },
          { key: 'default', title: 'Default' },
        ],
        dataSource: [{ key: 'row' }],
      },
    });
    const headings = wrapper.findAll('th');
    expect(headings[0]!.element.style.textAlign).toBe('right');
    expect(headings[0]!.element.style.left).toBe('17px');
    expect(headings[1]!.element.style.textAlign).toBe('left');
    expect(headings[1]!.element.style.left).toBe('23px');
    expect(headings[1]!.classes()).toContain('semi-table-align-left');
    expect(headings[2]!.element.style.textAlign).toBe('center');
    expect(headings[2]!.element.style.left).toBe('4px');
    wrapper.unmount();
  });
});

describe('Table query heading wrappers', () => {
  it('wraps a non-function VNode title when only onFilter is configured', () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [{ key: 'row' }],
        columns: [{ key: 'query', title: h('strong', 'Filter title'), onFilter: () => true }],
      },
    });
    const heading = wrapper.find('th');
    expect(heading.find('.semi-table-row-head-title > strong').text()).toBe('Filter title');
    expect(heading.find('.semi-table-operate-wrapper').exists()).toBe(false);
    expect(heading.attributes('title')).toBeUndefined();
    wrapper.unmount();
  });
  it('attaches sort-tooltip relationships to the heading, not its inner sorter', async () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [{ key: 'row', score: 1 }],
        columns: [
          { key: 'score', dataIndex: 'score', title: 'Score', sorter: true, showSortTip: true },
        ],
      },
    });
    const heading = wrapper.find('th');
    await nextTick();
    expect(heading.attributes('data-popupid')).toBeTruthy();
    expect(heading.attributes('aria-describedby')).toBe(heading.attributes('data-popupid'));
    expect(heading.attributes('tabindex')).toBe('0');
    expect(
      heading.find('.semi-table-column-sorter-wrapper').attributes('data-popupid'),
    ).toBeUndefined();
    wrapper.unmount();
  });
});

it('keeps confirmation controls inside the filter menu and resets pending choices before applying', async () => {
  const onChange = vi.fn();
  let ready!: () => void;
  const opened = new Promise<void>((resolve) => {
    ready = resolve;
  });
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: {
      pagination: false,
      onChange,
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
          filterDropdownVisible: true,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) ready();
          },
          filterConfirmMode: 'confirm',
          onFilter: (value, row) => row?.name === value,
        },
      ],
    },
  });
  await opened;
  await flushPromises();
  const menu = document.querySelector<HTMLUListElement>('.semi-table-column-filter-dropdown ul');
  const footer = menu?.querySelector<HTMLDivElement>(':scope > div');
  expect(footer).toBeTruthy();
  expect(footer!.className).toBe('');
  expect(footer!.querySelector(':scope > .semi-space')).toBeTruthy();
  expect(footer!.style.gap).toBe('');
  const controls = [...footer!.querySelectorAll('button')];
  expect(controls).toHaveLength(2);
  controls[1]!.click();
  await flushPromises();
  expect(onChange).not.toHaveBeenCalled();
  const choice = menu!.querySelector<HTMLLIElement>('li')!;
  choice.click();
  await flushPromises();
  expect(menu!.querySelector<HTMLInputElement>('input')!.checked).toBe(true);
  expect(wrapper.findAll('tbody tr')).toHaveLength(2);
  controls[0]!.click();
  await flushPromises();
  expect(menu!.querySelector<HTMLInputElement>('input')!.checked).toBe(false);
  choice.click();
  await flushPromises();
  controls[1]!.click();
  await flushPromises();
  expect(wrapper.findAll('tbody tr')).toHaveLength(1);
  expect(wrapper.find('tbody').text()).toBe('Alpha');
  expect(onChange).toHaveBeenCalledTimes(1);
  controls[1]!.click();
  await flushPromises();
  expect(onChange).toHaveBeenCalledTimes(1);
  wrapper.unmount();
});

it('applies custom input drafts and suppresses unchanged confirmations while still closing', async () => {
  const onChange = vi.fn();
  let opened!: () => void;
  const ready = new Promise<void>((resolve) => {
    opened = resolve;
  });
  const wrapper = mount(Table, {
    attachTo: document.body,
    props: {
      pagination: false,
      onChange,
      dataSource: [
        { key: 'a', name: 'Alpha' },
        { key: 'b', name: 'Beta' },
      ],
      columns: [
        {
          key: 'name',
          dataIndex: 'name',
          title: 'Name',
          onFilter: (value, row) => row?.name === value,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) opened();
          },
          renderFilterDropdown: (raw) => {
            const draft = raw?.tempFilteredValue as unknown[];
            const setDraft = raw?.setTempFilteredValue as (values: unknown[]) => void;
            const confirm = raw?.confirm as (options: { closeDropdown: boolean }) => void;
            const clear = raw?.clear as (options: { closeDropdown: boolean }) => void;
            return h('div', [
              h('input', {
                value: String(draft?.[0] ?? ''),
                'aria-label': 'Filter name',
                onInput: (event: Event) => setDraft([(event.target as HTMLInputElement).value]),
              }),
              h('button', { onClick: () => confirm({ closeDropdown: false }) }, 'Apply'),
              h('button', { onClick: () => confirm({ closeDropdown: true }) }, 'Apply and close'),
              h('button', { onClick: () => clear({ closeDropdown: false }) }, 'Clear'),
            ]);
          },
        },
      ],
    },
  });
  await wrapper.find('.semi-table-column-filter').trigger('click');
  await ready;
  await flushPromises();
  const panel = document.querySelector('.semi-table-column-filter-dropdown')!;
  const input = panel.querySelector('input')!;
  input.value = 'Beta';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await flushPromises();
  const buttons = [...panel.querySelectorAll('button')];
  buttons[0]!.click();
  await flushPromises();
  expect(wrapper.findAll('tbody tr')).toHaveLength(1);
  expect(wrapper.find('tbody').text()).toBe('Beta');
  expect(wrapper.find('.semi-table-column-filter').classes()).toContain('on');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(wrapper.find('.semi-table-column-filter').attributes('aria-expanded')).toBe('true');
  expect(panel.classList.contains('semi-dropdown-wrapper-show')).toBe(true);
  expect(panel.classList.contains('semi-dropdown-wrapper-hide')).toBe(false);
  buttons[0]!.click();
  await flushPromises();
  expect(onChange).toHaveBeenCalledTimes(1);
  buttons[2]!.click();
  await flushPromises();
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(wrapper.findAll('tbody tr')).toHaveLength(2);
  expect(wrapper.find('.semi-table-column-filter').attributes('aria-expanded')).toBe('true');
  expect(panel.classList.contains('semi-dropdown-wrapper-show')).toBe(true);
  expect(panel.classList.contains('semi-dropdown-wrapper-hide')).toBe(false);
  buttons[1]!.click();
  await flushPromises();
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(wrapper.find('.semi-table-column-filter').attributes('aria-expanded')).toBe('false');
  wrapper.unmount();
});
