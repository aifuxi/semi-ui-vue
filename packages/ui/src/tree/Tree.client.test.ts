import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { Tree } from './index';

const treeData = [{ key: 'root', label: 'Root', children: [{ key: 'leaf', label: 'Leaf' }] }];

describe('Tree client mount', () => {
  it('客户端挂载无 warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const wrapper = mount(Tree, { props: { defaultExpandAll: true, treeData } });
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2);
    expect(warn.mock.calls.flat().join(' ')).not.toContain('Hydration');
    wrapper.unmount();
  });
});
