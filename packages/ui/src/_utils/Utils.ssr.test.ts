import { describe, expect, it, vi } from 'vitest';

import {
  getActiveElement,
  getFocusableElements,
  getScrollbarWidth,
  registerMediaQuery,
} from './index';
import { resolveDOM } from './vue-render';

describe('_utils SSR', () => {
  it('没有 browser globals 时 DOM 工具走安全分支', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('HTMLElement', undefined);
    vi.stubGlobal('Element', undefined);
    expect(getActiveElement()).toBeNull();
    expect(getScrollbarWidth()).toBe(0);
    expect(getFocusableElements({} as HTMLElement)).toEqual([]);
    expect(resolveDOM({})).toBeNull();
    expect(registerMediaQuery('(ssr)', {})).toBeTypeOf('function');
    vi.unstubAllGlobals();
  });
});
