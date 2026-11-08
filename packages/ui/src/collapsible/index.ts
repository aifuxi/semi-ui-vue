import CollapsibleBase from './Collapsible.vue';

/** 保留 Collapsible 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Collapsible: typeof CollapsibleBase = CollapsibleBase;

export type {
  CollapsibleEmits,
  CollapsibleProps,
  CollapsibleSlots,
  CollapsibleState,
} from './types';

export default Collapsible;
