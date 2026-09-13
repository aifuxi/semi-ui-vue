import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

import TabPane from './TabPane.vue';
import Tabs from './Tabs.vue';

describe('Tabs client mount', () => {
  it('客户端挂载保持所选 tab 的 ARIA 且无 warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const wrapper = mount(Tabs, {
      attachTo: document.body,
      props: { defaultActiveKey: 'a' },
      slots: {
        default: () => [
          h(TabPane, { itemKey: 'a', tab: 'A' }, () => 'Panel A'),
          h(TabPane, { itemKey: 'b', tab: 'B' }, () => 'Panel B'),
        ],
      },
    });
    expect(wrapper.get('[role="tab"]').attributes('aria-selected')).toBe('true');
    expect(warn.mock.calls.flat().join(' ')).not.toContain('Hydration');
    wrapper.unmount();
  });
});
