import type { DefineComponent } from 'vue';

import ChatBase from './Chat.vue';
import type { ChatProps } from './types';

export const Chat = ChatBase as unknown as DefineComponent<ChatProps>;
export { CHAT_ALIGNS, CHAT_MESSAGE_STATUSES, CHAT_MODES, CHAT_SEND_HOT_KEYS } from './types';
export type {
  ChatAlign,
  ChatBoxRenderConfig,
  ChatContentItem,
  ChatDefaultActionNodes,
  ChatEmits,
  ChatEnableUploadProps,
  ChatExposed,
  ChatFileContent,
  ChatFullBoxNodes,
  ChatImageContent,
  ChatInputChangePayload,
  ChatLocale,
  ChatMarkdownRenderProps,
  ChatMessage,
  ChatMessageStatus,
  ChatMode,
  ChatProps,
  ChatRenderActionProps,
  ChatRenderAvatarProps,
  ChatRenderContentProps,
  ChatRenderFullBoxProps,
  ChatRenderInputAreaProps,
  ChatRenderTitleProps,
  ChatRoleConfig,
  ChatRoleMetadata,
  ChatSendHotKey,
  ChatSlots,
  ChatTextContent,
} from './types';

export default Chat;
