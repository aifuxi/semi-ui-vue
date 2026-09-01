import type { DefineComponent } from 'vue';

import AIChatDialogueBase from './AIChatDialogue.vue';
import AIChatDialogueAnnotationBase from './AIChatDialogueAnnotation.vue';
import AIChatDialogueCodeBase from './AIChatDialogueCode';
import AIChatDialogueReasoningBase from './AIChatDialogueReasoning.vue';
import AIChatDialogueStepBase from './AIChatDialogueStep.vue';
import type {
  AIChatDialogueProps,
  AIChatDialogueReasoningProps,
  AIChatDialogueStatic,
} from './types';

export const AIChatDialogueAnnotation = AIChatDialogueAnnotationBase;
export const AIChatDialogueCode = AIChatDialogueCodeBase;
export const AIChatDialogueReasoning =
  AIChatDialogueReasoningBase as unknown as DefineComponent<AIChatDialogueReasoningProps>;
export const AIChatDialogueStep = AIChatDialogueStepBase;
export const AIChatDialogue = Object.assign(
  AIChatDialogueBase as unknown as DefineComponent<AIChatDialogueProps>,
  {
    Annotation: AIChatDialogueAnnotation,
    Reasoning: AIChatDialogueReasoning,
    Step: AIChatDialogueStep,
    defaultComponents: { code: AIChatDialogueCode },
  },
) as unknown as AIChatDialogueStatic;

export * from './data-adapter';
export type * from './types';
export default AIChatDialogue;
