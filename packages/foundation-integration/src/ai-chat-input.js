// Keep the pinned AIChatInput state machine and pure helpers behind this private boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export { default as AIChatInputFoundation } from '../../../vendor/semi-design/packages/semi-foundation/aiChatInput/foundation';
// @ts-expect-error -- public declarations expose a local facade instead of these vendor paths.
export {
  getAttachmentType,
  getContentType,
  getCustomSlotAttribute,
  getSkillSlotString,
  isImageType,
  transformJSONResult,
} from '../../../vendor/semi-design/packages/semi-foundation/aiChatInput/utils';
// @ts-expect-error -- pinned constants are compiled only through this private boundary.
export {
  cssClasses as aiChatInputCssClasses,
  numbers as aiChatInputNumbers,
  strings as aiChatInputStrings,
} from '../../../vendor/semi-design/packages/semi-foundation/aiChatInput/constants';
