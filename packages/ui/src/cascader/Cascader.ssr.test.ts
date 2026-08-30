import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { Cascader } from './index';

describe('Cascader SSR', () => {
  it('imports and renders the selected trigger without browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Cascader, {
            treeData: [
              {
                label: 'Asia',
                value: 'asia',
                children: [{ label: 'China', value: 'china' }],
              },
            ],
            defaultValue: ['asia', 'china'],
            defaultOpen: true,
          }),
      }),
    );
    expect(html).toContain('semi-cascader');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('Asia / China');
    expect(html).not.toContain('semi-cascader-popover');
  });

  it('renders multiple search trigger and aria attributes', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Cascader, {
            treeData: [{ label: 'China', value: 'china' }],
            defaultValue: [['china']],
            multiple: true,
            filterTreeNode: true,
            ariaLabel: 'Region selector',
          }),
      }),
    );
    expect(html).toContain('aria-label="Region selector"');
    expect(html).toContain('semi-tagInput');
    expect(html).toContain('China');
  });
});
