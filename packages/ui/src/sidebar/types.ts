import type { Extensions } from '@tiptap/core';
import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { CodeHighlightProps } from '../code-highlight';
import type { JsonViewerProps } from '../json-viewer';
import type { UploadProps } from '../upload';

export type SidebarMode = 'main' | 'code' | 'file' | (string & {});
export type SidebarActiveKey = string | string[];

export interface SidebarLocale {
  mcpConfigure?: string;
  annotationTitle?: string;
  searchPlaceholder?: string;
  emptyCustomMcpInfo?: string;
  newMcpAdd?: string;
  activeMCPNumber?: string;
  defaultMcpInfo?: string;
  copySuccess?: string;
  enterLinkAddress?: string;
  linkAddSuccess?: string;
  linkRemoveSuccess?: string;
  uploadImgInfo?: string;
  validateFailInfo?: string;
  uploadFailInfo?: string;
}

export interface SidebarSize {
  width?: string | number;
  height?: string | number;
}

export interface SidebarContainerProps {
  title?: VNodeChild;
  visible?: boolean;
  motion?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  resizable?: boolean;
  defaultSize?: SidebarSize;
  showClose?: boolean;
  closeOnEsc?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  renderHeader?: () => VNodeChild;
  containerRef?: (element: HTMLDivElement | null) => void;
  onCancel?: (event: MouseEvent | KeyboardEvent) => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export interface SidebarContainerEmits {
  cancel: [event: MouseEvent | KeyboardEvent];
  'after-visible-change': [visible: boolean];
}

export interface SidebarContainerSlots {
  default?: () => VNodeChild;
  title?: () => VNodeChild;
  header?: () => VNodeChild;
}

export interface SidebarOption {
  icon: VNodeChild;
  name: VNodeChild;
  key: string;
}

export interface SidebarProps extends SidebarContainerProps {
  mode?: SidebarMode;
  activeKey?: string;
  options?: SidebarOption[];
  detailContent?: SidebarCodeItemProps | SidebarFileItemProps | Record<string, unknown>;
  fileEditable?: boolean;
  imgUploadProps?: SidebarImageUploadOptions;
  renderOptionItem?: (
    option: SidebarOption,
    onChange: (event: MouseEvent, activeKey: string) => void,
  ) => VNodeChild;
  renderMainContent?: (activeKey?: string) => VNodeChild;
  renderDetailHeader?: (
    mode: SidebarMode,
    detailContent: SidebarProps['detailContent'],
  ) => VNodeChild;
  renderDetailContent?: (mode: SidebarMode) => VNodeChild;
  onActiveOptionChange?: (event: MouseEvent, activeKey: string) => void;
  onFileContentChange?: (content: string) => void;
  onBackWard?: (event: MouseEvent, mode: SidebarMode) => void | Promise<unknown>;
  onDetailContentCopy?: (event: MouseEvent, content: string, result: boolean) => void;
}

export interface SidebarEmits extends SidebarContainerEmits {
  'active-option-change': [event: MouseEvent, activeKey: string];
  'file-content-change': [content: string];
  'back-ward': [event: MouseEvent, mode: SidebarMode];
  'detail-content-copy': [event: MouseEvent, content: string, result: boolean];
}

export interface SidebarSlots extends SidebarContainerSlots {
  option?: (props: {
    option: SidebarOption;
    onChange: (event: MouseEvent, activeKey: string) => void;
  }) => VNodeChild;
  'main-content'?: (props: { activeKey?: string }) => VNodeChild;
  'detail-header'?: (props: {
    mode: SidebarMode;
    detailContent: SidebarProps['detailContent'];
  }) => VNodeChild;
  'detail-content'?: (props: { mode: SidebarMode }) => VNodeChild;
}

export interface SidebarCodeItemProps {
  name?: string;
  key?: string;
  isJson?: boolean;
  language?: string;
  content?: string;
  jsonViewerProps?: JsonViewerProps;
  codeHighlightProps?: CodeHighlightProps;
}

export interface SidebarCollapseProps {
  activeKey?: SidebarActiveKey;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  onChange?: (activeKey: SidebarActiveKey) => void;
}

export interface SidebarCodeContentProps extends SidebarCollapseProps {
  codes?: SidebarCodeItemProps[];
  onExpand?: (event: MouseEvent, code: SidebarCodeItemProps, mode: 'code') => void;
}

export interface SidebarCodeContentEmits {
  change: [activeKey: SidebarActiveKey];
  expand: [event: MouseEvent, code: SidebarCodeItemProps, mode: 'code'];
}

export interface SidebarImageUploadOptions extends Omit<UploadProps, 'action'> {
  type?: string;
  action?: string;
  getUploadImageSrc?: (src?: string) => string;
}

export interface SidebarFileItemProps {
  key?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  name?: string;
  style?: StyleValue;
  editable?: boolean;
  content?: string;
  extensions?: Extensions;
  imgUploadProps?: SidebarImageUploadOptions;
  onContentChange?: (content: string) => void;
}

export interface SidebarFileItemEmits {
  'content-change': [content: string];
}

export interface SidebarFileContentProps extends SidebarCollapseProps {
  files?: SidebarFileItemProps[];
  onExpand?: (event: MouseEvent, file: SidebarFileItemProps, mode: 'file') => void;
}

export interface SidebarFileContentEmits {
  change: [activeKey: SidebarActiveKey];
  expand: [event: MouseEvent, file: SidebarFileItemProps, mode: 'file'];
}

export interface SidebarAnnotationItem {
  type?: 'video' | 'text';
  title?: string;
  url?: string;
  detail?: string;
  logo?: string;
  siteName?: string;
  order?: number;
  img?: string;
  duration?: number;
  onClick?: (event: MouseEvent, item: SidebarAnnotationItem) => void;
}

export interface SidebarAnnotationGroup {
  header: VNodeChild;
  key: string;
  annotations: SidebarAnnotationItem[];
}

export interface SidebarAnnotationContentProps extends SidebarCollapseProps {
  info?: SidebarAnnotationGroup[];
  renderItem?: (annotation: SidebarAnnotationItem) => VNodeChild;
  onClick?: (event: MouseEvent, item: SidebarAnnotationItem) => void;
}

export interface SidebarAnnotationContentEmits {
  change: [activeKey: SidebarActiveKey];
  click: [event: MouseEvent, item: SidebarAnnotationItem];
}

export interface SidebarAnnotationContentSlots {
  item?: (props: { annotation: SidebarAnnotationItem }) => VNodeChild;
}

export interface SidebarAnnotationProps
  extends SidebarContainerProps, SidebarAnnotationContentProps {}

export interface SidebarMCPOption {
  icon?: VNodeChild;
  label?: string;
  value?: string;
  desc?: VNodeChild;
  active?: boolean;
  disabled?: boolean;
  configure?: boolean;
}

export interface SidebarMCPConfigureContentProps {
  options?: SidebarMCPOption[];
  customOptions?: SidebarMCPOption[];
  filter?: (inputValue: string, option: SidebarMCPOption) => boolean;
  placeholder?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  renderItem?: (props: { option: SidebarMCPOption; custom: boolean }) => VNodeChild;
  onStatusChange?: (options: SidebarMCPOption[], custom: boolean) => void;
  onSearch?: (inputValue: string, custom: boolean) => void;
  onAddClick?: (event: MouseEvent) => void;
  onConfigureClick?: (event: MouseEvent, option: SidebarMCPOption) => void;
  onEditClick?: (event: MouseEvent, option: SidebarMCPOption) => void;
}

export interface SidebarMCPConfigureContentEmits {
  'status-change': [options: SidebarMCPOption[], custom: boolean];
  search: [inputValue: string, custom: boolean];
  'add-click': [event: MouseEvent];
  'configure-click': [event: MouseEvent, option: SidebarMCPOption];
  'edit-click': [event: MouseEvent, option: SidebarMCPOption];
}

export interface SidebarMCPConfigureContentSlots {
  item?: (props: { option: SidebarMCPOption; custom: boolean }) => VNodeChild;
}

export interface SidebarMCPConfigureProps
  extends SidebarContainerProps, SidebarMCPConfigureContentProps {}

export interface SidebarContainerExposed {
  getContainerElement: () => HTMLDivElement | null;
}
