import ChatBase from './Chat.vue';

/** 保留 Chat 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Chat: typeof ChatBase = ChatBase;
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
