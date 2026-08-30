import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { Collapse, CollapsePanel } from './index';

function renderCollapse(props: Record<string, unknown> = {}) {
  return h(Collapse, props, () => [
    h(CollapsePanel, { header: 'First', itemKey: '1' }, () => h('p', 'First body')),
    h(CollapsePanel, { disabled: true, header: 'Second', itemKey: '2' }, () =>
      h('p', 'Second body'),
    ),
  ]);
}

describe('Collapse SSR', () => {
  it('默认关闭输出固定复合结构且不访问 browser global', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const html = await renderToString(
      renderCollapse({ className: 'ssr-collapse', 'data-kind': 'ssr', style: { color: 'red' } }),
    );
    expect(html).toContain('semi-collapse ssr-collapse');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('color:red');
    expect(html.match(/semi-collapse-item/g)).toHaveLength(2);
    expect(html).toContain('role="button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('<p>First body</p>');
    vi.unstubAllGlobals();
  });

  it('defaultActiveKey、keepDOM 与 compound slot 可稳定服务端渲染', async () => {
    const open = await renderToString(renderCollapse({ defaultActiveKey: '1', motion: false }));
    expect(open).toContain('aria-expanded="true"');
    expect(open).toContain('<p>First body</p>');
    expect(open).toContain('aria-hidden="false"');

    const kept = await renderToString(renderCollapse({ keepDOM: true, lazyRender: false }));
    expect(kept).toContain('<p>First body</p>');
    expect(kept).toContain('aria-hidden="true"');
  });

  it('hydration 无警告并在无 ResizeObserver 环境继续响应受控状态', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      data: () => ({ activeKey: [] as string[] }),
      render(this: { activeKey: string[] }) {
        return h(Collapse, { activeKey: this.activeKey, motion: false }, () =>
          h(CollapsePanel, { header: 'Hydrated', itemKey: '1' }, () => 'Hydrated body'),
        );
      },
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    vi.stubGlobal('ResizeObserver', undefined);
    const app = createSSRApp(Host);
    const vm = app.mount(container) as unknown as { activeKey: string[] };
    vm.activeKey = ['1'];
    await nextTick();
    expect(container.querySelector('.semi-collapse-header')?.getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(container.textContent).toContain('Hydrated body');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
    vi.unstubAllGlobals();
  });
});
