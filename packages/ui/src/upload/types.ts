import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ModalProps } from '../modal';
import type { TypographyShowTooltip } from '../typography';

export const UPLOAD_LIST_TYPES = ['picture', 'list', 'none'] as const;
export const UPLOAD_PROMPT_POSITIONS = ['left', 'right', 'bottom'] as const;
export const UPLOAD_TRIGGERS = ['auto', 'custom'] as const;
export const UPLOAD_FILE_STATUSES = [
  'success',
  'uploadFail',
  'validateFail',
  'validating',
  'uploading',
  'wait',
] as const;

export type UploadListType = (typeof UPLOAD_LIST_TYPES)[number];
export type UploadPromptPosition = (typeof UPLOAD_PROMPT_POSITIONS)[number];
export type UploadTrigger = (typeof UPLOAD_TRIGGERS)[number];
export type UploadFileStatus = (typeof UPLOAD_FILE_STATUSES)[number];

export interface UploadFileItem {
  status: UploadFileStatus;
  name: string;
  size: string | number;
  uid: string;
  url?: string;
  fileInstance?: File;
  percent?: number;
  _sizeInvalid?: boolean;
  preview?: boolean;
  validateMessage?: VNodeChild;
  shouldUpload?: boolean;
  showReplace?: boolean;
  showRetry?: boolean;
  response?: unknown;
  event?: Event;
}

export interface UploadCustomFile extends File {
  uid?: string;
  _sizeInvalid?: boolean;
  status?: UploadFileStatus;
}

export interface UploadBeforeProps {
  file: UploadFileItem;
  fileList: UploadFileItem[];
}

export interface UploadAfterProps extends UploadBeforeProps {
  response: unknown;
}

export interface UploadBeforeResult {
  shouldUpload?: boolean;
  status?: UploadFileStatus;
  autoRemove?: boolean;
  validateMessage?: VNodeChild;
  fileInstance?: UploadCustomFile;
}

export interface UploadAfterResult {
  autoRemove?: boolean;
  status?: UploadFileStatus;
  validateMessage?: VNodeChild;
  name?: string;
  url?: string;
}

export interface UploadChangePayload {
  fileList: UploadFileItem[];
  currentFile?: UploadFileItem | null;
}

export interface UploadCustomError extends Error {
  status: number;
  method: string;
  url: string;
}

export interface UploadCustomRequestArgs {
  fileName: string;
  data: Record<string, unknown>;
  file: UploadFileItem;
  fileInstance: File;
  onProgress(event?: { total: number; loaded: number }): void;
  onError(xhr: { status?: number }, event?: Event): void;
  onSuccess(response: unknown, event?: Event): void;
  withCredentials: boolean;
  action: string;
}

export interface UploadCropProps {
  aspectRatio?: number;
  shape?: 'rect' | 'round' | 'roundRect';
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  quality?: number;
  fill?: string;
  modalTitle?: string;
  modalOkText?: string;
  modalCancelText?: string;
}

export interface UploadRenderPictureCloseProps {
  className: string;
  remove(event: MouseEvent): void;
}

export interface UploadRenderFileListTitleProps {
  fileList: UploadFileItem[];
  onClear(): void;
  clearText: string;
}

export interface UploadRenderFileItemProps extends UploadFileItem {
  index: number;
  listType: UploadListType;
  onRemove(): void;
  onRetry(): void;
  onReplace(): void;
  key: string;
  showPicInfo?: boolean;
  showRetry?: boolean;
  showReplace?: boolean;
  style?: StyleValue;
  disabled: boolean;
  onPreviewClick?: () => void;
  picWidth?: string | number;
  picHeight?: string | number;
  showTooltip?: boolean | TypographyShowTooltip;
  previewFile?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicInfo?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderThumbnail?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicPreviewIcon?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicClose?: (props: UploadRenderPictureCloseProps) => VNodeChild;
  renderFileOperation?: (props: UploadRenderFileItemProps) => VNodeChild;
}

