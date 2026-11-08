import TimelineBase from './Timeline.vue';
import TimelineItemBase from './TimelineItem.vue';

/** 保留 TimelineCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type TimelineCompoundComponent = typeof TimelineBase & {
  Item: typeof TimelineItemBase;
};

/** 保留 TimelineItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TimelineItem: typeof TimelineItemBase = TimelineItemBase;
export const Timeline = Object.assign(TimelineBase, {
  Item: TimelineItem,
}) as unknown as TimelineCompoundComponent;

export { TIMELINE_ITEM_POSITIONS, TIMELINE_ITEM_TYPES, TIMELINE_MODES } from './types';
export type {
  TimelineData,
  TimelineItemEmits,
  TimelineItemPosition,
  TimelineItemProps,
  TimelineItemSlots,
  TimelineItemType,
  TimelineMode,
  TimelineProps,
  TimelineSlots,
} from './types';

export default Timeline;
