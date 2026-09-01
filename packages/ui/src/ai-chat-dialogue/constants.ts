export const AI_CHAT_DIALOGUE_PREFIX = 'semi-ai-chat-dialogue';

export const AI_CHAT_DIALOGUE_STATUS = {
  queued: 'queued',
  inProgress: 'in_progress',
  incomplete: 'incomplete',
  completed: 'completed',
  failed: 'failed',
  cancelled: 'cancelled',
} as const;

export const AI_CHAT_DIALOGUE_ITEM_TYPE = {
  message: 'message',
  outputText: 'output_text',
  refusal: 'refusal',
  functionCall: 'function_call',
  customToolCall: 'custom_tool_call',
  mcpCall: 'mcp_call',
  reasoning: 'reasoning',
  inputText: 'input_text',
  inputImage: 'input_image',
  inputFile: 'input_file',
} as const;

export const AI_CHAT_DIALOGUE_SCROLL_GAP = 100;
export const AI_CHAT_DIALOGUE_SCROLL_DURATION = 300;
