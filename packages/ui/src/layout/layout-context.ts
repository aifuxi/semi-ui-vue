import type { InjectionKey } from 'vue';

export interface LayoutSiderHook {
  addSider: (id: string) => void;
  removeSider: (id: string) => void;
}

export const layoutSiderHookKey: InjectionKey<LayoutSiderHook> = Symbol('layout-sider-hook');
