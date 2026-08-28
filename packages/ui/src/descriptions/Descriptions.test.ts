/* eslint-disable vue/one-component-per-file -- test hosts cover template and render VNode inputs. */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';

import { semiGlobal } from '../config-provider';
import Descriptions from './Descriptions.vue';
import DescriptionsItem from './DescriptionsItem.vue';

beforeEach(() => {
  semiGlobal.config = {};
});

describe('Descriptions', () => {
  it('以默认 center/vertical DOM 渲染 data、函数值、VNode key 并过滤 hidden', () => {
    const data = [
      { key: h('strong', '用户名'), value: 'Semi' },
      { key: '角色', value: () => h('em', '设计师') },
      { key: '隐藏', value: '不可见', hidden: true },
    ];
    const wrapper = mount(Descriptions, {
      attrs: { 'aria-label': '不转发', class: 'attr-class', 'data-kind': 'profile' },
      props: { className: 'named', data, style: { width: '480px' } },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-descriptions',
        'semi-descriptions-center',
        'semi-descriptions-vertical',
        'attr-class',
        'named',
      ]),
    );
    expect(wrapper.attributes('data-kind')).toBe('profile');
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect((wrapper.element as HTMLElement).style.width).toBe('480px');
    expect(wrapper.findAll('tbody > tr')).toHaveLength(2);
    expect(wrapper.get('.semi-descriptions-key strong').text()).toBe('用户名');
    expect(wrapper.get('.semi-descriptions-value em').text()).toBe('设计师');
    expect(wrapper.text()).not.toContain('不可见');
  });

  it('支持四种 align、row 三种 size 与 plain 冒号结构', () => {
    for (const align of ['center', 'justify', 'left', 'plain'] as const) {
      const wrapper = mount(Descriptions, { props: { align, data: [{ key: '键', value: '值' }] } });
      expect(wrapper.classes()).toContain(`semi-descriptions-${align}`);
      expect(wrapper.get('.semi-descriptions-key').text()).toBe(align === 'plain' ? '键:' : '键');
      expect(wrapper.findAll('th')).toHaveLength(align === 'plain' ? 0 : 1);
    }

    for (const size of ['small', 'medium', 'large'] as const) {
      const wrapper = mount(Descriptions, {
        props: { data: [{ key: '键', value: '值' }], row: true, size },
      });
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining(['semi-descriptions-double', `semi-descriptions-double-${size}`]),
      );
      expect(wrapper.classes()).not.toContain('semi-descriptions-center');
    }
  });

  it('data 非空优先于 slot，空 data 回退到真正的 DescriptionsItem', () => {
    const withData = mount(Descriptions, {
      props: { data: [{ key: 'Data', value: '优先' }] },
      slots: { default: () => h(DescriptionsItem, { itemKey: 'Slot' }, () => '后备') },
    });
    expect(withData.text()).toContain('优先');
    expect(withData.text()).not.toContain('后备');

    const slotOnly = mount(Descriptions, {
      slots: {
        default: () => [
          h(DescriptionsItem, { itemKey: h('b', '节点键') }, () => '节点值'),
          h('div', { 'data-unexpected': '' }, '意外节点'),
        ],
      },
    });
    expect(slotOnly.get('.semi-descriptions-key b').text()).toBe('节点键');
    expect(slotOnly.text()).toContain('节点值');
    expect(slotOnly.text()).toContain('意外节点');
  });

  it('模板 Item 保留 item-key、key slot、data attrs、style 与 hidden Boolean 形态', () => {
    const host = mount(
      defineComponent({
        components: { Descriptions, DescriptionsItem },
        template: `
          <Descriptions>
            <DescriptionsItem item-key="模板键" class-name="named-row" data-kind="template" :style="{ color: 'red' }">模板值</DescriptionsItem>
            <DescriptionsItem hidden item-key="裸 hidden">不可见</DescriptionsItem>
            <DescriptionsItem :hidden="false">
              <template #key><strong>slot 键</strong></template>
              可见
            </DescriptionsItem>
          </Descriptions>
        `,
      }),
    );
    expect(host.findAll('tbody > tr')).toHaveLength(2);
    expect(host.get('tr.named-row').attributes('data-kind')).toBe('template');
    expect((host.get('tr.named-row').element as HTMLElement).style.color).toBe('red');
    expect(host.get('.semi-descriptions-key strong').text()).toBe('slot 键');
    expect(host.text()).not.toContain('不可见');
  });

  it('horizontal 按 span 分行、过滤 hidden、补齐末项且不修改输入', () => {
    const data = [
      { key: 'A', value: '1', span: 2 },
      { key: '隐藏', value: 'x', hidden: true, span: 3 },
      { key: 'B', value: '2' },
    ];
    const wrapper = mount(Descriptions, { props: { column: 4, data, layout: 'horizontal' } });

    expect(wrapper.classes()).toContain('semi-descriptions-horizontal');
    expect(wrapper.findAll('tbody > tr')).toHaveLength(1);
    expect(wrapper.findAll('th')).toHaveLength(2);
    expect(wrapper.findAll('td').map((cell) => cell.attributes('colspan'))).toEqual(['3', '3']);
    expect(wrapper.text()).not.toContain('隐藏');
    expect(data[2]).not.toHaveProperty('span');
  });

  it('horizontal 同时解析模板与 render-function Item，忽略非 Item 子节点', () => {
    const TemplateHost = defineComponent({
      components: { Descriptions, DescriptionsItem },
      template: `
        <Descriptions layout="horizontal" :column="2">
          <DescriptionsItem item-key="模板" :span="1">A</DescriptionsItem>
          <DescriptionsItem :hidden="false" item-key="可见">B</DescriptionsItem>
          <span>忽略</span>
        </Descriptions>
      `,
    });
    const template = mount(TemplateHost);
    expect(template.findAll('tbody > tr')).toHaveLength(1);
    expect(template.findAll('th')).toHaveLength(2);
    expect(template.text()).not.toContain('忽略');

    const render = mount(Descriptions, {
      props: { column: 2, layout: 'horizontal' },
      slots: {
        default: () => [
          h(DescriptionsItem, { itemKey: 'Render', span: 1 }, () => 'A'),
          h(DescriptionsItem, { hidden: true, itemKey: 'Hidden' }, () => 'B'),
          h(DescriptionsItem, { itemKey: 'Render 2' }, () => 'C'),
        ],
      },
    });
    expect(render.findAll('tbody > tr')).toHaveLength(1);
    expect(render.text()).toBe('RenderARender 2C');
  });

  it('全局默认只作用于缺省 prop，显式值优先', () => {
    semiGlobal.config.overrideDefaultProps = {
      Descriptions: { align: 'justify', column: 2, layout: 'horizontal', row: true, size: 'large' },
    };
    const inherited = mount(Descriptions, { props: { data: [{ key: 'A', value: '1' }] } });
    expect(inherited.classes()).toEqual(
      expect.arrayContaining([
        'semi-descriptions-double',
        'semi-descriptions-double-large',
        'semi-descriptions-horizontal',
      ]),
    );

    const explicit = mount(Descriptions, {
      props: {
        align: 'left',
        data: [{ key: 'A', value: '1' }],
        layout: 'vertical',
        row: false,
        size: 'small',
      },
    });
    expect(explicit.classes()).toEqual(
      expect.arrayContaining(['semi-descriptions-left', 'semi-descriptions-vertical']),
    );
    expect(explicit.classes()).not.toContain('semi-descriptions-double');
  });
});
