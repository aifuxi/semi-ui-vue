import type { DefineComponent } from 'vue';

import SliderBase from './Slider.vue';
import type { SliderProps } from './types';

export const Slider = SliderBase as unknown as DefineComponent<SliderProps>;

export type {
  SliderEmits,
  SliderHandleDot,
  SliderMarks,
  SliderProps,
  SliderState,
  SliderValue,
} from './types';

export default Slider;
