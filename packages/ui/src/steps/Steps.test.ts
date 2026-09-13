import { mount } from '@vue/test-utils';
import { Comment, Fragment, defineComponent, h } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Step from './Step.vue';
import Steps from './Steps.vue';

const wrappers: Array<ReturnType<typeof mount>> = [];

function children() {
  return [
    h(Step, { title: 'Finished', description: 'First description' }),
    h(Step, { title: 'In Progress', description: 'Second description' }),
    h(Step, { title: 'Waiting', description: 'Third description' }),
  ];
}

function mountSteps(props: Record<string, unknown> = {}, slot = children) {
  const wrapper = mount(Steps, { props, slots: { default: slot } });
  wrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('Steps', () => {
  it('fill 默认值保留 Row/Col、等宽、状态、序号与根 class/style/data/ARIA', () => {
    const wrapper = mountSteps({
      current: 1,
      class: 'vue-steps',
      className: 'custom-steps',
      style: { color: 'red' },
      'aria-label': 'Progress',
      'data-owner': 'docs',
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-steps', 'semi-steps-horizontal', 'custom-steps', 'vue-steps']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': 'Progress',
      'data-owner': 'docs',
    });
    expect((wrapper.element as HTMLElement).style.color).toBe('red');
    expect(wrapper.get('.semi-row-flex').classes()).toContain('semi-row-flex-start');
    expect(wrapper.findAll('.semi-col')).toHaveLength(3);
    expect((wrapper.findAll('.semi-col')[0]!.element as HTMLElement).style.width).toBe(
      '33.333333333333336%',
    );

    const items = wrapper.findAll('.semi-steps-item');
    expect(
      items.map((item) => item.classes().find((name) => /item-(finish|process|wait)$/.test(name))),
    ).toEqual(['semi-steps-item-finish', 'semi-steps-item-process', 'semi-steps-item-wait']);
    expect(items.map((item) => item.get('.semi-steps-item-left').text())).toEqual(['', '2', '3']);
    expect(items.every((item) => item.attributes('aria-current') === 'step')).toBe(true);
    expect(items.every((item) => item.attributes('tabindex') === '0')).toBe(true);
  });

  it('basic 推导 active/done/连接线/small/vertical，并让显式子 status 与 icon 优先', () => {
    const customIcon = h('i', { class: 'custom-icon' }, '!');
    const wrapper = mountSteps(
      { current: 2, direction: 'vertical', initial: 1, size: 'small', type: 'basic' },
      () => [
        h(Step, { icon: customIcon, status: 'warning', title: 'Custom' }),
        h(Step, { title: 'Current' }),
        h(Step, { title: 'Waiting' }),
      ],
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-steps-basic',
        'semi-steps-vertical',
        'semi-steps-small',
        'semi-steps-hasline',
      ]),
    );
    const items = wrapper.findAll('.semi-steps-item');
    expect(items[0]!.classes()).toEqual(
      expect.arrayContaining(['semi-steps-item-warning', 'semi-steps-item-done']),
    );
    expect(items[0]!.get('.custom-icon').text()).toBe('!');
    expect(items[1]!.classes()).toEqual(
      expect.arrayContaining(['semi-steps-item-process', 'semi-steps-item-active']),
    );
    expect(items[1]!.get('.semi-steps-item-number-icon').text()).toBe('3');
    expect(items[2]!.get('.semi-steps-item-number-icon').text()).toBe('4');
  });

  it('hasLine 缺省/显式 false/显式 true 在 SFC 模板裸属性与 h() 输入都正确', () => {
    const TemplateHost = defineComponent({
      components: { Step, Steps },
      template: `
        <div>
          <Steps data-testid="missing" type="basic"><Step title="A" /></Steps>
          <Steps data-testid="bare" type="basic" has-line><Step title="A" /></Steps>
          <Steps data-testid="false" type="basic" :has-line="false"><Step title="A" /></Steps>
        </div>
      `,
    });
    const template = mount(TemplateHost);
    wrappers.push(template);
    expect(template.get('[data-testid="missing"]').classes()).toContain('semi-steps-hasline');
    expect(template.get('[data-testid="bare"]').classes()).toContain('semi-steps-hasline');
    expect(template.get('[data-testid="false"]').classes()).not.toContain('semi-steps-hasline');

    expect(mountSteps({ type: 'basic', hasLine: true }).classes()).toContain('semi-steps-hasline');
    expect(mountSteps({ type: 'basic', hasLine: false }).classes()).not.toContain(
      'semi-steps-hasline',
    );
  });

  it('nav 保留 small、active、Chevron 与仅按内容撑开的 DOM', () => {
    const wrapper = mountSteps({ current: 1, initial: 5, size: 'small', type: 'nav' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-steps-nav', 'semi-steps-small']),
    );
    const items = wrapper.findAll('.semi-steps-item');
    expect(items).toHaveLength(3);
    expect(items[1]!.classes()).toContain('semi-steps-item-active');
    expect(wrapper.findAll('.semi-steps-item-icon')).toHaveLength(2);
    expect(wrapper.findAll('.semi-icon-chevron_right')).toHaveLength(2);
    expect(wrapper.findAll('.semi-col')).toHaveLength(0);
  });

  it('点击与 Enter 先派发 Step 事件再派发父 change，当前项和非 Enter 不 change', async () => {
    const order: string[] = [];
    const wrapper = mountSteps(
      {
        current: 1,
        initial: 3,
        onChange: (index: number) => order.push(`change:${index}`),
        type: 'basic',
      },
      () => [
        h(Step, {
          title: 'First',
          onClick: () => order.push('click'),
          onKeyDown: () => order.push('keyDown'),
        }),
        h(Step, { title: 'Current', onClick: () => order.push('currentClick') }),
      ],
    );
    const items = wrapper.findAll('.semi-steps-item');

    await items[0]!.trigger('click');
    expect(order).toEqual(['click', 'change:3']);
    order.length = 0;
    await items[0]!.trigger('keydown', { key: ' ' });
    expect(order).toEqual([]);
    await items[0]!.trigger('keydown', { key: 'Enter' });
    expect(order).toEqual(['keyDown', 'change:3']);
    order.length = 0;
    await items[1]!.trigger('click');
    expect(order).toEqual(['currentClick']);
  });

  it('父 error 保留 next-error class 覆盖，并在 current 更新后重新推导公开 DOM', async () => {
    const wrapper = mountSteps({ current: 2, status: 'error', type: 'basic' });
    let items = wrapper.findAll('.semi-steps-item');
    expect(items[1]!.classes()).toContain('semi-steps-next-error');
    expect(items[2]!.classes()).toContain('semi-steps-item-error');

    await wrapper.setProps({ current: 1, status: 'warning' });
    items = wrapper.findAll('.semi-steps-item');
    expect(items[0]!.classes()).not.toContain('semi-steps-next-error');
    expect(items[1]!.classes()).toContain('semi-steps-item-warning');
    expect(items[2]!.classes()).toContain('semi-steps-item-wait');
  });

  it('render function 展开 Fragment 并过滤 Comment/空白，保留 title/description/icon slots', () => {
    const wrapper = mountSteps({ type: 'basic' }, () => [
      h(Fragment, null, [
        h(Comment),
        '   ',
        h(
          Step,
          { title: 'prop title' },
          {
            title: () => h('strong', { class: 'slot-title' }, 'slot title'),
            description: () => h('em', { class: 'slot-description' }, 'slot description'),
            icon: () => h('b', { class: 'slot-icon' }, 'S'),
          },
        ),
      ]),
    ]);
    expect(wrapper.findAll('.semi-steps-item')).toHaveLength(1);
    expect(wrapper.get('.slot-title').text()).toBe('slot title');
    expect(wrapper.get('.slot-description').text()).toBe('slot description');
    expect(wrapper.get('.slot-icon').text()).toBe('S');
    expect(wrapper.text()).not.toContain('prop title');
  });

  it('Step 单独使用保留 fill 默认 wait、class/style/data/role/aria 与自定义空 icon', () => {
    const wrapper = mount(Step, {
      props: {
        title: 'Standalone',
        icon: null,
        class: 'vue-step',
        className: 'custom-step',
        style: { color: 'blue' },
        role: 'listitem',
        'aria-label': 'Standalone step',
        'data-owner': 'unit',
      },
    });
    wrappers.push(wrapper);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-steps-item',
        'semi-steps-item-wait',
        'custom-step',
        'vue-step',
      ]),
    );
    expect(wrapper.attributes()).toMatchObject({
      role: 'listitem',
      'aria-label': 'Standalone step',
      'data-owner': 'unit',
    });
    expect((wrapper.element as HTMLElement).style.color).toBe('blue');
    expect(wrapper.find('.semi-steps-item-left').exists()).toBe(false);
  });
});
