import type { DefineComponent } from 'vue';

import FeedbackComponent from './Feedback.vue';
import type { FeedbackProps } from './types';

export const Feedback = FeedbackComponent as unknown as DefineComponent<FeedbackProps>;

export { FEEDBACK_EMOJIS, FEEDBACK_MODES, FEEDBACK_TYPES } from './types';
export type {
  FeedbackActionHandler,
  FeedbackActionResult,
  FeedbackButtonProps,
  FeedbackCheckboxGroupProps,
  FeedbackEmoji,
  FeedbackEmojiResult,
  FeedbackEmits,
  FeedbackLocale,
  FeedbackMode,
  FeedbackProps,
  FeedbackRadioGroupProps,
  FeedbackSlots,
  FeedbackTextAreaProps,
  FeedbackType,
  FeedbackValue,
} from './types';

export default Feedback;
