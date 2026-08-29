import type { DefineComponent } from 'vue';

import ProgressBase from './Progress.vue';
import type { ProgressProps } from './types';

export const Progress = ProgressBase as unknown as DefineComponent<ProgressProps>;

export {
  PROGRESS_DIRECTIONS,
  PROGRESS_SIZES,
  PROGRESS_STROKE_LINECAPS,
  PROGRESS_TYPES,
} from './types';
export type {
  ProgressDirection,
  ProgressMotion,
  ProgressMotionObject,
  ProgressProps,
  ProgressSize,
  ProgressSlots,
  ProgressStrokeLinecap,
  ProgressStrokePoint,
  ProgressType,
} from './types';

export default Progress;
