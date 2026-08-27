import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('Vue 对照工作台', () => {
  it('可以通过 Vitest 编译并挂载 Vue SFC', () => {
    const wrapper = mount(App);

    expect(wrapper.get('h1').text()).toBe('Semi UI Vue 对照工作台');
    expect(wrapper.text()).toContain('v2.102.0');
  });

  it('通过公共 Button 包渲染已就绪的对照场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'button-types' } });

    expect(wrapper.attributes('data-parity-scenario')).toBe('button-types');
    expect(wrapper.attributes('data-reference-status')).toBe('ready');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.find('[data-testid="vue-scenario-pending"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="button-types-vue"]').findAll('button')).toHaveLength(5);

    await wrapper.get('[data-parity-target="button-danger"]').trigger('click');
    expect(wrapper.get('output').text()).toContain('最近操作：危险按钮');
  });

  it('通过公共 Divider 包渲染完整对照场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'divider' } });

    expect(wrapper.attributes('data-parity-scenario')).toBe('divider');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="divider-vue"]').findAll('.semi-divider')).toHaveLength(8);
    expect(wrapper.get('[data-parity-target="divider-content-left"]').text()).toBe('这是居左文字');
  });

  it('通过公共 Checkbox 包渲染单项、组、辅助文本与卡片场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'checkbox' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="checkbox-vue"]');
    expect(scenario.findAll('.semi-checkbox')).toHaveLength(12);
    expect(scenario.get('[data-parity-target="checkbox-indeterminate"]').classes()).toContain(
      'semi-checkbox-indeterminate',
    );
    expect(scenario.get('[data-parity-target="checkbox-group-horizontal"]').classes()).toContain(
      'semi-checkboxGroup-horizontal',
    );
    expect(scenario.findAll('.semi-checkbox-cardType')).toHaveLength(4);
    await scenario.get('[data-parity-target="checkbox-basic"]').trigger('click');
    expect(scenario.get('output').text()).toContain('basic:true');
  });

  it('通过公共 Input 包渲染输入、组合、密码与 TextArea 场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'input' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="input-vue"]');
    expect(scenario.findAll('.semi-input-wrapper')).toHaveLength(10);
    expect(scenario.findAll('.semi-input-textarea-wrapper')).toHaveLength(2);
    expect(scenario.get('.semi-input-modebtn').attributes('role')).toBe('button');
    expect(scenario.get('.semi-input-group').attributes('role')).toBe('group');
    expect(scenario.findAll('.semi-input-textarea-lineNumber-item')).toHaveLength(3);
    await scenario.get('.input-target-basic .semi-input').setValue('Vue');
    expect(scenario.get('output').text()).toContain('input:Vue');
  });

  it('通过公共 InputNumber 包渲染步进、货币与科学计数场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'input-number' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="input-number-vue"]');
    await wrapper.vm.$nextTick();
    expect(scenario.findAll('.semi-input-number')).toHaveLength(8);
    expect(scenario.findAll('.semi-input-number-suffix-btns')).toHaveLength(6);
    expect(
      (scenario.get('.input-number-target-currency input').element as HTMLInputElement).value,
    ).toBe('$1,234.50');
    await scenario.get('.input-number-target-basic input').setValue('4');
    expect(scenario.get('output').text()).toContain('最近变化：4');
  });

  it('通过公开图标包渲染稳定、AI、Lab 与自定义 Icon 场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'icon' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="icon-vue"]').findAll('.semi-icon')).toHaveLength(12);
    expect(wrapper.get('[data-parity-target="icon-size-small"]').classes()).toContain(
      'semi-icon-small',
    );
    expect(wrapper.get('[data-parity-target="icon-lab"] svg').element.tagName).toBe('svg');
  });

  it('通过公共 Space 包渲染间距、换行、方向与对齐场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'space' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="space-vue"]').findAll('.semi-space')).toHaveLength(10);
    expect(wrapper.get('[data-parity-target="space-array-wrap"]').classes()).toContain(
      'semi-space-wrap',
    );
    expect(wrapper.get('[data-parity-target="space-vertical"]').classes()).toContain(
      'semi-space-vertical',
    );
  });

  it('通过公共 FloatButton 包渲染尺寸、状态、徽章与按钮组场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'float-button' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(
      wrapper.get('[data-testid="float-button-vue"]').findAll('.semi-floatButton'),
    ).toHaveLength(7);
    expect(wrapper.get('.float-button-target-colorful .semi-floatButton-body').classes()).toContain(
      'semi-floatButton-colorful',
    );
    expect(wrapper.get('.float-button-target-badge .semi-badge-count').text()).toBe('99+');
    await wrapper.get('.float-button-target-default').trigger('click');
    expect(wrapper.get('output').text()).toContain('最近操作：default');
  });

  it('通过公共 Layout 包渲染语义区块、嵌套布局与 Sider', () => {
    const wrapper = mount(App, { props: { scenarioId: 'layout' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="layout-vue"]').findAll('.semi-layout')).toHaveLength(4);
    expect(wrapper.get('[data-parity-target="layout-with-sider"]').classes()).toContain(
      'semi-layout-has-sider',
    );
    expect(wrapper.get('[data-parity-target="layout-sider"]').element.tagName).toBe('ASIDE');
    expect(wrapper.get('[data-parity-target="layout-semantic"]').element.tagName).toBe('ARTICLE');
  });

  it('通过公共 Grid 包渲染基础、Gutter、Flex 与响应式栅格', () => {
    const wrapper = mount(App, { props: { scenarioId: 'grid' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(wrapper.get('[data-testid="grid-vue"]').findAll('.semi-row')).toHaveLength(3);
    expect(wrapper.get('[data-testid="grid-vue"]').findAll('.semi-row-flex')).toHaveLength(1);
    expect(wrapper.get('[data-parity-target="grid-flex-row"]').classes()).toContain(
      'semi-row-flex-space-between',
    );
    expect(wrapper.get('[data-parity-target="grid-responsive-col"]').classes()).toContain(
      'semi-col-lg-push-1',
    );
  });

  it('通过公共 Resizable 包渲染单体、水平/垂直组合与拖拽手柄', () => {
    const wrapper = mount(App, { props: { scenarioId: 'resizable' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(
      wrapper.get('[data-testid="resizable-vue"]').findAll('.semi-resizable-group'),
    ).toHaveLength(2);
    expect(
      wrapper.get('[data-testid="resizable-vue"]').findAll('.semi-resizable-item'),
    ).toHaveLength(4);
    expect(wrapper.get('.resizable-target-handler-horizontal').classes()).toContain(
      'semi-resizable-handler-horizontal',
    );
    expect(wrapper.get('.resizable-target-handler-vertical').classes()).toContain(
      'semi-resizable-handler-vertical',
    );
  });

  it('通过公共 Typography 包渲染标题、文本、段落、数值与复制', () => {
    const wrapper = mount(App, { props: { scenarioId: 'typography' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="typography-vue"]');
    expect(scenario.get('[data-parity-target="typography-title"]').element.tagName).toBe('H2');
    expect(scenario.get('[data-parity-target="typography-paragraph"]').classes()).toContain(
      'semi-typography-paragraph',
    );
    expect(scenario.get('[data-parity-target="typography-numeral"]').text()).toBe('1.50 KiB');
    expect(scenario.find('.semi-typography-action-copy').exists()).toBe(true);
  });

  it('通过公共 ConfigProvider 渲染 RTL、Consumer、Locale 与嵌套配置', () => {
    const wrapper = mount(App, { props: { scenarioId: 'config-provider' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="config-provider-vue"]');
    expect(scenario.find(':scope > .semi-rtl').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="config-provider-direction"]').text()).toBe(
      'direction: rtl',
    );
    expect(scenario.text()).toContain('locale: en-US');
    expect(scenario.get('[data-parity-target="config-provider-nested"]').text()).toBe(
      'nested: ltr',
    );
    expect(scenario.get('[role="button"]').attributes('aria-label')).toBe('Copy');
  });

  it('通过公共 Switch 渲染尺寸、文本、禁用、加载与受控场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'switch' } });
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="switch-vue"]');
    expect(scenario.findAll('.semi-switch')).toHaveLength(11);
    expect(scenario.get('[data-parity-target="switch-small"]').classes()).toContain(
      'semi-switch-small',
    );
    expect(scenario.find('[data-parity-target="switch-loading"] [data-icon="spin"]').exists()).toBe(
      true,
    );
    expect(
      scenario.get('[data-parity-target="switch-disabled"] input').attributes('disabled'),
    ).toBeDefined();

    const controlled = scenario.get('[data-parity-target="switch-controlled"] input');
    (controlled.element as HTMLInputElement).checked = true;
    await controlled.trigger('change');
    expect(scenario.get('[data-parity-target="switch-controlled"]').classes()).toContain(
      'semi-switch-checked',
    );
    expect(scenario.get('output').text()).toContain('controlled:true');
  });

  it('通过公共 Tooltip 渲染四向 Portal、箭头与特殊 trigger 包裹', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'tooltip' } });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="tooltip-vue"]');
    expect(scenario.findAll('[data-parity-target^="tooltip-trigger-"]')).toHaveLength(7);
    expect(
      scenario.get('[data-parity-target="tooltip-trigger-right"]').attributes('aria-describedby'),
    ).toBe('tooltip-right');
    expect(
      scenario.get('[data-parity-target="tooltip-trigger-disabled"]').attributes('disabled'),
    ).toBeDefined();

    wrapper.unmount();
  });

  it('通过公共 Select 渲染单选、多选、分组搜索与默认展开场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'select' }, attachTo: document.body });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="select-vue"]');
    expect(scenario.findAll('.semi-select')).toHaveLength(5);
    expect(scenario.get('[data-parity-target="select-basic"]').text()).toContain('抖音');
    expect(scenario.get('[data-parity-target="select-disabled"]').classes()).toContain(
      'semi-select-disabled',
    );
    expect(
      scenario.get('[data-parity-target="select-multiple"]').findAll('.semi-tag'),
    ).toHaveLength(3);
    expect(scenario.find('.semi-select-option-list-wrapper').exists()).toBe(true);

    wrapper.unmount();
  });
});
