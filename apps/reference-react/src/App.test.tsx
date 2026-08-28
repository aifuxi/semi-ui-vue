import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('React 参考工作台', () => {
  it('可以通过 Vitest 编译 TSX 并执行服务端渲染', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('Semi Design React 参考工作台');
    expect(html).toContain('v2.102.0');
  });

  it('按共享契约渲染场景元数据', () => {
    const html = renderToStaticMarkup(<App scenarioId="button-types" />);

    expect(html).toContain('data-parity-scenario="button-types"');
    expect(html).toContain('data-reference-status="ready"');
    expect(html).toContain('data-vue-status="ready"');
  });

  it('从固定 Divider Adapter 渲染完整参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="divider" />);

    expect(html).toContain('data-parity-scenario="divider"');
    expect(html).toContain('semi-divider-with-text-left');
    expect(html).toContain('这是居右文字');
  });

  it('从固定 Checkbox 与 Group Adapter 渲染单项、组与卡片场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="checkbox" />);

    expect(html).toContain('data-parity-scenario="checkbox"');
    expect(html).toContain('data-parity-target="checkbox-basic"');
    expect(html).toContain('semi-checkbox-indeterminate');
    expect(html).toContain('semi-checkboxGroup-horizontal');
    expect(html).toContain('semi-checkbox-cardType');
  });

  it('从固定 Input、InputGroup 与 TextArea Adapter 渲染完整参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="input" />);

    expect(html).toContain('data-parity-scenario="input"');
    expect(html).toContain('input-target-basic');
    expect(html).toContain('semi-input-modebtn');
    expect(html).toContain('semi-input-group-wrapper');
    expect(html).toContain('semi-input-textarea-counter');
    expect(html).toContain('semi-input-textarea-lineNumber');
  });

  it('从固定 InputNumber Adapter 渲染步进、货币与科学计数场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="input-number" />);

    expect(html).toContain('data-parity-scenario="input-number"');
    expect(html).toContain('semi-input-number-suffix-btns');
    expect(html).toContain('input-number-target-currency');
    expect(html).toContain('1.23456789012345e+14');
  });

  it('从固定 PinCode Adapter 渲染三种尺寸、混合码与禁用场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="pin-code" />);

    expect(html).toContain('data-parity-scenario="pin-code"');
    expect(html).toContain('pin-code-target-small');
    expect(html).toContain('semi-input-wrapper-large');
    expect(html).toContain('inputMode="text"');
    expect(html).toContain('disabled');
  });

  it('从固定 Radio Adapter 渲染单项、组合、按钮和卡片场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="radio" />);

    expect(html).toContain('data-parity-scenario="radio"');
    expect(html).toContain('data-parity-target="radio-basic"');
    expect(html).toContain('semi-radioGroup-buttonRadio');
    expect(html).toContain('semi-radio-cardRadioGroup');
    expect(html).toContain('semi-radio-inner-pureCardRadio');
  });

  it('从固定 Icon、稳定图标和 Lab 入口渲染完整参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="icon" />);

    expect(html).toContain('data-parity-scenario="icon"');
    expect(html).toContain('semi-icon-extra-large');
    expect(html).toContain('semi-icon-ai_wand_level_3');
    expect(html).toContain('semi-icon-avatar');
  });

  it('从固定 Space Adapter 渲染完整参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="space" />);

    expect(html).toContain('data-parity-scenario="space"');
    expect(html).toContain('semi-space-medium-horizontal');
    expect(html).toContain('semi-space-wrap');
    expect(html).toContain('semi-space-align-baseline');
  });

  it('从固定 FloatButton 与 Group Adapter 渲染完整参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="float-button" />);

    expect(html).toContain('data-parity-scenario="float-button"');
    expect(html).toContain('semi-floatButton-colorful');
    expect(html).toContain('semi-floatButton-disabled');
    expect(html).toContain('semi-floatButtonGroup-item');
    expect(html).toContain('99+');
  });

  it('从固定 Layout Adapter 渲染语义区块与 Sider 场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="layout" />);

    expect(html).toContain('data-parity-scenario="layout"');
    expect(html).toContain('semi-layout-has-sider');
    expect(html).toContain('semi-layout-sider-children');
    expect(html).toContain('<article');
  });

  it('从固定 Grid Adapter 渲染基础、Gutter、Flex 与响应式栅格', () => {
    const html = renderToStaticMarkup(<App scenarioId="grid" />);

    expect(html).toContain('data-parity-scenario="grid"');
    expect(html).toContain('semi-row-flex-space-between');
    expect(html).toContain('semi-col-lg-push-1');
    expect(html).toContain('padding-left:16px');
  });

  it('从固定 Resizable Adapter 渲染单体、组合面板与拖拽手柄', () => {
    const html = renderToStaticMarkup(<App scenarioId="resizable" />);

    expect(html).toContain('data-parity-scenario="resizable"');
    expect(html).toContain('semi-resizable-resizable');
    expect(html).toContain('semi-resizable-group');
    expect(html).toContain('semi-resizable-item');
    expect(html).toContain('semi-resizable-handler');
  });

  it('从固定 Typography Adapter 渲染标题、文本、段落、数值与复制', () => {
    const html = renderToStaticMarkup(<App scenarioId="typography" />);

    expect(html).toContain('data-parity-scenario="typography"');
    expect(html).toContain('semi-typography-h2');
    expect(html).toContain('semi-typography-paragraph');
    expect(html).toContain('1.50 KiB');
    expect(html).toContain('semi-typography-action-copy');
  });

  it('从固定 ConfigProvider 渲染 RTL、Consumer、Locale 与嵌套配置', () => {
    const html = renderToStaticMarkup(<App scenarioId="config-provider" />);

    expect(html).toContain('data-parity-scenario="config-provider"');
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('direction: rtl');
    expect(html).toContain('locale: en-US');
    expect(html).toContain('nested: ltr');
    expect(html).toContain('semi-typography-action-copy');
  });

  it('从固定 Switch Adapter 渲染尺寸、文本、禁用与加载状态', () => {
    const html = renderToStaticMarkup(<App scenarioId="switch" />);

    expect(html).toContain('data-parity-scenario="switch"');
    expect(html).toContain('semi-switch-small');
    expect(html).toContain('semi-switch-large');
    expect(html).toContain('semi-switch-disabled');
    expect(html).toContain('semi-switch-loading');
    expect(html).toContain('semi-spin-wrapper');
    expect(html).toContain('role="switch"');
  });

  it('从固定 Tooltip Adapter 渲染方位、ARIA 与特殊 trigger 场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="tooltip" />);

    expect(html).toContain('data-parity-scenario="tooltip"');
    expect(html).toContain('data-parity-target="tooltip-trigger-top"');
    expect(html).toContain('aria-describedby="tooltip-top"');
    expect(html).toContain('data-popupid="tooltip-right"');
    expect(html).toContain('tooltip-disabled-wrapper');
  });

  it('从固定 Select Adapter 渲染单选、多选、禁用与分组搜索场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="select" />);

    expect(html).toContain('data-parity-scenario="select"');
    expect(html).toContain('data-parity-target="select-basic"');
    expect(html).toContain('semi-select-disabled');
    expect(html).toContain('semi-select-multiple');
    expect(html).toContain('select-filter');
  });

  it('从固定 Slider Adapter 渲染单值、范围、刻度、禁用与纵向场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="slider" />);

    expect(html).toContain('data-parity-scenario="slider"');
    expect(html).toContain('data-parity-target="slider-basic"');
    expect(html).toContain('semi-slider-disabled');
    expect(html).toContain('semi-slider-mark');
    expect(html).toContain('semi-slider-vertical-wrapper');
    expect(html.match(/role="slider"/g)).toHaveLength(7);
  });

  it('从固定 TagInput Adapter 渲染标签、尺寸、校验、折叠与前后缀场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="tag-input" />);

    expect(html).toContain('data-parity-scenario="tag-input"');
    expect(html).toContain('data-parity-target="tag-input-basic"');
    expect(html).toContain('semi-tagInput-small');
    expect(html).toContain('semi-tagInput-disabled');
    expect(html).toContain('semi-tagInput-warning');
    expect(html).toContain('semi-tagInput-wrapper-n');
    expect(html).toContain('+2');
  });

  it('从固定 TimePicker Adapter 渲染单值、范围、尺寸、禁用与十二小时制场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="time-picker" />);

    expect(html).toContain('data-parity-scenario="time-picker"');
    expect(html).toContain('data-parity-target="time-picker-basic"');
    expect(html).toContain('semi-input-wrapper-small');
    expect(html).toContain('semi-input-wrapper-large');
    expect(html).toContain('semi-input-wrapper-disabled');
    expect(html).toContain('data-type="timeRange"');
    expect(html).toContain('data-use-12-hours="true"');
  });

  it('从固定 Anchor Adapter 渲染尺寸、嵌套、禁用与滚动容器场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="anchor" />);

    expect(html).toContain('data-parity-scenario="anchor"');
    expect(html).toContain('data-testid="anchor-reference"');
    expect(html).toContain('data-parity-target="anchor-default"');
    expect(html).toContain('anchor-target-api');
    expect(html).toContain('semi-anchor-link-title-disabled');
    expect(html).toContain('anchor-target-small');
  });

  it('渲染 Avatar 尺寸、图片、Group 与装饰参考场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="avatar" />);

    expect(html).toContain('data-parity-scenario="avatar"');
    expect(html).toContain('data-testid="avatar-reference"');
    expect(html).toContain('semi-avatar-extra-extra-small');
    expect(html).toContain('semi-avatar-item-more');
    expect(html).toContain('semi-avatar-top_slot-content');
    expect(html).toContain('semi-avatar-bottom_slot');
  });

  it('从固定 BackTop Adapter 渲染 Element target、默认与自定义场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="back-top" />);

    expect(html).toContain('data-parity-scenario="back-top"');
    expect(html).toContain('data-testid="back-top-reference"');
    expect(html).toContain('data-parity-target="back-top-default"');
    expect(html).toContain('data-parity-target="back-top-custom"');
    expect(html).toContain('TOP');
  });

  it('从固定 Breadcrumb Adapter 渲染图标、链接与受控激活场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="breadcrumb" />);

    expect(html).toContain('data-parity-scenario="breadcrumb"');
    expect(html).toContain('data-testid="breadcrumb-reference"');
    expect(html).toContain('data-parity-target="breadcrumb-basic"');
    expect(html).toContain('semi-breadcrumb-wrapper-loose');
    expect(html).toContain('aria-current="page"');
  });

  it('从固定 Pagination Adapter 渲染截断、容量、快速跳页、small 与禁用场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="pagination" locale="en-US" />);

    expect(html).toContain('data-parity-scenario="pagination"');
    expect(html).toContain('data-testid="pagination-reference"');
    expect(html).toContain('data-parity-target="pagination-basic"');
    expect(html).toContain('semi-page-switch');
    expect(html).toContain('semi-page-quickjump');
    expect(html).toContain('semi-page-small');
  });

  it('从固定 Steps Adapter 渲染 fill/basic/vertical/nav 场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="steps" />);

    expect(html).toContain('data-parity-scenario="steps"');
    expect(html).toContain('data-testid="steps-reference"');
    expect(html).toContain('data-parity-target="steps-fill"');
    expect(html).toContain('semi-steps-basic');
    expect(html).toContain('semi-steps-vertical');
    expect(html).toContain('semi-steps-nav');
  });

  it('从固定 Tabs Adapter 渲染四类型、竖向、More 与折叠场景', () => {
    const html = renderToStaticMarkup(<App scenarioId="tabs" />);

    expect(html).toContain('data-parity-scenario="tabs"');
    expect(html).toContain('data-testid="tabs-reference"');
    expect(html).toContain('data-parity-target="tabs-line"');
    expect(html).toContain('semi-tabs-bar-card');
    expect(html).toContain('semi-tabs-bar-button');
    expect(html).toContain('semi-tabs-bar-slash');
    expect(html).toContain('semi-tabs-left');
  });
});
