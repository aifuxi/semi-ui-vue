import { describe, expect, it, rs } from '@rstest/core';

import {
  getActiveElement,
  getFocusableElements,
  getScrollbarWidth,
  registerMediaQuery,
} from './index';
import { resolveDOM } from './vue-render';

describe('_utils SSR', () => {
  it('没有 browser globals 时 DOM 工具走安全分支', () => {
    rs.stubGlobal('window', undefined);
    rs.stubGlobal('document', undefined);
    rs.stubGlobal('HTMLElement', undefined);
    rs.stubGlobal('Element', undefined);
    expect(getActiveElement()).toBeNull();
    expect(getScrollbarWidth()).toBe(0);
    expect(getFocusableElements({} as HTMLElement)).toEqual([]);
    expect(resolveDOM({})).toBeNull();
    expect(registerMediaQuery('(ssr)', {})).toBeTypeOf('function');
    rs.unstubAllGlobals();
  });
});
