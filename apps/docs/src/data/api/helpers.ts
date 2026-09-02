import type { ApiItem } from './types';

export function apiItem(
  name: string,
  type: string,
  defaultValue: string | undefined,
  zh: string,
  en: string,
): ApiItem {
  return {
    name,
    type,
    ...(defaultValue === undefined ? {} : { defaultValue }),
    description: { 'zh-CN': zh, 'en-US': en },
  };
}
