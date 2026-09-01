import {
  chatCompletionToMessage as foundationChatCompletionToMessage,
  chatInputToChatCompletion as foundationChatInputToChatCompletion,
  chatInputToMessage as foundationChatInputToMessage,
  messageToChatInput as foundationMessageToChatInput,
  responseToMessage as foundationResponseToMessage,
  streamingChatCompletionToMessage as foundationStreamingChatCompletionToMessage,
  streamingResponseToMessage as foundationStreamingResponseToMessage,
} from '@workspace/foundation-integration';

import type { ContentItem, Message } from './types';
import type { MessageContent } from '../ai-chat-input';

export interface ChatCompletion {
  id?: string;
  created?: number;
  model?: string;
  choices?: Array<{
    index?: number;
    message?: Record<string, unknown>;
    finish_reason?: string;
  }>;
  [key: string]: unknown;
}
export interface ChatCompletionChunk {
  id?: string;
  created?: number;
  model?: string;
  choices?: Array<{ index?: number; delta?: Record<string, unknown>; finish_reason?: string }>;
  [key: string]: unknown;
}
export interface Response {
  id?: string;
  created_at?: number;
  model?: string;
  output?: ContentItem | ContentItem[];
  output_text?: string;
  status?: string;
  [key: string]: unknown;
}
export interface ResponseChunk {
  type?: string;
  sequence_number?: number;
  response?: Response;
  item?: ContentItem;
  delta?: string;
  [key: string]: unknown;
}
export interface StreamingChatState {
  choices?: Map<number, unknown>;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}
export interface StreamingResponseState {
  processedSeq: Set<number>;
  outputs: Map<number, ContentItem | null>;
  meta: Record<string, unknown>;
  buffer: Map<number, ResponseChunk>;
  lastProcessedSeq: number;
  [key: string]: unknown;
}
export interface ChatCompletionInput {
  messages?: Array<Record<string, unknown>>;
  model?: string;
  [key: string]: unknown;
}
export type AIChatDialogueMessageContent = MessageContent;

export function chatCompletionToMessage(input: ChatCompletion): Message[] {
  return foundationChatCompletionToMessage(input) as Message[];
}
export function streamingChatCompletionToMessage(
  chunks: ChatCompletionChunk[],
  state?: StreamingChatState,
): { messages: Message[]; state?: StreamingChatState } {
  return foundationStreamingChatCompletionToMessage(chunks, state) as {
    messages: Message[];
    state?: StreamingChatState;
  };
}
export function responseToMessage(input: Response): Message {
  return foundationResponseToMessage(input) as Message;
}
export function streamingResponseToMessage(
  chunks: ResponseChunk[],
  state?: StreamingResponseState,
): { messages: Message[]; state?: StreamingResponseState } {
  return foundationStreamingResponseToMessage(chunks, state) as {
    messages: Message[];
    state?: StreamingResponseState;
  };
}
export function chatInputToMessage(input: AIChatDialogueMessageContent): Message {
  return foundationChatInputToMessage(input) as Message;
}
export function chatInputToChatCompletion(
  input: AIChatDialogueMessageContent,
): ChatCompletionInput {
  return foundationChatInputToChatCompletion(input) as ChatCompletionInput;
}
export function messageToChatInput(input: Message): AIChatDialogueMessageContent {
  return foundationMessageToChatInput(input) as AIChatDialogueMessageContent;
}
