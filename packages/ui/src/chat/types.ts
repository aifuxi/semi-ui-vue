import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

import type { UploadFileItem, UploadProps } from '../upload';

export const CHAT_ALIGNS = ['leftRight', 'leftAlign'] as const;
export const CHAT_MODES = ['bubble', 'noBubble', 'userBubble'] as const;
export const CHAT_SEND_HOT_KEYS = ['enter', 'shift+enter'] as const;
export const CHAT_MESSAGE_STATUSES = ['loading', 'incomplete', 'complete', 'error'] as const;

export type ChatAlign = (typeof CHAT_ALIGNS)[number];
export type ChatMode = (typeof CHAT_MODES)[number];
export type ChatSendHotKey = (typeof CHAT_SEND_HOT_KEYS)[number];
export type ChatMessageStatus = (typeof CHAT_MESSAGE_STATUSES)[number];

export interface ChatTextContent {
  type: 'text';
  text?: string;
}
export interface ChatImageContent {
  type: 'image_url';
  image_url: { url: string; [key: string]: unknown };
}
export interface ChatFileContent {
  type: 'file_url';
  file_url: { url: string; name: string; size: string; type: string; [key: string]: unknown };
}
export type ChatContentItem = ChatTextContent | ChatImageContent | ChatFileContent;

export interface ChatMessage {
  role?: string;
  name?: string;
  id?: string | number;
  content?: string | ChatContentItem[];
  parentId?: string;
  createAt?: number;
  status?: ChatMessageStatus;
  like?: boolean;
  dislike?: boolean;
  [key: string]: unknown;
}

export interface ChatRoleMetadata {
  name?: string;
  avatar?: string | VNodeChild;
  color?: string;
  [key: string]: unknown;
}
export interface ChatRoleConfig {
  user?: ChatRoleMetadata;
  assistant?: ChatRoleMetadata;
  system?: ChatRoleMetadata;
  [role: string]: ChatRoleMetadata | undefined;
}

export interface ChatEnableUploadProps {
  pasteUpload?: boolean;
  dragUpload?: boolean;
  clickUpload?: boolean;
}

export interface ChatMarkdownRenderProps {
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
  [key: string]: unknown;
}

export interface ChatRenderTitleProps {
  message?: ChatMessage;
  role?: ChatRoleMetadata;
  defaultTitle?: VNodeChild;
}
export interface ChatRenderAvatarProps {
  message?: ChatMessage;
  role?: ChatRoleMetadata;
  defaultAvatar?: VNodeChild;
}
export interface ChatRenderContentProps {
  message?: ChatMessage;
  role?: ChatRoleMetadata;
  defaultContent?: VNodeChild;
  className?: string;
}
export interface ChatDefaultActionNodes {
  copyNode?: VNodeChild;
  likeNode?: VNodeChild;
  dislikeNode?: VNodeChild;
  resetNode?: VNodeChild;
  deleteNode?: VNodeChild;
}
export interface ChatRenderActionProps {
  message?: ChatMessage;
  defaultActions?: VNodeChild;
  className: string;
  defaultActionsObj?: ChatDefaultActionNodes;
}
export interface ChatFullBoxNodes {
  avatar?: VNodeChild;
  title?: VNodeChild;
  content?: VNodeChild;
  action?: VNodeChild;
}
export interface ChatRenderFullBoxProps {
  message?: ChatMessage;
  role?: ChatRoleMetadata;
  defaultNodes?: ChatFullBoxNodes;
  className: string;
}
export interface ChatBoxRenderConfig {
  renderChatBoxTitle?: ((props: ChatRenderTitleProps) => VNodeChild) | undefined;
  renderChatBoxAvatar?: ((props: ChatRenderAvatarProps) => VNodeChild) | undefined;
  renderChatBoxContent?: ((props: ChatRenderContentProps) => VNodeChild) | undefined;
  renderChatBoxAction?: ((props: ChatRenderActionProps) => VNodeChild) | undefined;
  renderFullChatBox?: ((props: ChatRenderFullBoxProps) => VNodeChild) | undefined;
}

