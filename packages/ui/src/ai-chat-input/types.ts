import type { Content as TiptapContent, Editor, Extensions } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { PopoverProps } from '../popover';
import type { TooltipProps } from '../tooltip';
import type { UploadChangePayload, UploadFileItem, UploadProps } from '../upload';

export interface RichTextJSON {
  type: string;
  [key: string]: unknown;
}

export interface BaseSkill {
  value?: string;
  label?: string;
  hasTemplate?: boolean;
  [key: string]: unknown;
}

export interface Skill extends BaseSkill {
  icon?: VNodeChild;
}

export type Suggestion = string | string[] | { content: string; [key: string]: unknown };

export interface Attachment extends UploadFileItem {
  validateMessage?: VNodeChild;
  type?: 'file' | 'directory';
  children?: Attachment[];
}

export interface Reference {
  type: string;
  id: string;
  [key: string]: unknown;
}

export interface AIChatInputContent {
  type: string;
  [key: string]: unknown;
}

export interface LeftMenuChangeProps {
  [key: string]: unknown;
}

export interface AIChatInputSetup {
  [key: string]: unknown;
}

export interface MessageContent {
  references?: Reference[];
  attachments?: Attachment[];
  inputContents?: AIChatInputContent[];
  setup?: AIChatInputSetup;
}

export type PlaceholderProps =
  | string
  | ((props: { editor: Editor; node: ProseMirrorNode; pos: number; hasAnchor: boolean }) => string);

export interface RenderUploadButtonProps {
  defaultNode: VNodeChild;
  openFileDialog(): void;
  disabled: boolean;
  attachments: Attachment[];
}

export interface RenderSuggestionItemProps {
  suggestion: Suggestion;
  className: string;
  onClick(): void;
  onMouseEnter(): void;
}

export interface RenderSkillItemProps {
  skill: Skill;
  className: string;
  onClick(): void;
  onMouseEnter(): void;
}

export interface RenderTopSlotProps {
  references: Reference[];
  attachments: Attachment[];
  content: AIChatInputContent[];
  handleUploadFileDelete(attachment: Attachment): void;
  handleReferenceDelete(reference: Reference): void;
}

export interface ActionAreaProps {
  menuItem: VNodeChild[];
  className: string;
}

export interface AIChatInputProps {
  dropdownMatchTriggerWidth?: boolean;
  keepSkillAfterSend?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  placeholder?: PlaceholderProps;
  showPlaceholderWhenSkillOnly?: boolean;
  extensions?: Extensions;
  defaultContent?: TiptapContent;
  references?: Reference[];
  renderReference?: (reference: Reference) => VNodeChild;
  uploadProps?: Partial<UploadProps>;
  renderUploadButton?: (props: RenderUploadButtonProps) => VNodeChild;
  renderTopSlot?: (props: RenderTopSlotProps) => VNodeChild;
  topSlotPosition?: 'top' | 'middle' | 'bottom';
  showUploadFile?: boolean;
  showReference?: boolean;
  showUploadButton?: boolean;
  round?: boolean;
  canSend?: boolean;
  uploadTipProps?: TooltipProps;
  generating?: boolean;
  renderConfigureArea?: (className?: string) => VNodeChild;
  renderActionArea?: (props: ActionAreaProps) => VNodeChild;
  suggestions?: Suggestion[];
  renderSuggestionItem?: (props: RenderSuggestionItemProps) => VNodeChild;
  skills?: Skill[];
  skillHotKey?: string;
  templatesStyle?: StyleValue;
  templatesCls?: string;
  renderSkillItem?: (props: RenderSkillItemProps) => VNodeChild;
  renderTemplate?: (
    skill: Skill | undefined,
    onTemplateClick: (content: string) => void,
  ) => VNodeChild;
  showTemplateButton?: boolean;
  transformer?: Map<string, (obj: unknown) => unknown>;
  popoverProps?: PopoverProps;
  sendHotKey?: 'enter' | 'shift+enter';
  immediatelyRender?: boolean;
  clearContentOnGenerating?: boolean;
}

export interface AIChatInputEmits {
  contentChange: [contents: AIChatInputContent[]];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  paste: [event: ClipboardEvent];
  referenceDelete: [reference: Reference];
  referenceClick: [reference: Reference];
  uploadChange: [payload: UploadChangePayload];
  messageSend: [content: MessageContent];
  stopGenerate: [];
  configureChange: [value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps];
  suggestClick: [suggestion: Suggestion];
  skillChange: [skill: Skill | undefined];
  templateVisibleChange: [visible: boolean];
}

export interface AIChatInputSlots {
  reference?: (props: { reference: Reference }) => VNodeChild;
  uploadButton?: (props: RenderUploadButtonProps) => VNodeChild;
  top?: (props: RenderTopSlotProps) => VNodeChild;
  configure?: (props: { className: string }) => VNodeChild;
  action?: (props: ActionAreaProps) => VNodeChild;
  suggestion?: (props: RenderSuggestionItemProps) => VNodeChild;
  skill?: (props: RenderSkillItemProps) => VNodeChild;
  template?: (props: {
    skill: Skill | undefined;
    onTemplateClick(content: string): void;
  }) => VNodeChild;
}

export interface AIChatInputExposed {
  changeTemplateVisible(visible: boolean): void;
  deleteContent(content: AIChatInputContent): void;
  deleteUploadFile(item: Attachment): void;
  focusEditor(pos?: Parameters<Editor['commands']['focus']>[0]): void;
  getEditor(): Editor | undefined;
  setContent(content: TiptapContent): void;
  setContentWhileSaveTool(content: string): void;
}

export interface AIChatInputLocale {
  template: string;
  configure: string;
  selected: string;
}

export interface AIChatInputConfigureProps {
  value?: LeftMenuChangeProps;
  defaultValue?: LeftMenuChangeProps;
}

export interface AIChatInputConfigureEmits {
  change: [value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps];
  'update:value': [value: LeftMenuChangeProps];
}

export interface AIChatInputConfigureExposed {
  getConfigureValue(): LeftMenuChangeProps;
}

export interface AIChatInputConfigureItemProps {
  field: string;
  initValue?: unknown;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
}
