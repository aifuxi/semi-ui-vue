import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { TreeSelect } from './index';

describe('TreeSelect SSR', () => {
  it('imports and renders the trigger without touching browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(TreeSelect, {
            treeData: [{ key: 'asia', value: 'asia', label: 'Asia' }],
            defaultValue: 'asia',
            defaultOpen: true,
          }),
      }),
    );
    expect(html).toContain('semi-tree-select');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('Asia');
    expect(html).not.toContain('semi-tree-select-popover');
  });

  it('renders multiple trigger search mode and aria attributes', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(TreeSelect, {
            treeData: [{ key: 'china', value: 'china', label: 'China' }],
            defaultValue: ['china'],
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            ariaLabel: 'Region selector',
          }),
      }),
    );
    expect(html).toContain('aria-label="Region selector"');
    expect(html).toContain('semi-tagInput');
    expect(html).toContain('China');
  });
});
