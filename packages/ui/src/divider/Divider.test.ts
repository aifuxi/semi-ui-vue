import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Divider from './Divider.vue';

describe('Divider', () => {
  it('renders the horizontal solid default and forwards native attrs', () => {
    const wrapper = mount(Divider, {
      attrs: {
        'aria-label': '章节分隔',
        class: 'custom-divider',
        id: 'section-divider',
      },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-divider', 'semi-divider-horizontal', 'custom-divider']),
    );
    expect(wrapper.classes()).not.toContain('semi-divider-dashed');
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '章节分隔',
      id: 'section-divider',
    });
  });

  it('maps margin to the active axis and lets caller style override it', () => {
    const horizontal = mount(Divider, {
      props: { margin: 12 },
      attrs: { style: { color: 'red', marginTop: '20px' } },
    });
    const vertical = mount(Divider, {
      props: { layout: 'vertical', margin: '1rem' },
    });

    expect((horizontal.element as HTMLElement).style.marginTop).toBe('20px');
    expect((horizontal.element as HTMLElement).style.marginBottom).toBe('12px');
    expect((horizontal.element as HTMLElement).style.color).toBe('red');
    expect((vertical.element as HTMLElement).style.marginLeft).toBe('1rem');
    expect((vertical.element as HTMLElement).style.marginRight).toBe('1rem');
    expect((vertical.element as HTMLElement).style.marginTop).toBe('');
  });

  it('wraps plain text and preserves alignment classes', () => {
    const wrapper = mount(Divider, {
      props: { align: 'left', dashed: true },
      slots: { default: () => '左侧标题' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-divider-dashed',
        'semi-divider-with-text',
        'semi-divider-with-text-left',
      ]),
    );
    expect(wrapper.get('.semi-divider_inner-text').attributes('x-semi-prop')).toBe('children');
    expect(wrapper.text()).toBe('左侧标题');
  });

  it('renders non-text slot content directly without the text wrapper', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => h('strong', { 'data-testid': 'custom-content' }, '图标内容') },
    });

    expect(wrapper.get('[data-testid="custom-content"]').element.parentElement).toBe(
      wrapper.element,
    );
    expect(wrapper.find('.semi-divider_inner-text').exists()).toBe(false);
  });

  it('does not enter content mode for an empty default slot', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => '' },
    });

    expect(wrapper.classes()).not.toContain('semi-divider-with-text');
    expect(wrapper.element.children).toHaveLength(0);
  });

  it('ignores content for the vertical layout like the pinned adapter', () => {
    const wrapper = mount(Divider, {
      props: { align: 'right', dashed: true, layout: 'vertical' },
      slots: { default: () => '不会渲染' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-divider-vertical', 'semi-divider-dashed']),
    );
    expect(wrapper.classes()).not.toContain('semi-divider-with-text');
    expect(wrapper.text()).toBe('');
  });

  it('is safe to import and render without a DOM', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(Divider, { align: 'right', margin: '8px' }, () => '服务端标题'),
      }),
    );

    expect(html).toContain('semi-divider-with-text-right');
    expect(html).toContain('semi-divider_inner-text');
    expect(html).toContain('服务端标题');
  });
});