export interface ChatRenderInputAreaProps {
  defaultNode?: VNodeChild;
  onSend?: (content?: string, attachment?: UploadFileItem[]) => void;
  onClear?: (event?: Event) => void;
  detailProps?: {
    clearContextNode?: VNodeChild;
    uploadNode?: VNodeChild;
    inputNode?: VNodeChild;
    sendNode?: VNodeChild;
    onClick?: (event?: MouseEvent) => void;
  };
}

export interface ChatProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'onInput' | 'onChange'> {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: CSSProperties;
  align?: ChatAlign;
  mode?: ChatMode;
  chats?: ChatMessage[];
  canSend?: boolean;
  hints?: string[];
  roleConfig?: ChatRoleConfig;
  chatBoxRenderConfig?: ChatBoxRenderConfig;
  customMarkDownComponents?: Record<string, unknown>;
  markdownRenderProps?: ChatMarkdownRenderProps;
  escapeHtml?: boolean;
  enableUpload?: boolean | ChatEnableUploadProps;
  uploadProps?: Partial<UploadProps>;
  uploadTipProps?: Record<string, unknown>;
  renderHintBox?: (props: {
    content: string;
    index: number;
    onHintClick: () => void;
  }) => VNodeChild;
  renderDivider?: (message?: ChatMessage) => VNodeChild;
  renderInputArea?: (props: ChatRenderInputAreaProps) => VNodeChild;
  topSlot?: VNodeChild;
  bottomSlot?: VNodeChild;
  showStopGenerate?: boolean;
  showClearContext?: boolean;
  sendHotKey?: ChatSendHotKey;
  placeholder?: string;
  inputBoxStyle?: CSSProperties;
  inputBoxCls?: string;
  hintStyle?: CSSProperties;
  hintCls?: string;
}

export interface ChatInputChangePayload {
  inputValue: string;
  attachment: UploadFileItem[];
}

export interface ChatEmits {
  'update:chats': [chats: ChatMessage[]];
  'chats-change': [chats: ChatMessage[]];
  'message-delete': [message?: ChatMessage];
  'message-reset': [message?: ChatMessage];
  'message-copy': [message?: ChatMessage];
  'message-good-feedback': [message?: ChatMessage];
  'message-bad-feedback': [message?: ChatMessage];
  'message-send': [content: string, attachment: UploadFileItem[]];
  'input-change': [payload: ChatInputChangePayload];
  'hint-click': [hint: string];
  clear: [];
  'stop-generator': [event?: Event];
}

export interface ChatSlots {
  top?: () => VNodeChild;
  bottom?: () => VNodeChild;
  hint?: (props: { content: string; index: number; onHintClick: () => void }) => VNodeChild;
  divider?: (props: { message: ChatMessage }) => VNodeChild;
  'input-area'?: (props: ChatRenderInputAreaProps) => VNodeChild;
  'chat-box-title'?: (props: ChatRenderTitleProps) => VNodeChild;
  'chat-box-avatar'?: (props: ChatRenderAvatarProps) => VNodeChild;
  'chat-box-content'?: (props: ChatRenderContentProps) => VNodeChild;
  'chat-box-action'?: (props: ChatRenderActionProps) => VNodeChild;
  'chat-box'?: (props: ChatRenderFullBoxProps) => VNodeChild;
}

export interface ChatLocale {
  deleteConfirm?: string;
  clearContext?: string;
  copySuccess?: string;
  stop?: string;
  copy?: string;
  copied?: string;
  dropAreaText?: string;
}

export interface ChatExposed {
  resetMessage(): void;
  clearContext(): void;
  scrollToBottom(animation?: boolean): void;
  sendMessage(content: string, attachment?: UploadFileItem[]): void;
  getContainerElement(): HTMLDivElement | null;
}
