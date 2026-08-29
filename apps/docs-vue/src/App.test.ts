import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import App from './App.vue';

describe('Vue 对照工作台', () => {
  it('通过公共 Table 渲染表头、选择列、选中行与横向滚动场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'table', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="table-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-table-row-head')).toHaveLength(4);
    expect(scenario.findAll('.semi-table-tbody .semi-table-row')).toHaveLength(3);
    expect(scenario.find('.semi-table-row-selected').text()).toContain('API Gateway');
    expect(scenario.find('.semi-table-column-selection').exists()).toBe(true);
    expect(scenario.find('.semi-table-wrapper-rtl').exists()).toBe(true);
    wrapper.unmount();
  });

  it('通过公共 SideSheet 渲染稳定容器、dialog、标题、正文与 footer', async () => {
    const wrapper = mount(App, {
      attachTo: document.body,
      props: { scenarioId: 'side-sheet', direction: 'rtl' },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const stage = wrapper.get('[data-testid="side-sheet-vue"]');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(stage.find(':scope > .semi-portal').exists()).toBe(true);
    expect(stage.get('[role="dialog"]').classes()).toContain('semi-sidesheet-inner');
    expect(stage.get('.semi-sidesheet-title').text()).toBe('资源详情');
    expect(stage.get('.semi-sidesheet-body').text()).toContain('3 项配置');
    expect(stage.get('.semi-sidesheet-footer').text()).toBe('保存变更');
    expect(stage.get('.semi-sidesheet').classes()).toContain('semi-sidesheet-rtl');
    wrapper.unmount();
  });

  it('通过公共 ScrollList 渲染 normal、wheel、循环与 disabled 场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'scroll-list', direction: 'rtl' } });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const scenario = wrapper.get('[data-testid="scroll-list-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('[role="listbox"]')).toHaveLength(5);
    expect(scenario.findAll('.semi-scrolllist-item-wheel')).toHaveLength(3);
    expect(scenario.findAll('.semi-scrolllist-item-disabled').length).toBeGreaterThan(1);
    expect(scenario.find('.semi-scrolllist-list-outer-nocycle').exists()).toBe(true);
    wrapper.unmount();
  });

  it('通过公共 Popover 渲染卡片、箭头、角色与首次自定义容器', async () => {
    const wrapper = mount(App, {
      attachTo: document.body,
      props: { scenarioId: 'popover', direction: 'rtl' },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const scenario = wrapper.get('[data-testid="popover-vue"]');
    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('[data-parity-target^="popover-trigger-"]')).toHaveLength(4);
    expect(scenario.findAll(':scope > .semi-portal')).toHaveLength(2);
    expect(scenario.findAll('.semi-popover')).toHaveLength(2);
    expect(scenario.find('.semi-popover-icon-arrow').exists()).toBe(true);
    expect(scenario.find('.semi-popover-rtl').exists()).toBe(true);
    wrapper.unmount();
  });

  it('通过公共 OverflowList 渲染 collapse 与 scroll 场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'overflow-list', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="overflow-list-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-overflow-list')).toHaveLength(3);
    expect(
      scenario.findAll('[data-parity-target="overflow-list-end"] .semi-overflow-list-item'),
    ).toHaveLength(5);
    expect(
      scenario.findAll('[data-parity-target="overflow-list-scroll"] [data-scrollkey]'),
    ).toHaveLength(5);
    expect(scenario.get('.semi-overflow-list-scroll-wrapper').classes()).toContain(
      'semi-overflow-list-scroll-wrapper',
    );
    wrapper.unmount();
  });
  it('通过公共 Modal 渲染 Portal、标题、正文与默认 footer', async () => {
    const wrapper = mount(App, {
      attachTo: document.body,
      props: { scenarioId: 'modal', direction: 'rtl' },
    });

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(document.body.querySelector('[data-parity-target="modal-basic"]')).not.toBeNull();
    expect(document.body.querySelector('.semi-modal-title')?.textContent).toBe('发布变更');
    expect(document.body.querySelector('.semi-modal-body')?.textContent).toContain('3 项变更');
    expect(document.body.querySelectorAll('.semi-modal-footer button')).toHaveLength(2);
    expect(document.body.querySelector('.semi-modal-rtl')).not.toBeNull();
    wrapper.unmount();
  });
  it('通过公共 Descriptions 渲染 data、Item、双行与横向场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'descriptions', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="descriptions-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-descriptions')).toHaveLength(7);
    expect(scenario.find('.semi-descriptions-double-large').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="descriptions-horizontal"]').classes()).toContain(
      'semi-descriptions-horizontal',
    );
    expect(
      scenario.get('[data-parity-target="descriptions-horizontal"]').findAll('tr'),
    ).toHaveLength(2);
    expect(scenario.text()).not.toContain('不可见');
    wrapper.unmount();
  });
  it('通过公共 Empty 渲染图片、无图片、水平与 SVG 场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'empty', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="empty-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-empty')).toHaveLength(5);
    expect(scenario.get('[data-parity-target="empty-vertical"] h4').text()).toBe('暂无数据');
    expect(scenario.get('[data-parity-target="empty-no-image"] h6').text()).toBe('未找到匹配结果');
    expect(scenario.get('[data-parity-target="empty-horizontal"]').classes()).toContain(
      'semi-empty-horizontal',
    );
    expect(scenario.get('[data-parity-target="empty-symbol"] use').attributes('href')).toBe(
      '#empty-parity-symbol',
    );
    expect(scenario.get('[data-parity-target="empty-string-image"] img').attributes('alt')).toBe(
      '添加一个项目',
    );
    wrapper.unmount();
  });

  it('通过公共 Highlight 渲染默认、样式、正则与重叠场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'highlight', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="highlight-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.get('[data-parity-target="highlight-basic"]').findAll('mark')).toHaveLength(2);
    expect(scenario.get('.highlight-scenario__custom').text()).toBe('Semi');
    expect(scenario.get('[data-parity-target="highlight-regex"]').findAll('mark')).toHaveLength(2);
    expect(scenario.get('[data-parity-target="highlight-overlap"]').findAll('strong')).toHaveLength(
      2,
    );
    wrapper.unmount();
  });

  it('通过公共 Image 渲染单图与分组预览场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'image', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="image-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-image')).toHaveLength(3);
    expect(scenario.get('[data-parity-target="image-basic"]').attributes('alt')).toBe('蓝色山景');
    expect(scenario.get('.semi-image-preview-group').findAll('.semi-image')).toHaveLength(2);
    wrapper.unmount();
  });

  it('通过公共 Cropper 渲染矩形与圆形场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'cropper', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="cropper-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-cropper')).toHaveLength(2);
    expect(
      scenario.get('[data-parity-target="cropper-basic"] > .semi-cropper').classes(),
    ).toContain('semi-cropper');
    expect(
      scenario.get('[data-parity-target="cropper-round"] .semi-cropper-view-box').classes(),
    ).toContain('semi-cropper-view-box-round');
    wrapper.unmount();
  });

  it('通过公共 List 渲染数据源、Item 分区、horizontal 与 Grid 场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'list', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="list-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('[data-parity-target="list-basic"] .semi-list-item')).toHaveLength(2);
    expect(scenario.get('[data-parity-target="list-basic"] .semi-list').classes()).toContain(
      'semi-list-bordered',
    );
    expect(scenario.get('[data-parity-target="list-horizontal"] .semi-list').classes()).toContain(
      'semi-list-flex',
    );
    expect(scenario.findAll('[data-parity-target="list-grid"] .semi-col-12')).toHaveLength(2);
    expect(scenario.get('.semi-list-item-body-main').text()).toContain('Alice');
    wrapper.unmount();
  });

  it('通过公共 Illustrations 包渲染全部 light/dark 插画', () => {
    const wrapper = mount(App, { props: { scenarioId: 'illustrations' } });
    const scenario = wrapper.get('[data-testid="illustrations-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('svg')).toHaveLength(16);
    expect(scenario.findAll('[data-illustration]')).toHaveLength(16);
    expect(scenario.get('[data-illustration="NoContent"]').attributes('viewBox')).toBe(
      '0 0 200 200',
    );
    expect(scenario.get('[data-illustration="NoContentDark"]').attributes('aria-hidden')).toBe(
      'true',
    );
    wrapper.unmount();
  });

  it('通过公共 Collapsible 渲染开合、摘要、自适应与懒渲染场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'collapsible' } });
    const scenario = wrapper.get('[data-testid="collapsible-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-collapsible-wrapper')).toHaveLength(4);
    expect(scenario.get('[data-parity-target="collapsible-preview"]').text()).toContain(
      '第三行仍保留在 DOM 中',
    );
    expect(scenario.find('[data-lazy-content]').exists()).toBe(false);
    await scenario.get('[data-action="toggle-lazy"]').trigger('click');
    expect(scenario.get('[data-lazy-content]').text()).toBe('已创建并保留的内容');
    await scenario.get('[data-action="toggle-lazy"]').trigger('click');
    expect(scenario.find('[data-lazy-content]').exists()).toBe(true);

    await scenario.get('[data-action="toggle-basic"]').trigger('click');
    const basic = scenario.get('[data-parity-target="collapsible-basic"]');
    expect(basic.classes()).toContain('semi-collapsible-transition');
    await basic.trigger('transitionend');
    expect(scenario.get('output').text()).toBe('基础面板：动效结束');
    expect(basic.text()).not.toContain('从设计到交付');
  });

  it('通过公共 Carousel 渲染多动效、指示器、箭头、单项并闭环 change', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'carousel' } });
    const scenario = wrapper.get('[data-testid="carousel-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-carousel')).toHaveLength(4);
    expect(scenario.find('.semi-carousel-content-fade').exists()).toBe(true);
    expect(scenario.find('.semi-carousel-indicator-columnar').exists()).toBe(true);
    expect(scenario.find('.semi-carousel-arrow-hover').exists()).toBe(true);
    expect(
      scenario.find('[data-parity-target="carousel-single"] .semi-carousel-arrow').exists(),
    ).toBe(false);
    await scenario
      .get('[data-parity-target="carousel-basic"] .semi-carousel-arrow-next')
      .trigger('click');
    expect(scenario.get('output').text()).toBe('当前：开发');
    expect(
      scenario
        .get('[data-parity-target="carousel-basic"] .semi-carousel-content-item-active')
        .text(),
    ).toContain('开发');
  });

  it('通过公共 Card、Meta 与 CardGroup 渲染完整场景并派发操作', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'card' } });
    const scenario = wrapper.get('[data-testid="card-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-card')).toHaveLength(8);
    expect(scenario.get('.semi-card-meta-wrapper-description').text()).toBe('全面、易用、优质');
    expect(scenario.findAll('.semi-card-body-actions-item')).toHaveLength(2);
    expect(scenario.find('.semi-skeleton-active').exists()).toBe(true);
    expect(scenario.get('.semi-card-group-grid').findAll('.semi-card')).toHaveLength(3);
    await scenario.findAll('.semi-card-body-actions-item button')[1]!.trigger('click');
    expect(scenario.get('output').text()).toBe('开始使用');
    wrapper.unmount();
  });

  it('通过公共 Calendar 渲染周视图、事件并支持模式切换', async () => {
    const wrapper = mount(App, {
      props: { scenarioId: 'calendar', locale: 'en-US', direction: 'ltr' },
    });
    const scenario = wrapper.get('[data-testid="calendar-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.get('.semi-calendar-week').attributes('data-parity-target')).toBe(
      'calendar-root',
    );
    expect(scenario.findAll('.semi-calendar-event-day')).toHaveLength(2);
    expect(scenario.get('.semi-calendar-all-day-tag').text()).toBe('All Day');
    await scenario.get('button[data-mode="day"]').trigger('click');
    expect(scenario.find('.semi-calendar-day').exists()).toBe(true);
    wrapper.unmount();
  });

  it('通过公共 Badge 渲染计数、圆点、溢出、自定义与事件场景', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'badge', direction: 'rtl' } });
    const scenario = wrapper.get('[data-testid="badge-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-badge')).toHaveLength(15);
    expect(scenario.get('[data-parity-target="badge-overflow"] .semi-badge-count').text()).toBe(
      '99+',
    );
    expect(scenario.find('.semi-badge-dot').exists()).toBe(true);
    expect(scenario.find('.semi-badge-custom').exists()).toBe(true);
    expect(scenario.find('.semi-badge-block').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="badge-root"] .semi-badge-count').classes()).toContain(
      'semi-badge-leftTop',
    );
    await scenario.get('[data-parity-target="badge-root"]').trigger('click');
    expect(scenario.get('output').text()).toBe('徽章已点击');
    wrapper.unmount();
  });

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

  it('通过公共 Breadcrumb 渲染图标、链接、折叠与受控激活场景', () => {
    const wrapper = mount(App, { props: { scenarioId: 'breadcrumb' } });
    const scenario = wrapper.get('[data-testid="breadcrumb-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-breadcrumb-wrapper')).toHaveLength(3);
    expect(scenario.find('.semi-icon-home').exists()).toBe(true);
    expect(scenario.find('.semi-breadcrumb-collapse').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="breadcrumb-loose"]').classes()).toContain(
      'semi-breadcrumb-wrapper-loose',
    );
    expect(
      scenario.get('[data-parity-target="breadcrumb-loose"] [aria-current="page"]').text(),
    ).toContain('当前页面');

    wrapper.unmount();
  });

  it('通过公共 Pagination 渲染截断、容量、快速跳页、small 与禁用场景', () => {
    const wrapper = mount(App, {
      props: { scenarioId: 'pagination', direction: 'rtl', locale: 'en-US' },
    });
    const scenario = wrapper.get('[data-testid="pagination-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-page')).toHaveLength(4);
    expect(
      scenario.get('[data-parity-target="pagination-basic"] [aria-current="page"]').text(),
    ).toBe('4');
    expect(scenario.find('.semi-page-switch').exists()).toBe(true);
    expect(scenario.find('.semi-page-quickjump').exists()).toBe(true);
    expect(scenario.find('.semi-page-small').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="pagination-disabled"]').classes()).toContain(
      'semi-page-disabled',
    );
    expect(scenario.get('.semi-page-total').text()).toBe('Total pages: 20');
    wrapper.unmount();
  });

  it('通过公共 Steps 渲染 fill/basic/vertical/nav 并闭环 change', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'steps' } });
    const scenario = wrapper.get('[data-testid="steps-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-steps')).toHaveLength(1);
    expect(scenario.findAll('.semi-steps-basic')).toHaveLength(2);
    expect(scenario.findAll('.semi-steps-nav')).toHaveLength(1);
    expect(scenario.get('[data-parity-target="steps-basic"]').classes()).toContain(
      'semi-steps-small',
    );
    expect(scenario.get('[data-parity-target="steps-vertical"]').classes()).toContain(
      'semi-steps-vertical',
    );
    await scenario
      .get('[data-parity-target="steps-basic"] .semi-steps-item:first-child')
      .trigger('click');
    expect(scenario.get('output').text()).toBe('Basic：0');
    wrapper.unmount();
  });

  it('通过公共 Tabs 渲染四类型、竖向、More、折叠并闭环 change', async () => {
    const wrapper = mount(App, { props: { scenarioId: 'tabs' } });
    const scenario = wrapper.get('[data-testid="tabs-vue"]');

    expect(wrapper.attributes('data-vue-status')).toBe('ready');
    expect(scenario.findAll('.semi-tabs')).toHaveLength(7);
    expect(scenario.find('.semi-tabs-bar-card').exists()).toBe(true);
    expect(scenario.find('.semi-tabs-bar-button').exists()).toBe(true);
    expect(scenario.find('.semi-tabs-bar-slash').exists()).toBe(true);
    expect(scenario.get('[data-parity-target="tabs-left"]').classes()).toContain('semi-tabs-left');
    expect(scenario.find('.semi-tabs-bar-more-trigger').exists()).toBe(true);
    expect(scenario.find('.semi-tabs-bar-collapse').exists()).toBe(true);
    await scenario
      .get('[data-parity-target="tabs-line"] [role="tab"]:nth-child(3)')
      .trigger('click');
    expect(scenario.get('output').text()).toBe('Line：line3');
    wrapper.unmount();
  });
});
