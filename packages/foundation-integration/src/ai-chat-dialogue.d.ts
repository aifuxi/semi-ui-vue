export declare const chatCompletionToMessage: (input: unknown) => unknown;
export declare const streamingChatCompletionToMessage: (
  input: unknown[],
  state?: unknown,
) => unknown;
export declare const responseToMessage: (input: unknown) => unknown;
export declare const streamingResponseToMessage: (input: unknown[], state?: unknown) => unknown;
export declare const chatInputToMessage: (input: unknown) => unknown;
export declare const chatInputToChatCompletion: (input: unknown) => unknown;
export declare const messageToChatInput: (input: unknown) => unknown;
export declare const aiChatDialogueCssClasses: Record<string, string>;
export declare const aiChatDialogueStrings: Record<string, unknown>;
