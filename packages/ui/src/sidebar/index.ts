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

/** 保留 SidebarContainer 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarContainer: typeof ContainerBase = ContainerBase;
/** 保留 SidebarCodeContent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarCodeContent: typeof CodeContentBase = CodeContentBase;
/** 保留 SidebarCodeItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarCodeItem: typeof CodeItemBase = CodeItemBase;
/** 保留 SidebarFileContent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarFileContent: typeof FileContentBase = FileContentBase;
/** 保留 SidebarFileItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarFileItem: typeof FileItemBase = FileItemBase;
/** 保留 SidebarAnnotationContent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarAnnotationContent: typeof AnnotationContentBase = AnnotationContentBase;
/** 保留 SidebarMCPConfigureContent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SidebarMCPConfigureContent: typeof MCPConfigureContentBase = MCPConfigureContentBase;

/** 保留 SidebarCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type SidebarCompoundComponent = typeof SidebarBase & {
  Container: typeof SidebarContainer;
  CodeContent: typeof SidebarCodeContent;
  CodeItem: typeof SidebarCodeItem;
  FileContent: typeof SidebarFileContent;
  FileItem: typeof SidebarFileItem;
};
/** 保留 SidebarAnnotationCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type SidebarAnnotationCompoundComponent = typeof AnnotationBase & {
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
/** 保留 MCPConfigure 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const MCPConfigure: typeof MCPConfigureBase = MCPConfigureBase;

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
