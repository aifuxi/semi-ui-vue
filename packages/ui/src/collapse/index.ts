import type { DefineComponent } from 'vue';

import CollapseBase from './Collapse.vue';
import CollapsePanelBase from './CollapsePanel.vue';
import type { CollapsePanelProps, CollapseProps } from './types';

export type CollapseCompoundComponent = DefineComponent<CollapseProps> & {
  Panel: DefineComponent<CollapsePanelProps>;
};

export const CollapsePanel = CollapsePanelBase as unknown as DefineComponent<CollapsePanelProps>;
export const Collapse = Object.assign(CollapseBase, {
  Panel: CollapsePanel,
}) as unknown as CollapseCompoundComponent;

export { COLLAPSE_ICON_POSITIONS } from './types';
export type {
  CollapseActiveKey,
  CollapseEmits,
  CollapseIconPosition,
  CollapsePanelEmits,
  CollapsePanelProps,
  CollapsePanelSlots,
  CollapseProps,
  CollapseSlots,
  CollapseState,
} from './types';

export default Collapse;
