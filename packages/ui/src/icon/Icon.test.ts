import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import StableIcon from '@aifuxi/semi-icons-vue';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import Icon, { Icon as NamedIcon } from './index';

describe('Icon UI entry', () => {
  it('forwards the stable Icon base as both default and named exports', async () => {
    expect(Icon).toBe(StableIcon);
    expect(NamedIcon).toBe(StableIcon);

    const wrapper = mount(Icon, {
      props: { size: 'small', type: 'custom-shape' },
      attrs: { 'aria-label': '自定义图标' },
      slots: { default: () => h('svg', { viewBox: '0 0 4 4' }, [h('path', { d: 'M0 0h4v4H0z' })]) },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-icon', 'semi-icon-small', 'semi-icon-custom-shape']),
    );
    expect(wrapper.attributes('aria-label')).toBe('自定义图标');
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 4 4');

    const html = await renderToString(h(NamedIcon, { type: 'server-shape' }, () => h('svg')));
    expect(html).toContain('semi-icon-server-shape');
  });
});
