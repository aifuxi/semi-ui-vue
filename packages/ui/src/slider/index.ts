import SliderBase from './Slider.vue';

/** 保留 Slider 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Slider: typeof SliderBase = SliderBase;

export type {
  SliderEmits,
  SliderHandleDot,
  SliderMarks,
  SliderProps,
  SliderState,
  SliderValue,
} from './types';

export default Slider;
