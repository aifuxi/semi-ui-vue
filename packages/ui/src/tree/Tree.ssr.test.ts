import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import Tree from './Tree.vue';

const treeData = [{ key: 'root', label: 'Root', children: [{ key: 'leaf', label: 'Leaf' }] }];

describe('Tree SSR', () => {
  it('默认、展开、多选、搜索与目录模式在无 browser global 时稳定输出', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Tree, {
            defaultExpandAll: true,
            directory: true,
            filterTreeNode: true,
            multiple: true,
            treeData,
          }),
      }),
    );
    expect(html).toContain('semi-tree-wrapper');
    expect(html).toContain('role="tree"');
    expect(html).toContain('role="treeitem"');
    expect(html).toContain('semi-checkbox');
    expect(html).toContain('Filter Tree');
    expect(html).not.toContain('vendor/semi-design');
  });

  it('客户端挂载无 hydration 警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const wrapper = mount(Tree, { props: { defaultExpandAll: true, treeData } });
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2);
    expect(warn.mock.calls.flat().join(' ')).not.toContain('Hydration');
    wrapper.unmount();
  });
});
