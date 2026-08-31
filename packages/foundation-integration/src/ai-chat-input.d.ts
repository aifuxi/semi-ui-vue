interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: unknown): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface AIChatInputFoundationProps {
  canSend?: boolean | undefined;
  clearContentOnGenerating?: boolean | undefined;
  dropdownMatchTriggerWidth?: boolean | undefined;
  generating?: boolean | undefined;
  references?: unknown[] | undefined;
  sendHotKey?: 'enter' | 'shift+enter' | undefined;
  skillHotKey?: string | undefined;
  skills?: unknown[] | undefined;
  style?: unknown;
  suggestions?: unknown[] | undefined;
  transformer?: Map<string, (value: unknown) => unknown> | undefined;
  uploadProps?: Record<string, unknown> | undefined;
}

export interface AIChatInputFoundationState {
  activeSkillIndex?: number;
  activeSuggestionIndex?: number;
  attachments?: unknown[];
  content?: unknown;
  popupWidth?: number | string;
  richTextInit?: boolean;
  skill?: Record<string, unknown>;
  skillVisible?: boolean;
  suggestionVisible?: boolean;
  templateVisible?: boolean;
}

export interface AIChatInputAdapter<Props, State> extends DefaultAdapter<Props, State> {
  reposPopover(): void;
  setContent(content: unknown): void;
  focusEditor(pos?: unknown): void;
  getTriggerWidth(): number;
  getEditor(): unknown;
  getPopupID(): string;
  notifyContentChange(result: unknown[]): void;
  notifyConfigureChange(value: unknown, changedValue: unknown): void;
  manualUpload(files: File[]): void;
  notifyMessageSend(props: unknown): void;
  notifyStopGenerate(): void;
  notifySkillChange(skill: unknown): void;
  clearContent(): void;
  clearAttachments(): void;
  getRichTextDiv(): HTMLDivElement | null;
  registerClickOutsideHandler(callback: (event: Event) => void): void;
  unregisterClickOutsideHandler(): void;
  handleReferenceDelete(reference: unknown): void;
  handleReferenceClick(reference: unknown): void;
  isSelectionText(selection: unknown): boolean;
  createSelection(node: unknown, pos: number): unknown;
  notifyFocus(event: FocusEvent): void;
  notifyBlur(event: FocusEvent): void;
  getConfigureValue(): unknown;
}

export class AIChatInputFoundation<
  Props extends AIChatInputFoundationProps,
  State extends AIChatInputFoundationState,
> {
  constructor(adapter: AIChatInputAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleSkillSelect(skill: unknown): void;
  changeTemplateVisible(value: boolean): void;
  handlePaste(files: File[]): void;
  handleSuggestionSelect(suggestion: unknown): void;
  handleUploadFileDelete(attachment: unknown): void;
  handleReferenceDelete(reference: unknown): void;
  handleReferenceClick(reference: unknown): void;
  setActiveSuggestionIndex(index: number): void;
  setActiveSkillIndex(index: number): void;
  handleKeyDown(event: KeyboardEvent): void;
  onConfigureChange(value: unknown, changedValue: unknown): void;
  showSuggestionPanel(): void;
  hideSuggestionPanel(): void;
  handleCreate(): void;
  handleContentChange(content: string): void;
  onUploadChange(props: unknown): void;
  canSend(): boolean;
  handleStopGenerate(): void;
  handleSend(): void;
  handleContainerMouseDown(event: MouseEvent): void;
  handleContainerClick(event: MouseEvent): void;
  handRichTextArealKeyDown(view: unknown, event: KeyboardEvent): boolean;
  handleDeleteContent(content: unknown): void;
  handleFocus(event: FocusEvent): void;
  handleBlur(event: FocusEvent): void;
}

export const aiChatInputCssClasses: Readonly<{ PREFIX: 'semi-ai-chat-input' }>;
export const aiChatInputNumbers: Readonly<{
  SKILL_MAX_HEIGHT: number;
  SUGGESTION_MAX_HEIGHT: number;
}>;
export const aiChatInputStrings: Readonly<{
  SEND_HOTKEY: { ENTER: 'enter'; SHIFT_ENTER: 'shift+enter' };
  ZERO_WIDTH_CHAR: string;
  DELETABLE: string;
}>;

export function getAttachmentType(file: unknown): string;
export function getContentType(file: unknown): string;
export function getCustomSlotAttribute(): Record<string, unknown>;
export function getSkillSlotString(skill: unknown): string;
export function isImageType(item: unknown): boolean;
export function transformJSONResult(
  value: unknown,
  transformer?: Map<string, (value: unknown) => unknown>,
): unknown[];
