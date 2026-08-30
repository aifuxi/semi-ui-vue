interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: string): unknown;
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export type UploadFileStatus =
  'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait';

export interface UploadFoundationFileItem extends Record<string, unknown> {
  status: UploadFileStatus;
  name: string;
  size: string;
  uid: string;
  url?: string;
  fileInstance?: File;
  percent?: number;
  _sizeInvalid?: boolean;
  preview?: boolean;
  validateMessage?: unknown;
  shouldUpload?: boolean;
  showReplace?: boolean;
  showRetry?: boolean;
  response?: unknown;
  event?: Event;
}

export interface UploadFoundationError extends Error {
  status: number;
  method: string;
  url: string;
}

export interface UploadBeforeResult {
  shouldUpload?: boolean;
  status?: string;
  autoRemove?: boolean;
  validateMessage?: unknown;
  fileInstance?: File;
}

export interface UploadAfterResult {
  autoRemove?: boolean;
  status?: string;
  validateMessage?: unknown;
  name?: string;
  url?: string;
}

export interface UploadAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyFileSelect(files: File[]): void;
  notifyError(
    error: UploadFoundationError,
    file: File,
    fileList: UploadFoundationFileItem[],
    xhr: XMLHttpRequest,
  ): void;
  notifySuccess(body: unknown, file: File, fileList: UploadFoundationFileItem[]): void;
  notifyProgress(percent: number, file: File, fileList: UploadFoundationFileItem[]): void;
  notifyRemove(
    file: File,
    fileList: UploadFoundationFileItem[],
    fileItem: UploadFoundationFileItem,
  ): void;
  notifySizeError(file: File, fileList: UploadFoundationFileItem[]): void;
  notifyExceed(files: File[]): void;
  updateFileList(fileList: UploadFoundationFileItem[], callback?: () => void): void;
  notifyBeforeUpload(payload: {
    file: UploadFoundationFileItem;
    fileList: UploadFoundationFileItem[];
  }): boolean | UploadBeforeResult | Promise<UploadBeforeResult>;
  notifyAfterUpload(payload: {
    response: unknown;
    file: UploadFoundationFileItem;
    fileList: UploadFoundationFileItem[];
  }): UploadAfterResult;
  resetInput(): void;
  resetReplaceInput(): void;
  updateDragAreaStatus(status: string): void;
  notifyBeforeRemove(
    file: UploadFoundationFileItem,
    fileList: UploadFoundationFileItem[],
  ): boolean | Promise<boolean>;
  notifyBeforeClear(fileList: UploadFoundationFileItem[]): boolean | Promise<boolean>;
  notifyChange(payload: {
    currentFile?: UploadFoundationFileItem | null;
    fileList: UploadFoundationFileItem[];
  }): void;
  updateLocalUrls(urls: string[]): void;
  notifyClear(): void;
  notifyPreviewClick(file: UploadFoundationFileItem): void;
  notifyDrop(event: Event, files: File[], fileList: UploadFoundationFileItem[]): void;
  notifyAcceptInvalid(files: File[]): void;
  registerPastingHandler(callback?: (event: KeyboardEvent | ClipboardEvent) => void): void;
  unRegisterPastingHandler(): void;
  registerPasteEventHandler(callback?: (event: ClipboardEvent) => void): void;
  unRegisterPasteEventHandler(): void;
  isMac(): boolean;
  notifyPastingError(error: Error | PermissionStatus): void;
}

export class UploadFoundation<Props, State> {
  constructor(adapter: UploadAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleChange(files: FileList | File[]): void;
  handleReplaceChange(files: FileList | File[]): void;
  insertFileToList(files: File[], index?: number): void;
  manualUpload(): void;
  handleRemove(file: UploadFoundationFileItem): void;
  handleClear(): void;
  handleDrop(event: DragEvent): void;
  handleDragOver(event: DragEvent): void;
  handleDragLeave(event: DragEvent): void;
  handleDragEnter(event: DragEvent): void;
  retry(file: UploadFoundationFileItem): void;
  handlePreviewClick(file: UploadFoundationFileItem): void;
  releaseMemory(): void;
}

export interface UploadFileCardAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateFallbackPreview(fallback: boolean): void;
}

export class UploadFileCardFoundation<Props, State> {
  constructor(adapter: UploadFileCardAdapter<Props, State>);
  handleImageError(event: Event): void;
}

export const uploadCssClasses: { PREFIX: string; LIST: string };
export const uploadNumbers: { PROGRESS_COEFFICIENT: number };
export const uploadStrings: {
  FILE_STATUS_UPLOADING: 'uploading';
  FILE_STATUS_SUCCESS: 'success';
  FILE_STATUS_UPLOAD_FAIL: 'uploadFail';
  FILE_STATUS_VALIDATING: 'validating';
  FILE_STATUS_VALID_FAIL: 'validateFail';
  FILE_STATUS_WAIT_UPLOAD: 'wait';
  FILE_LIST_PIC: 'picture';
  FILE_LIST_DEFAULT: 'list';
  LIST_TYPE: readonly ['picture', 'list', 'none'];
  DRAG_AREA_DEFAULT: 'default';
  DRAG_AREA_LEGAL: 'legal';
  DRAG_AREA_ILLEGAL: 'illegal';
  TRIGGER_AUTO: 'auto';
  TRIGGER_CUSTOM: 'custom';
  UPLOAD_TRIGGER: readonly ['auto', 'custom'];
  PROMPT_POSITION: readonly ['left', 'right', 'bottom'];
};
export function getUploadFileSize(size: number): string;
export function mapUploadFileTree(items: DataTransferItem[]): Promise<File[]>;
