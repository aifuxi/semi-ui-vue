import RadioBase from './Radio.vue';
import RadioGroupBase from './RadioGroup';

/** 保留 RadioCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type RadioCompoundComponent = typeof RadioBase & {
  Group: typeof RadioGroupBase;
};

/** 保留 RadioGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const RadioGroup: typeof RadioGroupBase = RadioGroupBase;
export const Radio = Object.assign(RadioBase, {
  Group: RadioGroup,
}) as unknown as RadioCompoundComponent;

export { RADIO_BUTTON_SIZES, RADIO_DIRECTIONS, RADIO_MODES, RADIO_TYPES } from './types';
export type {
  RadioButtonSize,
  RadioChangeEvent,
  RadioChangeTarget,
  RadioDirection,
  RadioDisplayMode,
  RadioEmits,
  RadioExposed,
  RadioGroupEmits,
  RadioGroupProps,
  RadioGroupSlots,
  RadioMode,
  RadioOption,
  RadioProps,
  RadioSlots,
  RadioType,
  RadioValue,
} from './types';

export default Radio;
