import CascaderBase from './Cascader.vue';

/** 保留 CascaderComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type CascaderComponent = typeof CascaderBase;
export const Cascader = CascaderBase as unknown as CascaderComponent;

export type {
  CascaderCheckRelation,
  CascaderData,
  CascaderEmits,
  CascaderEntity,
  CascaderExposed,
  CascaderFilterData,
  CascaderFilterRenderProps,
  CascaderKeyMaps,
  CascaderProps,
  CascaderScrollPanelProps,
  CascaderSearchPosition,
  CascaderShowNext,
  CascaderSimpleValue,
  CascaderSize,
  CascaderSlots,
  CascaderTriggerRenderProps,
  CascaderValidateStatus,
  CascaderValue,
  CascaderVirtualize,
} from './types';

export default Cascader;
