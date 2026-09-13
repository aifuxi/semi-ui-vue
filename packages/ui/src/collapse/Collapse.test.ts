/* eslint-disable vue/one-component-per-file -- template and render hosts verify Boolean and compound inputs. */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import { Collapse, CollapsePanel } from './index';

const panels = () => ({
  default: () => [
    h(CollapsePanel, { header: 'Panel 1', itemKey: '1' }, () => h('p', 'Content 1')),
    h(CollapsePanel, { header: 'Panel 2', itemKey: '2' }, () => h('p', 'Content 2')),
    h(CollapsePanel, { header: 'Panel 3', itemKey: '3' }, () => h('p', 'Content 3')),
  ],
});

beforeEach(() => {
  semiGlobal.config = {};
});

afterEach(() => {
  semiGlobal.config = {};
  vi.restoreAllMocks();
});

describe('Collapse', () => {
  it('渲染固定根/Panel DOM、默认状态并按 Adapter 边界转发属性', () => {
    const wrapper = mount(Collapse, {
      attrs: {
        'aria-label': '不应落到根节点',
        class: 'attr-class',
        'data-kind': 'basic',
        style: { backgroundColor: 'red' },
      },
      props: { className: 'named' },
      slots: panels(),
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-collapse', 'attr-class', 'named']),
    );
    expect(wrapper.attributes('data-kind')).toBe('basic');
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red');
    expect(wrapper.findAll('.semi-collapse-item')).toHaveLength(3);
    expect(wrapper.findAll('.semi-collapse-header')).toHaveLength(3);
    expect(wrapper.findAll('.semi-collapse-header-icon')).toHaveLength(3);
    expect(wrapper.findAll('[aria-expanded="true"]')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('Content 1');
  });

  it('defaultActiveKey 支持单项/多项，accordion 初始化只取第一项', () => {
    const single = mount(Collapse, { props: { defaultActiveKey: '1' }, slots: panels() });
    expect(
      single.findAll('.semi-collapse-header').map((node) => node.attributes('aria-expanded')),
    ).toEqual(['true', 'false', 'false']);

    const multiple = mount(Collapse, {
      props: { defaultActiveKey: ['1', '2'] },
      slots: panels(),
    });
    expect(
      multiple.findAll('.semi-collapse-header').map((node) => node.attributes('aria-expanded')),
    ).toEqual(['true', 'true', 'false']);

    const accordion = mount(Collapse, {
      props: { accordion: true, defaultActiveKey: ['1', '2'] },
      slots: panels(),
    });
    expect(
      accordion.findAll('.semi-collapse-header').map((node) => node.attributes('aria-expanded')),
    ).toEqual(['true', 'false', 'false']);
  });

  it('非受控交互按 Foundation 更新多项状态并依次发 change/update', async () => {
    const calls: string[] = [];
    const wrapper = mount(Collapse, {
      props: {
        motion: false,
        onChange: (keys: string | string[], event: MouseEvent) => {
          calls.push(`change:${JSON.stringify(keys)}:${event.type}`);
        },
        'onUpdate:activeKey': (keys: string | string[]) => {
          calls.push(`update:${JSON.stringify(keys)}`);
        },
      },
      slots: panels(),
    });
    const headers = wrapper.findAll('.semi-collapse-header');
    await headers[1]!.trigger('click');
    await headers[2]!.trigger('click');

    expect(headers.map((node) => node.attributes('aria-expanded'))).toEqual([
      'false',
      'true',
      'true',
    ]);
    expect(calls).toEqual([
      'change:["2"]:click',
      'update:["2"]',
      'change:["2","3"]:click',
      'update:["2","3"]',
    ]);
  });

  it('受控模式只通知，父级回传 activeKey 后才更新 DOM', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Collapse, {
      props: { activeKey: ['1'], motion: false, onChange },
      slots: panels(),
    });
    const headers = wrapper.findAll('.semi-collapse-header');
    await headers[1]!.trigger('click');
    expect(onChange).toHaveBeenCalledWith(['1', '2'], expect.any(MouseEvent));
    expect(headers.map((node) => node.attributes('aria-expanded'))).toEqual([
      'true',
      'false',
      'false',
    ]);

    await wrapper.setProps({ activeKey: ['2'] });
    expect(headers.map((node) => node.attributes('aria-expanded'))).toEqual([
      'false',
      'true',
      'false',
    ]);
  });

  it('accordion 交互只保留一个 key，但通知值仍为数组', async () => {
    const wrapper = mount(Collapse, {
      props: { accordion: true, defaultActiveKey: '1', motion: false },
      slots: panels(),
    });
    await wrapper.findAll('.semi-collapse-header')[2]!.trigger('click');
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['3']);
    expect(
      wrapper.findAll('.semi-collapse-header').map((node) => node.attributes('aria-expanded')),
    ).toEqual(['false', 'false', 'true']);
  });

  it('clickHeaderToExpand=false 时正文无效而 icon 热区有效', async () => {
    const wrapper = mount(Collapse, {
      props: { clickHeaderToExpand: false, motion: false },
      slots: panels(),
    });
    const header = wrapper.findAll('.semi-collapse-header')[0]!;
    await header.get('span').trigger('click');
    expect(header.attributes('aria-expanded')).toBe('false');
    await header.get('.semi-collapse-header-icon').trigger('click');
    expect(header.attributes('aria-expanded')).toBe('true');
  });

  it('disabled/showArrow 的模板裸属性、显式 false 与 h() 输入保持正确', async () => {
    const TemplateHost = defineComponent({
      components: { Collapse, CollapsePanel },
      template: `
        <Collapse :motion="false">
          <CollapsePanel item-key="template-disabled" header="Disabled" disabled>Disabled body</CollapsePanel>
          <CollapsePanel item-key="template-no-arrow" header="No arrow" :show-arrow="false">No arrow body</CollapsePanel>
          <CollapsePanel item-key="template-enabled" header="Enabled" :disabled="false" show-arrow>Enabled body</CollapsePanel>
        </Collapse>
      `,
    });
    const template = mount(TemplateHost);
    const templateHeaders = template.findAll('.semi-collapse-header');
    expect(templateHeaders[0]!.classes()).toContain('semi-collapse-header-disabled');
    expect(templateHeaders[0]!.attributes('aria-disabled')).toBe('true');
    expect(template.findAll('.semi-collapse-header-icon')).toHaveLength(2);
    await templateHeaders[0]!.trigger('click');
    expect(templateHeaders[0]!.attributes('aria-expanded')).toBe('false');
    await templateHeaders[2]!.trigger('click');
    expect(templateHeaders[2]!.attributes('aria-expanded')).toBe('true');

    const renderHost = mount(
      defineComponent({
        setup: () => () =>
          h(Collapse, { motion: false }, () => [
            h(CollapsePanel, { disabled: true, header: 'h disabled', itemKey: 'h1' }, () => 'one'),
            h(
              CollapsePanel,
              { disabled: false, header: 'h enabled', itemKey: 'h2', showArrow: false },
              () => 'two',
            ),
          ]),
      }),
    );
    expect(renderHost.findAll('.semi-collapse-header')[0]!.attributes('aria-disabled')).toBe(
      'true',
    );
    expect(renderHost.findAll('.semi-collapse-header')[1]!.attributes('aria-disabled')).toBe(
      'false',
    );
    expect(renderHost.findAll('.semi-collapse-header-icon')).toHaveLength(1);
  });

  it('string header 支持 extra/左右图标，自定义 slot header 自行占据区域', async () => {
    const wrapper = mount(Collapse, {
      props: {
        defaultActiveKey: '1',
        expandIconPosition: 'left',
        motion: false,
      },
      slots: {
        collapseIcon: () => h('i', { 'data-icon': 'collapse' }, '−'),
        expandIcon: () => h('i', { 'data-icon': 'expand' }, '+'),
        default: () => [
          h(
            CollapsePanel,
            {
              extra: h('b', { 'data-extra': 'one' }, 'Extra'),
              header: 'String header',
              itemKey: '1',
            },
            () => 'body',
          ),
          h(
            CollapsePanel,
            { extra: 'ignored', itemKey: '2' },
            { default: () => 'body', header: () => h('em', 'Slot header') },
          ),
        ],
      },
    });

    const headers = wrapper.findAll('.semi-collapse-header');
    expect(headers[0]!.classes()).toContain('semi-collapse-header-iconLeft');
    expect(headers[0]!.get('[data-icon="collapse"]').text()).toBe('−');
    expect(headers[0]!.get('[data-extra="one"]').text()).toBe('Extra');
    expect(headers[0]!.find('.semi-collapse-header-right').exists()).toBe(true);
    expect(headers[1]!.text()).toContain('Slot header');
    expect(headers[1]!.text()).not.toContain('ignored');
    await headers[0]!.trigger('click');
    expect(headers[0]!.get('[data-icon="expand"]').text()).toBe('+');
  });

  it('Panel class/style/rest attrs、ARIA 关系、focus 与固定无键盘切换语义正确', async () => {
    const wrapper = mount(Collapse, {
      attachTo: document.body,
      props: { motion: false },
      slots: {
        default: () =>
          h(
            CollapsePanel,
            {
              'aria-label': 'Panel item',
              class: 'attr-panel',
              className: 'named-panel',
              'data-panel': 'one',
              header: 'Header',
              itemKey: '1',
              style: { color: 'red' },
            },
            () => 'Body',
          ),
      },
    });
    const item = wrapper.get('.semi-collapse-item');
    const header = wrapper.get('.semi-collapse-header');
    expect(item.classes()).toEqual(expect.arrayContaining(['attr-panel', 'named-panel']));
    expect(item.attributes('data-panel')).toBe('one');
    expect(item.attributes('aria-label')).toBe('Panel item');
    expect((item.element as HTMLElement).style.color).toBe('red');
    expect(header.attributes('role')).toBe('button');
    expect(header.attributes('tabindex')).toBe('0');
    (header.element as HTMLElement).focus();
    expect(document.activeElement).toBe(header.element);
    await header.trigger('keydown', { key: 'Enter' });
    expect(header.attributes('aria-expanded')).toBe('false');
    await header.trigger('click');
    const content = wrapper.get('.semi-collapse-content');
    expect(header.attributes('aria-owns')).toBe(content.attributes('id'));
    expect(content.attributes('aria-hidden')).toBe('false');
    wrapper.unmount();
  });

  it('keepDOM/lazyRender/motion/onMotionEnd/reCalcKey 透传给公共 Collapsible', async () => {
    const onMotionEnd = vi.fn();
    const wrapper = mount(Collapse, {
      props: { keepDOM: true, lazyRender: true, motion: true },
      slots: {
        default: () =>
          h(CollapsePanel, { header: 'Panel', itemKey: '1', onMotionEnd, reCalcKey: 0 }, () =>
            h('span', 'Lazy body'),
          ),
      },
    });
    expect(wrapper.text()).not.toContain('Lazy body');
    await wrapper.get('.semi-collapse-header').trigger('click');
    expect(wrapper.text()).toContain('Lazy body');
    await wrapper.get('.semi-collapsible-wrapper').trigger('transitionend');
    expect(onMotionEnd).toHaveBeenCalledOnce();
    await wrapper.get('.semi-collapse-header').trigger('click');
    await wrapper.get('.semi-collapsible-wrapper').trigger('transitionend');
    expect(wrapper.text()).toContain('Lazy body');
    expect(onMotionEnd).toHaveBeenCalledTimes(2);
  });

  it('全局默认只作用于缺省 prop，显式 false/true 保持优先', async () => {
    semiGlobal.config.overrideDefaultProps = {
      Collapse: {
        clickHeaderToExpand: false,
        defaultActiveKey: '2',
        expandIconPosition: 'left',
        motion: false,
      },
    };
    const inherited = mount(Collapse, { slots: panels() });
    const inheritedHeaders = inherited.findAll('.semi-collapse-header');
    expect(inheritedHeaders[1]!.attributes('aria-expanded')).toBe('true');
    expect(inheritedHeaders[0]!.classes()).toContain('semi-collapse-header-iconLeft');
    await inheritedHeaders[0]!.findAll(':scope > span')[1]!.trigger('click');
    expect(inheritedHeaders[0]!.attributes('aria-expanded')).toBe('false');

    const explicit = mount(Collapse, {
      props: {
        clickHeaderToExpand: true,
        defaultActiveKey: '1',
        expandIconPosition: 'right',
        motion: true,
      },
      slots: panels(),
    });
    const explicitHeader = explicit.findAll('.semi-collapse-header')[0]!;
    expect(explicitHeader.classes()).not.toContain('semi-collapse-header-iconLeft');
    await explicitHeader.get('span').trigger('click');
    expect(explicitHeader.attributes('aria-expanded')).toBe('false');
    await nextTick();
  });
});
