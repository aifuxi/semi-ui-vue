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
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface ChatFoundationAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getContainerRef(): HTMLDivElement | null;
  setWheelScroll(flag: boolean): void;
  notifyChatsChange(chats: unknown[]): void;
  notifyLikeMessage(message: unknown): void;
  notifyDislikeMessage(message: unknown): void;
  notifyCopyMessage(message: unknown): void;
  notifyClearContext(): void;
  notifyMessageSend(content: string, attachment: unknown[]): void;
  notifyInputChange(props: { inputValue: string; attachment: unknown[] }): void;
  setBackBottomVisible(visible: boolean): void;
  registerWheelEvent(): void;
  unRegisterWheelEvent(): void;
  notifyStopGenerate(event: Event): void;
  notifyHintClick(hint: string): void;
  setUploadAreaVisible(visible: boolean): void;
  manualUpload(files: File[]): void;
  getDropAreaElement(): HTMLDivElement | null;
  getDragStatus(): boolean;
  setDragStatus(status: boolean): void;
}

export class ChatFoundation<Props, State> {
  constructor(adapter: ChatFoundationAdapter<Props, State>);
  init(): void;
  destroy(): void;
  stopGenerate(event: Event): void;
  scrollToBottomImmediately(): void;
  scrollToBottomWithAnimation(): void;
  containerScroll(event: Event): void;
  getScroll(target: HTMLElement): void;
  handleScrollContainerResize(): void;
  clearContext(event?: Event | null): void;
  onMessageSend(input: string, attachment: unknown[]): void;
  onHintClick(hint: string): void;
  onInputChange(props: { inputValue: string; attachment: unknown[] }): void;
  deleteMessage(message: unknown): void;
  likeMessage(message: unknown): void;
  dislikeMessage(message: unknown): void;
  resetMessage(message?: unknown): void;
  handleDragOver(event: DragEvent): void;
  handleDragStart(event: DragEvent): void;
  handleDragEnd(event: DragEvent): void;
  handleContainerDragOver(event: DragEvent): void;
  handleContainerDrop(event: DragEvent): void;
  handleContainerDragLeave(event: DragEvent): void;
  getUploadProps(value?: boolean | Record<string, boolean>): {
    dragUpload: boolean;
    clickUpload: boolean;
    pasteUpload: boolean;
  };
}

export interface ChatInputBoxAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyInputChange(props: { inputValue: string; attachment: unknown[] }): void;
  setInputValue(value: string): void;
  setAttachment(attachment: unknown[]): void;
  notifySend(content: string, attachment: unknown[]): void;
}

export class ChatInputBoxFoundation<Props, State> {
  constructor(adapter: ChatInputBoxAdapter<Props, State>);
  onInputAreaChange(value: string): void;
  onAttachmentAdd(props: { fileList: unknown[] }): void;
  onAttachmentDelete(props: { uid?: string }): void;
  onSend(event?: Event): void;
  getDisableSend(): boolean;
  onEnterPress(event: KeyboardEvent): void;
  onPaste(event: ClipboardEvent): void;
}

export interface ChatBoxActionAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyDeleteMessage(): void;
  notifyMessageCopy(): void;
  copyToClipboardAndToast(): void;
  notifyLikeMessage(): void;
  notifyDislikeMessage(): void;
  notifyResetMessage(): void;
  setVisible(visible: boolean): void;
  setShowAction(showAction: boolean): void;
  registerClickOutsideHandler(callback: () => void): void;
  unregisterClickOutsideHandler(): void;
}

export class ChatBoxActionFoundation<Props, State> {
  constructor(adapter: ChatBoxActionAdapter<Props, State>);
  showDeletePopup(): void;
  hideDeletePopup(): void;
  destroy(): void;
  deleteMessage(): void;
  copyMessage(): void;
  likeMessage(): void;
  dislikeMessage(): void;
  resetMessage(): void;
}

export const chatCssClasses: Readonly<Record<string, string>>;
export const chatStrings: Readonly<Record<string, unknown>>;
