import FeedbackComponent from './Feedback.vue';

/** 保留 Feedback 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Feedback: typeof FeedbackComponent = FeedbackComponent;

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
