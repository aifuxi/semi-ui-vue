import StepBase from './Step.vue';
import StepsBase from './Steps.vue';

/** 保留 StepsCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type StepsCompoundComponent = typeof StepsBase & {
  Step: typeof StepBase;
};

/** 保留 Step 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Step: typeof StepBase = StepBase;
export const Steps = Object.assign(StepsBase, { Step }) as unknown as StepsCompoundComponent;

export default Steps;
export type {
  StepEmits,
  StepProps,
  StepSlots,
  StepsDirection,
  StepsEmits,
  StepsProps,
  StepsSize,
  StepsSlots,
  StepsStatus,
  StepsType,
} from './types';
