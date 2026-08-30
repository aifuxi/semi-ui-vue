import type { DefineComponent } from 'vue';

import CascaderBase from './Cascader.vue';
import type { CascaderExposed, CascaderProps } from './types';

export type CascaderComponent = DefineComponent<CascaderProps, CascaderExposed>;
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
