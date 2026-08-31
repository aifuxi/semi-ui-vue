import type { DefineComponent } from 'vue';

import AnnotationBase from './SidebarAnnotation.vue';
import AnnotationContentBase from './SidebarAnnotationContent.vue';
import CodeContentBase from './SidebarCodeContent.vue';
import CodeItemBase from './SidebarCodeItem.vue';
import ContainerBase from './SidebarContainer.vue';
import FileContentBase from './SidebarFileContent.vue';
import FileItemBase from './SidebarFileItem.vue';
import MCPConfigureBase from './SidebarMCPConfigure.vue';
import MCPConfigureContentBase from './SidebarMCPConfigureContent.vue';
import SidebarBase from './Sidebar.vue';
import type {
  SidebarAnnotationContentProps,
  SidebarAnnotationProps,
  SidebarCodeContentProps,
  SidebarCodeItemProps,
  SidebarContainerProps,
  SidebarFileContentProps,
  SidebarFileItemProps,
  SidebarMCPConfigureContentProps,
  SidebarMCPConfigureProps,
  SidebarProps,
} from './types';

export const SidebarContainer = ContainerBase as unknown as DefineComponent<SidebarContainerProps>;
export const SidebarCodeContent =
  CodeContentBase as unknown as DefineComponent<SidebarCodeContentProps>;
export const SidebarCodeItem = CodeItemBase as unknown as DefineComponent<SidebarCodeItemProps>;
export const SidebarFileContent =
  FileContentBase as unknown as DefineComponent<SidebarFileContentProps>;
export const SidebarFileItem = FileItemBase as unknown as DefineComponent<SidebarFileItemProps>;
export const SidebarAnnotationContent =
  AnnotationContentBase as unknown as DefineComponent<SidebarAnnotationContentProps>;
export const SidebarMCPConfigureContent =
  MCPConfigureContentBase as unknown as DefineComponent<SidebarMCPConfigureContentProps>;

export type SidebarCompoundComponent = DefineComponent<SidebarProps> & {
  Container: typeof SidebarContainer;
  CodeContent: typeof SidebarCodeContent;
  CodeItem: typeof SidebarCodeItem;
  FileContent: typeof SidebarFileContent;
  FileItem: typeof SidebarFileItem;
};
export type SidebarAnnotationCompoundComponent = DefineComponent<SidebarAnnotationProps> & {
  AnnotationContent: typeof SidebarAnnotationContent;
};

export const Sidebar = Object.assign(SidebarBase, {
  Container: SidebarContainer,
  CodeContent: SidebarCodeContent,
  CodeItem: SidebarCodeItem,
  FileContent: SidebarFileContent,
  FileItem: SidebarFileItem,
}) as unknown as SidebarCompoundComponent;
export const Annotation = Object.assign(AnnotationBase, {
  AnnotationContent: SidebarAnnotationContent,
}) as unknown as SidebarAnnotationCompoundComponent;
export const MCPConfigure =
  MCPConfigureBase as unknown as DefineComponent<SidebarMCPConfigureProps>;

export default Sidebar;
export type {
  SidebarActiveKey,
  SidebarAnnotationContentEmits,
  SidebarAnnotationContentProps,
  SidebarAnnotationContentSlots,
  SidebarAnnotationGroup,
  SidebarAnnotationItem,
  SidebarAnnotationProps,
  SidebarCodeContentEmits,
  SidebarCodeContentProps,
  SidebarCodeItemProps,
  SidebarCollapseProps,
  SidebarContainerEmits,
  SidebarContainerExposed,
  SidebarContainerProps,
  SidebarContainerSlots,
  SidebarEmits,
  SidebarFileContentEmits,
  SidebarFileContentProps,
  SidebarFileItemEmits,
  SidebarFileItemProps,
  SidebarImageUploadOptions,
  SidebarLocale,
  SidebarMCPConfigureContentEmits,
  SidebarMCPConfigureContentProps,
  SidebarMCPConfigureContentSlots,
  SidebarMCPConfigureProps,
  SidebarMCPOption,
  SidebarMode,
  SidebarOption,
  SidebarProps,
  SidebarSize,
  SidebarSlots,
} from './types';
