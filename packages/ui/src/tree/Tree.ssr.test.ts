import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

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
});
