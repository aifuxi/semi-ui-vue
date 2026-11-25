import type { InjectionKey, MaybeRef } from 'vue';

import type { TypographyLocale } from './types';

export const DEFAULT_TYPOGRAPHY_LOCALE: Readonly<TypographyLocale> = Object.freeze({
  copy: '复制',
  copied: '复制成功',
  copyFailed: '复制失败',
  expand: '展开',
  collapse: '收起',
});

export const EN_US_TYPOGRAPHY_LOCALE: Readonly<TypographyLocale> = Object.freeze({
  copy: 'Copy',
  copied: 'Copied',
  copyFailed: 'Copy failed',
  expand: 'Expand',
  collapse: 'Collapse',
});

export const typographyLocaleKey: InjectionKey<MaybeRef<TypographyLocale>> =
  Symbol('typographyLocale');
