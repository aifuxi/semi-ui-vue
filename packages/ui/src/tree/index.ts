import type { DefineComponent } from 'vue';

import TreeBase from './Tree.vue';
import TreeNodeBase from './TreeNode.vue';
import type { TreeNodeProps } from './types';

/** 保留 TreeCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type TreeCompoundComponent = typeof TreeBase & {
  TreeNode: DefineComponent<TreeNodeProps>;
};

// TreeNode 没有公开事件；继续限制为公开 Props，避免泄漏内部渲染参数。
export const TreeNode = TreeNodeBase as unknown as DefineComponent<TreeNodeProps>;
export const Tree = Object.assign(TreeBase, { TreeNode }) as unknown as TreeCompoundComponent;

export type {
  TreeCheckRelation,
  TreeDragEnterProps,
  TreeDragNode,
  TreeDragProps,
  TreeDropProps,
  TreeEmits,
  TreeExpandAction,
  TreeExpandDetail,
  TreeExpandIconSlotProps,
  TreeExposed,
  TreeFullLabelSlotProps,
  TreeKeyMaps,
  TreeNodeData,
  TreeNodeProps,
  TreePrimitive,
  TreeProps,
  TreeSearchSlotProps,
  TreeSlots,
  TreeValue,
  TreeVirtualize,
} from './types';

export default Tree;
