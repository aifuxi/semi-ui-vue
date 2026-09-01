// Keep the pinned AIChatDialogue pure data adapters behind this private boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export {
  chatCompletionToMessage,
  chatInputToChatCompletion,
  chatInputToMessage,
  messageToChatInput,
  responseToMessage,
  streamingChatCompletionToMessage,
  streamingResponseToMessage,
} from '../../../vendor/semi-design/packages/semi-foundation/aiChatDialogue/dataAdapter/index';
// @ts-expect-error -- public declarations expose a local facade instead of these vendor paths.
export {
  cssClasses as aiChatDialogueCssClasses,
  strings as aiChatDialogueStrings,
} from '../../../vendor/semi-design/packages/semi-foundation/aiChatDialogue/constants';
