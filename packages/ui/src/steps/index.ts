import type { DefineComponent } from 'vue';

import StepBase from './Step.vue';
import StepsBase from './Steps.vue';
import type { StepProps, StepsProps } from './types';

export type StepsCompoundComponent = DefineComponent<StepsProps> & {
  Step: DefineComponent<StepProps>;
};

export const Step = StepBase as unknown as DefineComponent<StepProps>;
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
