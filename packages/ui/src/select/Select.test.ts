import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import Select from './Select.vue';
import SelectOption from './SelectOption.vue';
import SelectOptionGroup from './SelectOptionGroup.vue';
import type { SelectExposed } from './types';

afterEach(() => {
  document.body.innerHTML = '';
  delete semiGlobal.config.overrideDefaultProps;
});

function options() {
  return {
    default: () => [
      h(SelectOption, { value: 'douyin' }, () => '抖音'),
      h(SelectOption, { value: 'ulikecam' }, () => '轻颜相机'),
      h(SelectOption, { value: 'jianying', disabled: true }, () => '剪映'),
      h(SelectOption, { value: 'xigua' }, () => '西瓜视频'),
    ],
  };
}

describe('Select', () => {
  it('渲染缺省值并按公开事件顺序完成单选', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { defaultValue: 'douyin', motion: false },
      slots: options(),
    });
    await nextTick();
    expect(wrapper.get('[role="combobox"]').text()).toContain('抖音');
    await wrapper.get('[role="combobox"]').trigger('click');
    await nextTick();
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    const option = [...document.body.querySelectorAll<HTMLElement>('[role="option"]')][1]!;
    option.click();
    await nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('ulikecam');
    expect(wrapper.emitted('change')?.[0]).toEqual(['ulikecam']);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ulikecam']);
    expect(wrapper.get('[role="combobox"]').text()).toContain('轻颜相机');
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false');
  });

  it('受控值不会因选择自行漂移', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { modelValue: 'douyin', motion: false },
      slots: options(),
    });
    await nextTick();
    await wrapper.get('[role="combobox"]').trigger('click');
    await nextTick();
    [...document.body.querySelectorAll<HTMLElement>('[role="option"]')][1]!.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ulikecam']);
    expect(wrapper.get('[role="combobox"]').text()).toContain('抖音');
  });

  it('多选支持 max、标签移除、+N 与清空', async () => {
    const onExceed = vi.fn();
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: {
        defaultValue: ['douyin', 'ulikecam'],
        max: 2,
        maxTagCount: 1,
        motion: false,
        multiple: true,
        onExceed,
      },
      slots: options(),
    });
    await nextTick();
    expect(wrapper.findAll('.semi-tag')).toHaveLength(2);
    expect(wrapper.text()).toContain('+1');
    await wrapper.get('[role="combobox"]').trigger('click');
    await nextTick();
    [...document.body.querySelectorAll<HTMLElement>('[role="option"]')][3]!.click();
    expect(onExceed).toHaveBeenCalledOnce();
    [...document.body.querySelectorAll<HTMLElement>('[role="option"]')][1]!.click();
    await nextTick();
    expect(wrapper.emitted('deselect')?.[0]?.[0]).toBe('ulikecam');
    (wrapper.vm as unknown as SelectExposed).deselectAll();
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[]]);
  });

  it('过滤、分组、创建项和键盘焦点均走公开 DOM 契约', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { allowCreate: true, filter: true, motion: false, placeholder: '搜索' },
      slots: {
        default: () => [
          h(SelectOptionGroup, { label: 'Asia' }, () => [
            h(SelectOption, { value: 'china' }, () => 'China'),
            h(SelectOption, { value: 'korea' }, () => 'Korea'),
          ]),
        ],
      },
    });
    await wrapper.get('[role="combobox"]').trigger('click');
    await nextTick();
    expect(document.body.querySelector('.semi-select-group')?.textContent).toBe('Asia');
    const input = wrapper.get('input');
    await input.setValue('Kor');
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(2);
    expect(document.body.querySelector('.semi-select-option-keyword')?.textContent).toBe('Kor');
    await input.setValue('Japan');
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(1);
    await input.trigger('keydown', { keyCode: 40 });
    expect(wrapper.get('[role="combobox"]').attributes('aria-activedescendant')).toContain(
      'option-0',
    );
  });

  it('createItem scoped slot 保留创建项专属 role、内容与事件链', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { allowCreate: true, defaultOpen: true, filter: true, motion: false },
      slots: {
        createItem: ({ inputValue, focused }) =>
          h('span', { class: 'custom-create' }, `${focused ? 'focused' : 'idle'}:${inputValue}`),
        default: () => h(SelectOption, { value: 'china' }, () => 'China'),
      },
    });
    await nextTick();
    await nextTick();
    await wrapper.get('input').setValue('Japan');
    await nextTick();
    const createItem = document.body.querySelector<HTMLElement>(
      '[role="button"][aria-label="Use the input box to create an optional item"]',
    );
    expect(createItem?.textContent).toBe('focused:Japan');
    createItem?.click();
    await nextTick();
    expect(wrapper.emitted('create')?.[0]?.[0]).toMatchObject({ value: 'Japan' });
    expect(wrapper.emitted('change')?.[0]).toEqual(['Japan']);
  });

  it('insetLabel slot 与 ellipsisTrigger 自适应折叠保留上游 DOM class', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: {
        defaultValue: ['douyin', 'ulikecam', 'xigua'],
        ellipsisTrigger: true,
        insetLabelId: 'business-label',
        multiple: true,
      },
      slots: { ...options(), insetLabel: () => '业务' },
    });
    const content = wrapper.get('.semi-select-content-wrapper').element;
    Object.defineProperty(content, 'clientWidth', { configurable: true, value: 20 });
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    await nextTick();
    expect(wrapper.get('#business-label').classes()).toContain('semi-select-inset-label');
    expect(wrapper.find('.semi-select-content-wrapper-collapse .semi-overflow-list').exists()).toBe(
      true,
    );
    expect(wrapper.get('[data-select-collapse-tag]').text()).toBe('+3');
  });

  it('稳定自定义容器首次展示即为 Portal 父节点', async () => {
    const popupHost = document.createElement('div');
    document.body.append(popupHost);
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { defaultOpen: true, getPopupContainer: () => popupHost, motion: false },
      slots: options(),
    });
    await nextTick();
    await nextTick();
    expect(popupHost.querySelector('.semi-portal-inner')).not.toBeNull();
    expect(wrapper.get('[role="combobox"]').attributes('aria-controls')).toBeTruthy();
  });

  it('默认 true Boolean 区分缺省、显式 false 与全局覆盖', async () => {
    semiGlobal.config.overrideDefaultProps = { Select: { showArrow: false } };
    const inherited = mount(Select, { slots: options() });
    expect(inherited.find('.semi-select-arrow').exists()).toBe(false);
    const explicitTrue = mount(Select, { props: { showArrow: true }, slots: options() });
    expect(explicitTrue.find('.semi-select-arrow').exists()).toBe(true);
    const explicitFalse = mount(Select, { props: { showArrow: false }, slots: options() });
    expect(explicitFalse.find('.semi-select-arrow').exists()).toBe(false);
  });

  it('SFC 裸 Boolean 与 render function Boolean 都保持 Option 禁用语义', async () => {
    const Host = defineComponent({
      components: { Select, SelectOption },
      template: `
        <Select :default-open="true" :motion="false">
          <SelectOption value="bare" disabled>裸属性禁用</SelectOption>
          <SelectOption value="false" :disabled="false">显式可用</SelectOption>
        </Select>
      `,
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();
    const items = [...document.body.querySelectorAll<HTMLElement>('[role="option"]')];
    expect(items[0]?.getAttribute('aria-disabled')).toBe('true');
    expect(items[1]?.getAttribute('aria-disabled')).toBe('false');
    items[0]!.click();
    items[1]!.click();
    await nextTick();
    expect(wrapper.findComponent(Select).emitted('select')).toHaveLength(1);
    expect(wrapper.findComponent(Select).emitted('select')?.[0]?.[0]).toBe('false');
  });

  it('暴露 open、close、focus、search、selectAll 与 rePosition', async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { filter: true, motion: false, multiple: true },
      slots: options(),
    });
    const api = wrapper.vm as unknown as SelectExposed;
    api.open();
    await nextTick();
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true');
    api.search('轻');
    await nextTick();
    expect(wrapper.get('input').element.value).toBe('轻');
    api.selectAll();
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual([
      'douyin',
      'ulikecam',
      'jianying',
      'xigua',
    ]);
    api.rePosition();
    api.close();
    api.focus();
    await nextTick();
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false');
  });
});
