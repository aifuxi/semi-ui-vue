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
});
