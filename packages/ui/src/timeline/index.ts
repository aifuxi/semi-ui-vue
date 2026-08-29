import type { DefineComponent } from 'vue';

import TimelineBase from './Timeline.vue';
import TimelineItemBase from './TimelineItem.vue';
import type { TimelineItemProps, TimelineProps } from './types';

export type TimelineCompoundComponent = DefineComponent<TimelineProps> & {
  Item: DefineComponent<TimelineItemProps>;
};

export const TimelineItem = TimelineItemBase as unknown as DefineComponent<TimelineItemProps>;
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
