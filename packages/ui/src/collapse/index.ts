import CollapseBase from './Collapse.vue';
import CollapsePanelBase from './CollapsePanel.vue';

/** 保留 CollapseCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type CollapseCompoundComponent = typeof CollapseBase & {
  Panel: typeof CollapsePanelBase;
};

/** 保留 CollapsePanel 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const CollapsePanel: typeof CollapsePanelBase = CollapsePanelBase;
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
