import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

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

  it('通过公共 PinCode 包渲染三种尺寸、混合码、禁用与输入状态', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'pin-code' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="pin-code-vue"]');
    expect(scenario.findAll('.semi-pincode-wrapper')).toHaveLength(6);
    expect(scenario.findAll('.semi-input-wrapper-small')).toHaveLength(6);
    expect(scenario.findAll('.semi-input-wrapper-large')).toHaveLength(6);
    expect(scenario.findAll('input')).toHaveLength(34);
    expect(scenario.findAll('input:disabled')).toHaveLength(6);
    await scenario.get('.pin-code-target-empty input').setValue('7');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(scenario.get('output').text()).toContain('最近变化：7');
  });

  it('通过公共 Radio 包渲染单项、组合、按钮、卡片与交互状态', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'radio' } });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    const scenario = wrapper.get('[data-testid="radio-vue"]');
    expect(scenario.findAll('.semi-radio')).toHaveLength(14);
    expect(scenario.get('[data-parity-target="radio-button"]').classes()).toContain(
      'semi-radioGroup-buttonRadio',
    );
    expect(scenario.get('[data-parity-target="radio-card"] .semi-radio').classes()).toContain(
      'semi-radio-cardRadioGroup',
    );
    const basic = scenario.get('[data-parity-target="radio-basic"] input');
    (basic.element as HTMLInputElement).checked = true;
    await basic.trigger('change');
    expect(scenario.get('output').text()).toContain('最近变化：single:true');
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

  it('通过公共 Slider 渲染单值、范围、刻度、禁用与纵向场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'slider' } });
    const scenario = wrapper.get('[data-testid="slider-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-slider-wrapper')).toHaveLength(5);
    expect(scenario.findAll('[role="slider"]')).toHaveLength(7);
    expect(scenario.get('[data-parity-target="slider-disabled"]').classes()).toContain(
      'semi-slider-disabled',
    );
    expect(scenario.findAll('.semi-slider-mark')).toHaveLength(5);
    expect(scenario.find('.semi-slider-vertical-wrapper').exists()).toBe(true);
    await scenario.get('[data-parity-target="slider-basic"] [role="slider"]').trigger('keydown', {
      key: 'ArrowRight',
    });
    expect(scenario.get('output').text()).toContain('basic:31');
  });

  it('通过公共 TagInput 渲染标签、尺寸、校验、折叠与前后缀场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'tag-input' } });
    const scenario = wrapper.get('[data-testid="tag-input-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-tagInput')).toHaveLength(7);
    expect(scenario.get('[data-parity-target="tag-input-small"]').classes()).toContain(
      'semi-tagInput-small',
    );
    expect(scenario.get('[data-parity-target="tag-input-disabled"]').classes()).toContain(
      'semi-tagInput-disabled',
    );
    expect(scenario.get('[data-parity-target="tag-input-warning"]').classes()).toContain(
      'semi-tagInput-warning',
    );
    expect(scenario.get('[data-parity-target="tag-input-collapsed"]').text()).toContain('+2');
    await scenario.get('[data-parity-target="tag-input-basic"] input').setValue('新增');
    await scenario
      .get('[data-parity-target="tag-input-basic"] input')
      .trigger('keydown', { key: 'Enter', keyCode: 13 });
    expect(scenario.get('output').text()).toContain('新增');
  });

  it('通过公共 TimePicker 渲染单值、范围、尺寸、禁用与十二小时制场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'time-picker' } });
    const scenario = wrapper.get('[data-testid="time-picker-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-timepicker')).toHaveLength(7);
    expect(scenario.get('[data-parity-target="time-picker-small"]').classes()).toContain(
      'semi-input-small',
    );
    expect(scenario.get('[data-parity-target="time-picker-large"]').classes()).toContain(
      'semi-input-large',
    );
    expect(scenario.get('[data-parity-target="time-picker-disabled"]').attributes()).toHaveProperty(
      'disabled',
    );
    expect(scenario.get('[data-parity-target="time-picker-range"]').element).toHaveProperty(
      'value',
      '09:00:00 ~ 18:00:00',
    );
    await scenario.get('[data-parity-target="time-picker-basic"]').setValue('11:25:19');
    expect(scenario.get('output').text()).toContain('11:25:19');

    wrapper.unmount();
  });

  it('通过公共 Anchor 渲染尺寸、嵌套、禁用并响应点击', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'anchor' } });
    const scenario = wrapper.get('[data-testid="anchor-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-anchor')).toHaveLength(2);
    expect(scenario.findAll('.semi-anchor-link-title')).toHaveLength(6);
    expect(scenario.get('.anchor-target-disabled > .semi-anchor-link-title').classes()).toContain(
      'semi-anchor-link-title-disabled',
    );
    expect(scenario.get('.anchor-target-small').classes()).toContain('semi-anchor-size-small');
    await scenario.get('.anchor-target-api > .semi-anchor-link-title').trigger('click');
    expect(scenario.get('output').text()).toBe('点击：#anchor-api');

    wrapper.unmount();
  });

  it('通过公共 BackTop 响应 Element 滚动阈值、默认/自定义内容与回顶点击', async () => {
    let now = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 16;
      return now;
    });
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(now);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const wrapper = mount(App, { props: { scenarioId: 'back-top' } });
    const scenario = wrapper.get('[data-testid="back-top-vue"]');
    const scrollTarget = scenario.get('.back-top-scenario__scroll');

    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.find('[data-parity-target="back-top-default"]').exists()).toBe(false);
    expect(scenario.get('[data-parity-target="back-top-custom"]').text()).toBe('TOP');

    (scrollTarget.element as HTMLElement).scrollTop = 120;
    await scrollTarget.trigger('scroll');
    await wrapper.vm.$nextTick();
    const defaultBackTop = scenario.get('[data-parity-target="back-top-default"]');
    expect(defaultBackTop.get('button').classes()).toContain('semi-button-with-icon-only');
    await defaultBackTop.trigger('click');
    expect((scrollTarget.element as HTMLElement).scrollTop).toBe(0);
    expect(scenario.get('output').text()).toBe('点击：默认回顶');

    wrapper.unmount();
    vi.unstubAllGlobals();
  });
});
