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
    expect(html).toContain('data-vue-status="pending"');
  });
});