export interface UploadProps {
  accept?: string;
  action: string;
  afterUpload?: (payload: UploadAfterProps) => UploadAfterResult | undefined;
  beforeUpload?: (
    payload: UploadBeforeProps,
  ) => UploadBeforeResult | Promise<UploadBeforeResult> | boolean;
  beforeClear?: (fileList: UploadFileItem[]) => boolean | Promise<boolean>;
  beforeRemove?: (file: UploadFileItem, fileList: UploadFileItem[]) => boolean | Promise<boolean>;
  capture?: boolean | 'user' | 'environment';
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  customRequest?: (payload: UploadCustomRequestArgs) => void;
  data?: Record<string, unknown> | ((file: File) => Record<string, unknown>);
  defaultFileList?: UploadFileItem[];
  directory?: boolean;
  disabled?: boolean;
  dragIcon?: VNodeChild;
  dragMainText?: VNodeChild;
  dragSubText?: VNodeChild;
  draggable?: boolean;
  addOnPasting?: boolean;
  fileList?: UploadFileItem[] | undefined;
  modelValue?: UploadFileItem[] | undefined;
  fileName?: string;
  headers?: Record<string, unknown> | ((file: File) => Record<string, string>);
  hotSpotLocation?: 'start' | 'end';
  itemStyle?: StyleValue;
  limit?: number;
  listType?: UploadListType;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  name?: string;
  picHeight?: string | number;
  picWidth?: string | number;
  prompt?: VNodeChild;
  promptPosition?: UploadPromptPosition;
  showClear?: boolean;
  showPicInfo?: boolean;
  showReplace?: boolean;
  showRetry?: boolean;
  showTooltip?: boolean | TypographyShowTooltip;
  showUploadList?: boolean;
  style?: StyleValue;
  timeout?: number;
  transformFile?: (file: File) => UploadCustomFile;
  uploadTrigger?: UploadTrigger;
  validateMessage?: VNodeChild;
  validateStatus?: 'default' | 'error' | 'warning' | 'success';
  withCredentials?: boolean;
  crop?: boolean | UploadCropProps;
  beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  onCropError?: (error: Error) => void;
  cropModalProps?: ModalProps;
  previewFile?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderFileItem?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicInfo?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderThumbnail?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicPreviewIcon?: (props: UploadRenderFileItemProps) => VNodeChild;
  renderPicClose?: (props: UploadRenderPictureCloseProps) => VNodeChild;
  renderFileOperation?: (props: UploadRenderFileItemProps) => VNodeChild;
  fileListTitle?: VNodeChild | ((props: UploadRenderFileListTitleProps) => VNodeChild);
}

export type UploadFileCardProps = Omit<UploadRenderFileItemProps, 'key'> & {
  className?: HTMLAttributes['class'];
  _locale?: UploadLocale;
};

export interface UploadEmits {
  acceptInvalid: [files: File[]];
  change: [payload: UploadChangePayload];
  clear: [];
  cropError: [error: Error];
  drop: [event: Event, files: File[], fileList: UploadFileItem[]];
  error: [
    error: UploadCustomError,
    file: UploadCustomFile,
    fileList: UploadFileItem[],
    xhr: XMLHttpRequest,
  ];
  exceed: [files: File[]];
  fileChange: [files: File[]];
  openFileDialog: [];
  pastingError: [error: Error | PermissionStatus];
  previewClick: [file: UploadFileItem];
  progress: [percent: number, file: UploadCustomFile, fileList: UploadFileItem[]];
  remove: [file: UploadCustomFile, fileList: UploadFileItem[], fileItem: UploadFileItem];
  retry: [file: UploadFileItem];
  sizeError: [file: UploadCustomFile, fileList: UploadFileItem[]];
  success: [response: unknown, file: UploadCustomFile, fileList: UploadFileItem[]];
  'update:fileList': [fileList: UploadFileItem[]];
  'update:modelValue': [fileList: UploadFileItem[]];
}

export interface UploadSlots {
  default?: () => VNodeChild;
  dragIcon?: () => VNodeChild;
  dragMainText?: () => VNodeChild;
  dragSubText?: () => VNodeChild;
  prompt?: () => VNodeChild;
  fileItem?: (props: UploadRenderFileItemProps) => VNodeChild;
  thumbnail?: (props: UploadRenderFileItemProps) => VNodeChild;
  picInfo?: (props: UploadRenderFileItemProps) => VNodeChild;
  picPreviewIcon?: (props: UploadRenderFileItemProps) => VNodeChild;
  picClose?: (props: UploadRenderPictureCloseProps) => VNodeChild;
  fileOperation?: (props: UploadRenderFileItemProps) => VNodeChild;
  fileListTitle?: (props: UploadRenderFileListTitleProps) => VNodeChild;
}

export interface UploadExposed {
  insert(files: UploadCustomFile[], index?: number): void;
  upload(): void;
  openFileDialog(): void;
  clear(): void;
  remove(file: UploadFileItem): void;
}

export interface UploadLocale {
  mainText: string;
  illegalTips: string;
  legalTips: string;
  retry: string;
  replace: string;
  clear: string;
  selectedFiles: string;
  illegalSize: string;
  fail: string;
  cropTitle: string;
  cropOk: string;
  cropCancel: string;
}

export type UploadLocaleConfig = Partial<UploadLocale>;
