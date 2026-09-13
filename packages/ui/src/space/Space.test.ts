import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { createSSRApp, Fragment, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Space from './Space.vue';

describe('Space', () => {
  it('renders the default horizontal contract and forwards native attrs', () => {
    const wrapper = mount(Space, {
      attrs: {
        'aria-label': '操作间距',
        class: 'consumer-space',
        id: 'actions',
      },
      slots: { default: () => [h('button', '确认'), h('button', '取消')] },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-space',
        'semi-space-align-center',
        'semi-space-horizontal',
        'semi-space-tight-horizontal',
        'semi-space-tight-vertical',
        'consumer-space',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '操作间距',
      id: 'actions',
      'x-semi-prop': 'children',
    });
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it('maps preset, number, and mixed array spacing to the upstream class/style contract', () => {
    const medium = mount(Space, { props: { spacing: 'medium' } });
    const numeric = mount(Space, {
      props: { spacing: 20 },
      attrs: { style: { columnGap: '2px', rowGap: '4px' } },
    });
    const mixed = mount(Space, { props: { spacing: ['loose', 12] } });

    expect(medium.classes()).toEqual(
      expect.arrayContaining(['semi-space-medium-horizontal', 'semi-space-medium-vertical']),
    );
    expect((numeric.element as HTMLElement).style.columnGap).toBe('20px');
    expect((numeric.element as HTMLElement).style.rowGap).toBe('20px');
    expect(mixed.classes()).toContain('semi-space-loose-horizontal');
    expect(mixed.classes()).not.toContain('semi-space-loose-vertical');
    expect((mixed.element as HTMLElement).style.rowGap).toBe('12px');
  });

  it('supports all align values and disables wrap for vertical mode', async () => {
    const wrapper = mount(Space, {
      props: { align: 'baseline', spacing: [10, 18], wrap: true },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-space-align-baseline',
        'semi-space-horizontal',
        'semi-space-wrap',
      ]),
    );
    expect((wrapper.element as HTMLElement).style.columnGap).toBe('10px');
    expect((wrapper.element as HTMLElement).style.rowGap).toBe('18px');

    await wrapper.setProps({ align: 'end', vertical: true });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-space-align-end', 'semi-space-vertical']),
    );
    expect(wrapper.classes()).not.toContain('semi-space-wrap');
    expect(wrapper.classes()).not.toContain('semi-space-horizontal');
  });

  it('flattens Vue fragments while null, false, and undefined add no DOM children', () => {
    const wrapper = mount(Space, {
      slots: {
        default: () => [
          h('div', '一'),
          null,
          h('div', '二'),
          false,
          h('div', '三'),
          undefined,
          h(Fragment, [h('div', '四'), h('div', '五')]),
        ],
      },
    });

    expect(wrapper.element.children).toHaveLength(5);
    expect(wrapper.findAll(':scope > div').map((child) => child.text())).toEqual([
      '一',
      '二',
      '三',
      '四',
      '五',
    ]);
  });

  it('is SSR-safe and hydrates the server markup without warnings', async () => {
    const renderSpace = () =>
      h(Space, { align: 'start', spacing: [8, 16], wrap: true }, () => [
        h('span', 'A'),
        h('span', 'B'),
      ]);
    const serverApp = createSSRApp({ render: renderSpace });
    const host = document.createElement('div');
    host.innerHTML = await renderToString(serverApp);

    const warnings: string[] = [];
    const clientApp = createSSRApp({ render: renderSpace });
    clientApp.config.warnHandler = (message) => warnings.push(message);
    clientApp.mount(host);

    expect(warnings).toEqual([]);
    expect(host.querySelector('.semi-space-wrap')?.children).toHaveLength(2);
    clientApp.unmount();
  });
});
