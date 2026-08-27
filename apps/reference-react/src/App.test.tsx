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
});
