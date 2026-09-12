import { describe, expect, it } from '@rstest/core';

import copy from './fastCopy';

describe('参考运行时 Date 复制', () => {
  it('保留 Form 日期初始值并隔离副本修改', () => {
    const initialValue = new Date('2024-08-15T10:24:30+08:00');
    const copiedValue = copy(initialValue);

    expect(copiedValue).toBeInstanceOf(Date);
    expect(copiedValue.getTime()).toBe(initialValue.getTime());
    copiedValue.setDate(16);
    expect(initialValue.toISOString()).toBe('2024-08-15T02:24:30.000Z');
  });

  it('保留无效日期，让 DatePicker 继续按原契约拒绝输入', () => {
    const copiedValue = copy(new Date(Number.NaN));

    expect(copiedValue).toBeInstanceOf(Date);
    expect(Number.isNaN(copiedValue.getTime())).toBe(true);
  });
});
