import type { DefineComponent } from 'vue';

import TreeBase from './Tree.vue';
import TreeNodeBase from './TreeNode.vue';
import type { TreeNodeProps, TreeProps } from './types';

export type TreeCompoundComponent = DefineComponent<TreeProps> & {
  TreeNode: DefineComponent<TreeNodeProps>;
};

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
