import { describe, expect, it, vi } from 'vitest';

import BaseComponent from './base-component';
import type { BaseProps } from './base';
import { isHTMLElement } from './component-utils';

describe('_base SSR', () => {
  it('没有 DOM global 时基础控制器和元素判定保持安全', async () => {
    vi.stubGlobal('HTMLElement', undefined);
    const controller = new BaseComponent<BaseProps & { 'data-ssr': string }>({
      props: { 'data-ssr': 'safe' },
    });
    await controller.setStateAsync({ ready: true });
    expect(controller.getDataAttr()).toEqual({ 'data-ssr': 'safe' });
    expect(isHTMLElement({})).toBe(false);
    vi.unstubAllGlobals();
  });
});
