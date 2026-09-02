export type ApiKind = 'props' | 'emits' | 'slots' | 'methods' | 'components';

export interface ApiItem {
  name: string;
  type: string;
  defaultValue?: string;
  description: { 'zh-CN': string; 'en-US': string };
}

export interface ApiSection {
  id: string;
  title: { 'zh-CN': string; 'en-US': string };
  kind: ApiKind;
  items: readonly ApiItem[];
}
