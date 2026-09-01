import type { CSSProperties, Component, VNodeChild } from 'vue';

import type { MarkdownRenderProps as BaseMarkdownRenderProps } from '../markdown-render';

export interface CommonContentItem {
  id?: string;
  type?: string;
  status?: string;
  role?: string;
}

export interface InputText extends CommonContentItem {
  text?: string;
}

export interface InputImage extends CommonContentItem {
  detail?: string;
  file_id?: string;
  image_url?: string;
}

export interface InputFile extends CommonContentItem {
  file_id?: string;
  file_data?: string;
  file_url?: string;
  filename?: string;
  size?: string;
  file_type?: string;
  fileInstance?: { type?: string; [key: string]: unknown };
}

export interface InputAudio extends CommonContentItem {
  input_audio?: { data?: string; format?: string };
}

export interface InputMessage extends CommonContentItem {
  content?: string | Array<InputText | InputImage | InputFile | InputAudio>;
}

export interface ItemReference extends CommonContentItem {
  file_id?: string;
}

export interface URLCitation extends CommonContentItem {
  end_index?: number;
  start_index?: number;
  title?: string;
  url?: string;
  logo?: string;
  detail?: string;
}

export type Annotation = URLCitation | Record<string, unknown>;

export interface OutputText extends CommonContentItem {
  text?: string;
  annotations?: Annotation[];
}

export interface Refusal extends CommonContentItem {
  refusal?: string;
}

export interface OutputMessage extends CommonContentItem {
  content?: Array<OutputText | Refusal>;
}

export interface Reasoning extends CommonContentItem {
  summary?: Array<{ text?: string; type?: string }>;
  content?: Array<{ text?: string; type?: string }>;
}

export interface FunctionToolCall extends CommonContentItem {
  call_id?: string;
  name?: string;
  arguments?: string;
}

export interface CustomToolCall extends CommonContentItem {
  call_id?: string;
  name?: string;
  input?: string;
}

export interface MCPToolCall extends CommonContentItem {
  arguments?: string;
  server_label?: string;
  name?: string;
  result?: string;
  output?: string;
}

export interface Reference {
  id?: string | number;
  type?: string;
  name?: string;
  url?: string;
  content?: string;
}

export type ContentItem =
  | InputMessage
  | ItemReference
  | OutputMessage
  | Reasoning
  | FunctionToolCall
  | CustomToolCall
  | MCPToolCall
  | CommonContentItem;

export interface AIChatDialogueMessage {
  id: string;
  content?: string | ContentItem[];
  output_text?: string;
  role: string;
  name?: string;
  createdAt?: number;
  updatedAt?: number;
  model?: string;
  status?: string;
  references?: Reference[];
  like?: boolean;
  dislike?: boolean;
  editing?: boolean;
  [key: string]: unknown;
}

export type Message = AIChatDialogueMessage;

export interface AIChatDialogueMetadata {
  name?: string;
  avatar?: string | VNodeChild;
  color?: string;
  [key: string]: unknown;
}

export type Metadata = AIChatDialogueMetadata;
export interface AIChatDialogueRoleConfig {
  user?: AIChatDialogueMetadata | Map<string, AIChatDialogueMetadata>;
  assistant?: AIChatDialogueMetadata | Map<string, AIChatDialogueMetadata>;
  system?: AIChatDialogueMetadata | Map<string, AIChatDialogueMetadata>;
  [key: string]: AIChatDialogueMetadata | Map<string, AIChatDialogueMetadata> | undefined;
}
export type RoleConfig = AIChatDialogueRoleConfig;

export type AIChatDialogueMarkdownRenderProps = Partial<BaseMarkdownRenderProps>;
export type MarkdownRenderProps = AIChatDialogueMarkdownRenderProps;

export interface AIChatDialogueLocale {
  delete?: string;
  deleteConfirm?: string;
  deleteContent?: string;
  copySuccess?: string;
  loading?: string;
  annotationText?: string;
  reasoning?: { completed?: string; thinking?: string };
}

