import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick, shallowRef } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from '@rstest/core';
import { ConfigProvider } from '../config-provider';
import { Pagination } from '../pagination';
import { Table } from '../table';
import { LocaleProvider } from './index';
import enGB from './source/en_GB';
import jaJP from './source/ja_JP';

const pagination = () => h(Pagination, { total: 100, showTotal: true, showSizeChanger: true });

describe('Locale 文档消费者', () => {
  it('Pagination 响应 LocaleProvider 切换并隔离嵌套 Provider', async () => {
    const language = shallowRef(enGB);
    const wrapper = mount(() =>
      h(LocaleProvider, { locale: language.value }, () => [
        pagination(),
        h(LocaleProvider, { locale: jaJP }, pagination),
      ]),
    );
    const totals = () => wrapper.findAll('.semi-page-total').map((node) => node.text());
    expect(totals()).toEqual(['Total pages: 10', '合計ページ数：10']);
    language.value = jaJP;
    await nextTick();
    expect(totals()).toEqual(['合計ページ数：10', '合計ページ数：10']);
    wrapper.unmount();
  });

  it('SSR 保留 ConfigProvider 优先级与缺 code 整体回退', async () => {
    const html = await renderToString(
      createSSRApp(() =>
        h('div', [
          h(LocaleProvider, { locale: jaJP }, () =>
            h(ConfigProvider, { locale: enGB }, pagination),
          ),
          h(
            LocaleProvider,
            { locale: { Pagination: { pageSize: '', jumpTo: '', page: '', total: 'wrong' } } },
            pagination,
          ),
        ]),
      ),
    );
    expect(html).toContain('Total pages: 10');
    expect(html).toContain('总页数：10');
    expect(html).not.toContain('wrong');
  });

  it('空 Table 保留分页容器与自定义说明，数据恢复后显示分页', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [],
        pagination: { position: 'both' },
      },
    });
    expect(wrapper.findAll('.semi-table-pagination-outer')).toHaveLength(2);
    expect(wrapper.findAll('.semi-table-pagination-info').map((node) => node.text())).toEqual([
      '',
      '',
    ]);
    expect(wrapper.findAll('.semi-page')).toHaveLength(0);
    await wrapper.setProps({
      pagination: {
        position: 'both',
        formatPageText: (info?: { total?: number }) => `total=${info?.total}`,
      },
    });
    expect(wrapper.findAll('.semi-table-pagination-info').map((node) => node.text())).toEqual([
      'total=0',
      'total=0',
    ]);
    await wrapper.setProps({ dataSource: [{ key: 'a', name: 'Alice' }] });
    expect(wrapper.findAll('.semi-page')).toHaveLength(2);
    wrapper.unmount();
  });

  it('Table 固定头与数据表保留 grid/treegrid 语义', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alice' }],
        scroll: { y: 320 },
      },
    });
    expect(wrapper.get('.semi-table-header table').attributes('role')).toBeUndefined();
    expect(wrapper.get('.semi-table-body table').attributes('role')).toBe('grid');
    await wrapper.setProps({
      dataSource: [{ key: 'a', name: 'Alice', children: [{ key: 'b', name: 'Bob' }] }],
    });
    expect(wrapper.get('.semi-table-body table').attributes('role')).toBe('treegrid');
    await wrapper.setProps({
      dataSource: [{ key: 'a', name: 'Alice', children: [] }],
    });

    expect(wrapper.get('.semi-table-body table').attributes('role')).toBe('grid');
    await wrapper.setProps({ groupBy: 'name' });
    expect(wrapper.get('.semi-table-body table').attributes('role')).toBe('treegrid');
    wrapper.unmount();
    const expanded = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name' }],
        dataSource: [{ key: 'a', name: 'Alice' }],
        expandedRowRender: () => 'Details',
      },
    });
    expect(expanded.get('.semi-table-body table').attributes('role')).toBe('treegrid');
    expanded.unmount();
  });
});
