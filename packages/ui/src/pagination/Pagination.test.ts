import { mount } from '@vue/test-utils';
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { Select } from '../select';

import Pagination from './Pagination.vue';

const wrappers: Array<ReturnType<typeof mount>> = [];

function mountPagination(
  props: Record<string, unknown> = {},
  options: Record<string, unknown> = {},
) {
  const wrapper = mount(Pagination, { props, ...options });
  wrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Pagination', () => {
  it('渲染固定根 DOM、class/style/data、页数和前后禁用态', () => {
    const wrapper = mountPagination({
      total: 30,
      className: 'custom-page',
      style: { color: 'red' },
      'data-owner': 'docs',
    });
    expect(wrapper.element.tagName).toBe('UL');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-page', 'custom-page']));
    expect(wrapper.attributes('data-owner')).toBe('docs');
    expect((wrapper.element as HTMLElement).style.color).toBe('red');
    expect(wrapper.findAll('.semi-page-item')).toHaveLength(5);
    expect(wrapper.get('[aria-label="Previous"]').attributes('aria-disabled')).toBe('true');
    expect(wrapper.get('[aria-label="Next"]').attributes('aria-disabled')).toBe('false');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('1');
  });

  it('严格复现 7 项页码截断的四个分支与省略范围', async () => {
    const wrapper = mountPagination({ total: 200, currentPage: 1 });
    const labels = () =>
      wrapper
        .findAll('.semi-page > .semi-page-item')
        .filter((item) => !item.classes('semi-page-prev') && !item.classes('semi-page-next'))
        .map((item) => item.text());
    expect(labels()).toEqual(['1', '2', '3', '4', '...', '19', '20']);

    await wrapper.setProps({ currentPage: 4 });
    expect(labels()).toEqual(['1', '2', '3', '4', '5', '...', '20']);
    await wrapper.setProps({ currentPage: 10 });
    expect(labels()).toEqual(['1', '...', '9', '10', '11', '...', '20']);
    await wrapper.setProps({ currentPage: 18 });
    expect(labels()).toEqual(['1', '...', '16', '17', '18', '19', '20']);
  });

  it('非受控点击先更新 DOM，再按固定顺序派发页码与 change 事件', async () => {
    const order: string[] = [];
    const wrapper = mountPagination({
      total: 80,
      onPageChange: (page: number) => order.push(`page:${page}`),
      'onUpdate:currentPage': (page: number) => order.push(`current:${page}`),
      'onUpdate:modelValue': (page: number) => order.push(`model:${page}`),
      onChange: (page: number, size: number) => order.push(`change:${page}:${size}`),
    });
    await wrapper.get('[aria-label="Page 3"]').trigger('click');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('3');
    expect(order).toEqual(['page:3', 'current:3', 'model:3', 'change:3:10']);

    await wrapper.get('[aria-label="Next"]').trigger('click');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('4');
    await wrapper.get('[aria-label="Previous"]').trigger('click');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('3');
  });

  it('currentPage 与 modelValue 受控时等待父级回写，v-model 可自然闭环', async () => {
    const controlled = mountPagination({ total: 80, currentPage: 2 });
    await controlled.get('[aria-label="Page 4"]').trigger('click');
    expect(controlled.get('[aria-current="page"]').text()).toBe('2');
    expect(controlled.emitted('update:currentPage')).toEqual([[4]]);
    await controlled.setProps({ currentPage: 4 });
    expect(controlled.get('[aria-current="page"]').text()).toBe('4');

    const page = shallowRef(2);
    const Host = defineComponent({
      setup: () => () =>
        h(Pagination, {
          total: 80,
          modelValue: page.value,
          'onUpdate:modelValue': (value: number) => {
            page.value = value;
          },
        }),
    });
    const host = mount(Host);
    wrappers.push(host);
    await host.get('[aria-label="Page 4"]').trigger('click');
    await nextTick();
    expect(page.value).toBe(4);
    expect(host.get('[aria-current="page"]').text()).toBe('4');
  });

  it('容量选择补入当前值并保留页码重算及 prevent 事件语义', async () => {
    const order: string[] = [];
    const wrapper = mountPagination({
      total: 200,
      defaultCurrentPage: 5,
      pageSize: 30,
      pageSizeOpts: [10, 20, 40],
      showSizeChanger: true,
      onPageSizeChange: (size: number) => order.push(`size:${size}`),
      onPageChange: (page: number) => order.push(`page:${page}`),
      onChange: (page: number, size: number) => order.push(`change:${page}:${size}`),
    });
    const select = wrapper.getComponent(Select);
    const optionFragment = select.vm.$slots.default?.()[0];
    const optionNodes = Array.isArray(optionFragment?.children) ? optionFragment.children : [];
    expect(
      optionNodes.map((option) => (option as { props?: { value?: number } }).props?.value),
    ).toEqual([10, 20, 30, 40]);
    select.vm.$emit('change', 40);
    await nextTick();
    expect(wrapper.get('[aria-current="page"]').text()).toBe('4');
    expect(order).toEqual(['size:40', 'page:4', 'change:4:40']);

    const prevented = mountPagination({
      total: 200,
      defaultCurrentPage: 5,
      pageSize: 20,
      preventPageChangeOnPageSizeChange: true,
      showSizeChanger: true,
    });
    prevented.getComponent(Select).vm.$emit('change', 40);
    await nextTick();
    expect(prevented.get('[aria-current="page"]').text()).toBe('5');
    expect(prevented.emitted('pageChange')).toBeUndefined();
    expect(prevented.emitted('change')).toEqual([[5, 40]]);
  });

  it('快速跳页在 blur/Enter 提交、钳制范围并清空输入', async () => {
    const wrapper = mountPagination({ total: 200, showQuickJumper: true });
    const input = wrapper.get('.semi-page-quickjump input');
    await input.setValue('5');
    await input.trigger('blur');
    expect(wrapper.get('[aria-current="page"]').text()).toBe('5');
    expect((input.element as HTMLInputElement).value).toBe('');

    await input.setValue('999');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.get('[aria-current="page"]').text()).toBe('20');
    await input.setValue('0');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.get('[aria-current="page"]').text()).toBe('1');
  });

  it('small、单页隐藏、disabled、prev/next slot 与 locale/RTL 保持公开契约', () => {
    const small = mountPagination(
      { total: 90, size: 'small', disabled: true, showQuickJumper: true },
      { slots: { prev: () => '上页', next: () => '下页' } },
    );
    expect(small.element.tagName).toBe('DIV');
    expect(small.classes()).toEqual(
      expect.arrayContaining(['semi-page-small', 'semi-page-disabled']),
    );
    expect(small.text()).toContain('上页');
    expect(small.text()).toContain('1/9');
    expect(small.text()).toContain('下页');
    expect(small.get('.semi-page-quickjump').classes()).toContain('semi-page-quickjump-disabled');
    expect(mountPagination({ total: 1, hideOnSinglePage: true }).find('.semi-page').exists()).toBe(
      false,
    );
    expect(
      mountPagination({ total: 1, hideOnSinglePage: true, showSizeChanger: true })
        .find('.semi-page')
        .exists(),
    ).toBe(true);

    const localized = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        locale: {
          code: 'custom',
          Pagination: {
            pageSize: '${pageSize} rows',
            total: '${total} pages',
            jumpTo: 'Go',
            page: 'P',
          },
        },
      },
      slots: {
        default: () => h(Pagination, { total: 30, showQuickJumper: true, showTotal: true }),
      },
    });
    wrappers.push(localized);
    expect(localized.get('.semi-rtl .semi-page-total').text()).toBe('3 pages');
    expect(localized.get('.semi-page-quickjump').text()).toContain('Go');
  });

  it('省略页与 small hover 首次挂载到稳定自定义 Portal 并窗口化列表', async () => {
    vi.useFakeTimers();
    const popupContainer = document.createElement('div');
    document.body.append(popupContainer);
    const wrapper = mount(ConfigProvider, {
      attachTo: document.body,
      props: { getPopupContainer: () => popupContainer },
      slots: { default: () => h(Pagination, { total: 2000 }) },
    });
    wrappers.push(wrapper);
    await nextTick();
    await wrapper.get('[aria-label="More"]').trigger('mouseenter');
    await vi.advanceTimersByTimeAsync(500);
    await vi.runAllTimersAsync();
    await nextTick();
    await nextTick();
    const list = popupContainer.querySelector<HTMLElement>('.semi-page-rest-list');
    expect(list).not.toBeNull();
    expect(list?.style.width).toBe('78px');
    expect(list?.style.height).toBe('160px');
    expect(list?.querySelectorAll('.semi-page-rest-item').length).toBeLessThanOrEqual(7);
  });

  it('可无警告 hydration，并保持受控页码静态结构', async () => {
    const Root = { render: () => h(Pagination, { currentPage: 3, total: 80, showTotal: true }) };
    const host = document.createElement('div');
    host.innerHTML = await renderToString(createSSRApp(Root));
    document.body.append(host);
    const warnings: string[] = [];
    const app = createSSRApp(Root);
    app.config.warnHandler = (message) => warnings.push(message);
    app.mount(host);
    await nextTick();
    expect(warnings).toEqual([]);
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe('3');
    app.unmount();
  });
});