export interface AIChatDialogueReasoningItem {
  text?: string;
  type?: string;
}

export interface AIChatDialogueReasoningProps {
  status?: string;
  summary?: AIChatDialogueReasoningItem[];
  content?: AIChatDialogueReasoningItem[];
  markdownRenderProps?: MarkdownRenderProps;
  completedText?: string;
  thinkingText?: string;
}

export interface AIChatDialogueStepAction {
  summary?: string;
  description?: string;
  icon?: unknown;
}

export interface AIChatDialogueStepItem {
  summary?: string;
  status?: string;
  actions?: AIChatDialogueStepAction[];
}

export interface FullDialogueNodes {
  avatar?: VNodeChild;
  title?: VNodeChild;
  content?: VNodeChild;
  action?: VNodeChild;
}

export interface DefaultActionNodeObj {
  copyNode?: VNodeChild;
  dislikeNode?: VNodeChild;
  likeNode?: VNodeChild;
  moreNode?: VNodeChild;
  resetNode?: VNodeChild;
}

export interface RenderTitleProps {
  defaultTitle?: VNodeChild;
  message?: Message;
  role?: Metadata | undefined;
}
export interface RenderAvatarProps {
  defaultAvatar?: VNodeChild;
  message?: Message;
  role?: Metadata | undefined;
}
export interface RenderContentProps {
  message?: Message;
  role?: Metadata | undefined;
  defaultContent?: VNodeChild;
  className?: string;
}
export interface RenderActionProps {
  message?: Message;
  defaultActions?: VNodeChild;
  className: string;
  defaultActionsObj?: DefaultActionNodeObj;
}
export interface RenderFullDialogueProps {
  message?: Message;
  role?: Metadata | undefined;
  defaultNodes?: FullDialogueNodes;
  className: string;
}

export interface DialogueRenderConfig {
  renderDialogueAction?: (properties: RenderActionProps) => VNodeChild;
  renderDialogueAvatar?: (properties: RenderAvatarProps) => VNodeChild;
  renderDialogueContent?: (properties: RenderContentProps) => VNodeChild;
  renderDialogueTitle?: (properties: RenderTitleProps) => VNodeChild;
  renderFullDialogue?: (properties: RenderFullDialogueProps) => VNodeChild;
}

export type DialogueContentItemRenderer = (item: unknown, message?: Message) => VNodeChild;
export type DialogueContentItemRendererMap = Record<
  string,
  DialogueContentItemRenderer | Record<string, DialogueContentItemRenderer>
>;

export interface AIChatDialogueProps {
  align?: 'leftRight' | 'leftAlign';
  chats?: Message[];
  class?: unknown;
  className?: string;
  disabledFileItemClick?: boolean;
  escapeHtml?: boolean;
  hintCls?: string;
  hints?: string[];
  hintStyle?: CSSProperties;
  selecting?: boolean;
  markdownRenderProps?: MarkdownRenderProps;
  messageEditRender?: (properties: unknown) => VNodeChild;
  mode?: 'bubble' | 'noBubble' | 'userBubble';
  roleConfig: RoleConfig;
  style?: CSSProperties;
  showReset?: boolean;
  showReference?: boolean;
  dialogueRenderConfig?: DialogueRenderConfig;
  renderDialogueContentItem?: DialogueContentItemRendererMap;
  renderHintBox?: (properties: {
    content: string;
    index: number;
    onHintClick: () => void;
  }) => VNodeChild;
}

export interface AIChatDialogueExpose {
  selectAll: () => void;
  deselectAll: () => void;
  scrollToBottom: (animation?: boolean) => void;
  scrollToTop: (animation?: boolean) => void;
  getContainerElement: () => HTMLDivElement | null;
}

export type AIChatDialogueStatic = Component & {
  Reasoning: Component;
  Step: Component;
  Annotation: Component;
  defaultComponents: { code: Component };
};
