import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Col, GRID_RESPONSIVE_MAP, Row } from './index';

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: originalMatchMedia,
  });
  vi.restoreAllMocks();
});

describe('Grid', () => {
  it('公开 Row 与 Col，并渲染基础 24 栅格 class、slot 和原生属性', () => {
    const wrapper = mount(Row, {
      attrs: {
        'aria-label': '内容栅格',
        class: 'custom-row',
        'data-grid': 'basic',
        role: 'presentation',
      },
      slots: {
        default: () => [
          h(Col, { class: 'custom-col', span: 8 }, () => 'A'),
          h(Col, { offset: 2, span: 16 }, () => 'B'),
        ],
      },
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-row', 'custom-row']));
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '内容栅格',
      'data-grid': 'basic',
      role: 'presentation',
      'x-semi-prop': 'children',
    });
    const columns = wrapper.findAll('.semi-col');
    expect(columns).toHaveLength(2);
    expect(columns[0]?.classes()).toEqual(
      expect.arrayContaining(['semi-col', 'semi-col-8', 'custom-col']),
    );
    expect(columns[0]?.text()).toBe('A');
    expect(columns[1]?.classes()).toEqual(
      expect.arrayContaining(['semi-col-16', 'semi-col-offset-2']),
    );
  });

  it('应用 flex 对齐 class，并允许 prefixCls 覆盖', () => {
    const wrapper = mount(Row, {
      props: {
        align: 'middle',
        justify: 'space-between',
        prefixCls: 'demo',
        type: 'flex',
      },
      slots: {
        default: () => h(Col, { prefixCls: 'demo', span: 6 }, () => 'Column'),
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'demo-row-flex',
        'demo-row-flex-space-between',
        'demo-row-flex-middle',
      ]),
    );
    expect(wrapper.get('.demo-col').classes()).toContain('demo-col-6');
  });

  it('按固定 Row/Col 规则计算水平与垂直 gutter，调用方 style 最终覆盖', () => {
    const wrapper = mount(Row, {
      attrs: { style: { marginLeft: '-3px' } },
      props: { gutter: [16, 24] },
      slots: {
        default: () => h(Col, { span: 6, style: { paddingTop: '5px' } }, () => 'Gutter column'),
      },
    });

    const rowElement = wrapper.element as HTMLElement;
    expect(rowElement.style.marginLeft).toBe('-3px');
    expect(rowElement.style.marginRight).toBe('-8px');
    expect(rowElement.style.marginTop).toBe('-12px');
    expect(rowElement.style.marginBottom).toBe('-12px');

    const col = wrapper.get('.semi-col');
    const colElement = col.element as HTMLElement;
    expect(colElement.style.paddingLeft).toBe('8px');
    expect(colElement.style.paddingRight).toBe('8px');
    expect(colElement.style.paddingTop).toBe('5px');
    expect(colElement.style.paddingBottom).toBe('12px');
  });

  it('生成六断点完整响应式 class，并保留响应式零值语义', () => {
    const wrapper = mount(Row, {
      slots: {
        default: () =>
          h(
            Col,
            {
              lg: { offset: 2, span: 6 },
              md: { order: 0, pull: 1, push: 0, span: 8 },
              sm: 12,
              span: 24,
              xs: 0,
              xxl: { span: 4 },
            },
            () => 'Responsive',
          ),
      },
    });

    expect(wrapper.get('.semi-col').classes()).toEqual(
      expect.arrayContaining([
        'semi-col-24',
        'semi-col-xs-0',
        'semi-col-sm-12',
        'semi-col-md-8',
        'semi-col-md-order-0',
        'semi-col-md-push-0',
        'semi-col-md-pull-1',
        'semi-col-lg-6',
        'semi-col-lg-offset-2',
        'semi-col-xxl-4',
      ]),
    );
  });

  it('响应视口变化时按 xxl 到 xs 的优先级更新响应式 gutter', async () => {
    const listeners = new Map<string, (event: MediaQueryListEvent) => void>();
    const removeEventListener = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === GRID_RESPONSIVE_MAP.md || query === GRID_RESPONSIVE_MAP.sm,
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          listeners.set(query, listener);
        },
        removeEventListener,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const wrapper = mount(Row, {
      props: { gutter: { xs: 8, sm: 16, md: 24, xxl: 48 } },
      slots: { default: () => h(Col, { span: 6 }, () => 'Responsive gutter') },
    });
    await nextTick();

    expect(wrapper.attributes('style')).toContain('margin-left: -12px');
    expect(wrapper.get('.semi-col').attributes('style')).toContain('padding-left: 12px');

    listeners.get(GRID_RESPONSIVE_MAP.md)?.({ matches: false } as MediaQueryListEvent);
    await nextTick();
    expect(wrapper.attributes('style')).toContain('margin-left: -8px');

    wrapper.unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(6);
  });

  it('缺少 Row 上下文时拒绝挂载 Col', () => {
    expect(() => mount(Col)).toThrowError('please make sure <Col> inside <Row>');
  });

  it('缺少 matchMedia 时保持可挂载', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    const wrapper = mount(Row, {
      props: { gutter: { xs: 8, xxl: 48 } },
      slots: { default: () => h(Col, { span: 6 }, () => 'Column') },
    });
    expect(wrapper.attributes('style')).toContain('margin-left: -24px');
  });

  it('SSR 使用固定初始断点选择，并可无警告 hydration', async () => {
    const Root = {
      render: () =>
        h(
          Row,
          { 'aria-label': 'SSR grid', gutter: { xs: 8, xxl: 48 } },
          {
            default: () => [h(Col, { span: 12 }, () => 'A'), h(Col, { span: 12 }, () => 'B')],
          },
        ),
    };
    const html = await renderToString(createSSRApp(Root));

    expect(html).toContain('class="semi-row"');
    expect(html).toContain('margin-left:-24px');
    expect(html).toContain('class="semi-col semi-col-12"');
    expect(html).toContain('padding-left:24px');

    const container = document.createElement('div');
    container.innerHTML = html;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createSSRApp(Root);
    app.mount(container);
    await nextTick();
    expect(consoleError).not.toHaveBeenCalled();
    app.unmount();
  });
});
