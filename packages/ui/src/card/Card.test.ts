/* eslint-disable vue/one-component-per-file -- template hosts verify Vue-native slot and Boolean syntax. */

import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button';
import { Card, CardGroup, CardMeta } from './index';

describe('Card', () => {
  it('区分 bordered/headerLine 缺省、显式 false 与显式 true', () => {
    const wrapper = mount(
      defineComponent({
        components: { Card },
        template: `
          <div>
            <Card title="default">body</Card>
            <Card title="false" :bordered="false" :header-line="false">body</Card>
            <Card title="true" :bordered="true" :header-line="true">body</Card>
          </div>
        `,
      }),
    );
    const cards = wrapper.findAll('.semi-card');
    expect(cards[0]!.classes()).toContain('semi-card-bordered');
    expect(cards[0]!.get('.semi-card-header').classes()).toContain('semi-card-header-bordered');
    expect(cards[1]!.classes()).not.toContain('semi-card-bordered');
    expect(cards[1]!.get('.semi-card-header').classes()).not.toContain('semi-card-header-bordered');
    expect(cards[2]!.classes()).toContain('semi-card-bordered');
    expect(cards[2]!.get('.semi-card-header').classes()).toContain('semi-card-header-bordered');
  });

  it('区分 footerLine/loading 缺省、显式 false 与显式 true', () => {
    const wrapper = mount(
      defineComponent({
        components: { Card },
        template: `
          <div>
            <Card><template #footer>default</template>body</Card>
            <Card :footer-line="false" :loading="false"><template #footer>false</template>body</Card>
            <Card footer-line loading><template #footer>true</template>body</Card>
          </div>
        `,
      }),
    );
    const cards = wrapper.findAll('.semi-card');
    expect(cards[0]!.get('.semi-card-footer').classes()).not.toContain('semi-card-footer-bordered');
    expect(cards[0]!.find('.semi-skeleton').exists()).toBe(false);
    expect(cards[1]!.get('.semi-card-footer').classes()).not.toContain('semi-card-footer-bordered');
    expect(cards[1]!.find('.semi-skeleton').exists()).toBe(false);
    expect(cards[2]!.get('.semi-card-footer').classes()).toContain('semi-card-footer-bordered');
    expect(cards[2]!.get('.semi-skeleton-active').findAll('li')).toHaveLength(3);
    expect(cards[2]!.attributes('aria-busy')).toBe('true');
  });

  it('按 header 优先级渲染字符串标题、extra 与自定义 header', () => {
    const wrapper = mount(
      defineComponent({
        components: { Card },
        template: `
          <div>
            <Card title="Semi Design"><template #headerExtraContent><a>更多</a></template></Card>
            <Card title="ignored"><template #header><strong>自定义头部</strong></template></Card>
          </div>
        `,
      }),
    );
    const cards = wrapper.findAll('.semi-card');
    expect(cards[0]!.get('.semi-typography-h6').attributes('x-semi-prop')).toBe('title');
    expect(cards[0]!.get('.semi-card-header-wrapper-extra').text()).toBe('更多');
    expect(cards[0]!.get('.semi-card-header-wrapper-title').classes()).toContain(
      'semi-card-header-wrapper-spacing',
    );
    expect(cards[1]!.get('.semi-card-header').text()).toBe('自定义头部');
    expect(cards[1]!.find('.semi-card-header-wrapper').exists()).toBe(false);
  });

  it('渲染 cover、body/footer style、阴影与根 attrs/listener', async () => {
    const click = vi.fn();
    const wrapper = mount(Card, {
      props: {
        bodyStyle: { padding: '8px' },
        className: 'compat-card',
        footer: h('span', '页脚'),
        footerStyle: { textAlign: 'right' },
        shadows: 'always',
        style: { width: '320px' },
        cover: h('img', { alt: 'cover', src: 'cover.png' }),
        onClick: click,
      },
      attrs: { 'aria-label': '项目卡片', 'data-probe': 'card', class: 'vue-card' },
      slots: { default: '正文' },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-card',
        'semi-card-shadows',
        'semi-card-shadows-always',
        'compat-card',
        'vue-card',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({ 'aria-label': '项目卡片', 'data-probe': 'card' });
    expect(wrapper.get('.semi-card-cover img').attributes('alt')).toBe('cover');
    expect(wrapper.get('.semi-card-body').attributes('style')).toContain('padding: 8px');
    expect(wrapper.get('.semi-card-footer').attributes('style')).toContain('text-align: right');
    await wrapper.trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('loading 仅替换存在的默认内容，actions 继续保留', () => {
    const withContent = mount(Card, {
      props: { loading: true, actions: [h(Button, null, () => '操作')] },
      slots: { default: '隐藏正文' },
    });
    expect(withContent.get('.semi-skeleton-active')).toBeTruthy();
    expect(withContent.text()).not.toContain('隐藏正文');
    expect(withContent.get('.semi-card-body-actions-item').text()).toBe('操作');

    const withoutContent = mount(Card, { props: { loading: true } });
    expect(withoutContent.find('.semi-skeleton').exists()).toBe(false);
    expect(withoutContent.attributes('aria-busy')).toBe('true');
  });

  it('actions prop、命名 slot 与空数组均保留固定包装', () => {
    const propActions = mount(Card, { props: { actions: ['A', h('b', 'B')] } });
    expect(propActions.findAll('.semi-card-body-actions-item')).toHaveLength(2);
    expect(propActions.get('.semi-space').attributes('style')).toContain('column-gap: 12px');
    expect(propActions.findAll('.semi-card-body-actions-item')[1]!.attributes('x-semi-prop')).toBe(
      'actions.1',
    );

    const slotActions = mount(
      defineComponent({
        components: { Card },
        template: `<Card><template #actions><button>A</button><button>B</button></template></Card>`,
      }),
    );
    expect(slotActions.findAll('.semi-card-body-actions-item')).toHaveLength(2);

    const emptyActions = mount(Card, { props: { actions: [] } });
    expect(emptyActions.find('.semi-card-body-actions').exists()).toBe(true);
    expect(emptyActions.findAll('.semi-card-body-actions-item')).toHaveLength(0);
  });
});

describe('CardMeta / CardGroup', () => {
  it('CardMeta 支持 props、slots、attrs 与空 wrapper 边界', () => {
    const propsMeta = mount(CardMeta, {
      props: { avatar: h('i', 'A'), title: '标题', description: '描述', className: 'compat' },
      attrs: { 'data-probe': 'meta', class: 'vue-meta' },
    });
    expect(propsMeta.classes()).toEqual(
      expect.arrayContaining(['semi-card-meta', 'compat', 'vue-meta']),
    );
    expect(propsMeta.get('.semi-card-meta-avatar').text()).toBe('A');
    expect(propsMeta.get('.semi-card-meta-wrapper-title').text()).toBe('标题');
    expect(propsMeta.get('.semi-card-meta-wrapper-description').text()).toBe('描述');

    const empty = mount(CardMeta);
    expect(empty.find('.semi-card-meta-avatar').exists()).toBe(false);
    expect(empty.find('.semi-card-meta-wrapper').exists()).toBe(false);
  });

  it('Card.Meta 复合入口与 CardGroup 默认/数组间距、grid 覆盖一致', () => {
    expect(Card.Meta).toBe(CardMeta);
    const normal = mount(CardGroup, { slots: { default: '<div>card</div>' } });
    expect(normal.classes()).toContain('semi-card-group');
    expect(normal.attributes('style')).toContain('column-gap: 16px');
    expect(normal.classes()).toContain('semi-space-wrap');

    const tuple = mount(CardGroup, { props: { spacing: [8, 20] } });
    expect(tuple.attributes('style')).toContain('column-gap: 8px');
    expect(tuple.attributes('style')).toContain('row-gap: 20px');

    const grid = mount(CardGroup, { props: { spacing: 24, type: 'grid' } });
    expect(grid.classes()).toContain('semi-card-group-grid');
    expect(grid.attributes('style')).toContain('column-gap: 0px');
    expect(grid.attributes('style')).toContain('row-gap: 0px');
  });
});
