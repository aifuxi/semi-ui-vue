import type { TreeDropProps, TreeNodeData } from '@aifuxi/semi-ui-vue/tree';

export function descendantKeys(node: TreeNodeData): string[] {
  return [...(node.key ? [node.key] : []), ...(node.children ?? []).flatMap(descendantKeys)];
}

/** Return a new tree so the public treeData prop observes both cross-parent and sibling moves. */
export function moveTreeNode(nodes: TreeNodeData[], info: TreeDropProps): TreeNodeData[] {
  const draggedKey = info.dragNode.key;
  const targetKey = info.node.key;
  if (!draggedKey || !targetKey || draggedKey === targetKey) return nodes;
  const allNodes = (items: TreeNodeData[]): TreeNodeData[] =>
    items.flatMap((item) => [item, ...allNodes(item.children ?? [])]);
  const dragged = allNodes(nodes).find((item) => item.key === draggedKey);
  if (!dragged || descendantKeys(dragged).includes(targetKey)) return nodes;
  const withoutDragged = (items: TreeNodeData[]): TreeNodeData[] =>
    items
      .filter((item) => item.key !== draggedKey)
      .map((item) => (item.children ? { ...item, children: withoutDragged(item.children) } : item));
  const relativePosition = info.dropPosition - Number(info.node.pos.split('-').at(-1));
  const insert = (items: TreeNodeData[]): TreeNodeData[] =>
    items.flatMap((item) => {
      if (item.key !== targetKey)
        return [item.children ? { ...item, children: insert(item.children) } : item];
      if (!info.dropToGap) return [{ ...item, children: [...(item.children ?? []), dragged] }];
      if (relativePosition === 1 && info.node.children && info.node.expanded) {
        return [{ ...item, children: [dragged, ...(item.children ?? [])] }];
      }
      return relativePosition === -1 ? [dragged, item] : [item, dragged];
    });
  return insert(withoutDragged(nodes));
}

export function replaceChildren(
  nodes: TreeNodeData[],
  key: string,
  children: TreeNodeData[],
): TreeNodeData[] {
  return nodes.map((node) =>
    node.key === key
      ? { ...node, children }
      : node.children
        ? { ...node, children: replaceChildren(node.children, key, children) }
        : node,
  );
}

export function generateTreeData(x = 5, y = 4, z = 3): { nodes: TreeNodeData[]; total: number } {
  let total = 0;
  const level = (depth: number, prefix: string): TreeNodeData[] =>
    Array.from({ length: x }, (_, index) => {
      total++;
      const key = `${prefix}-${index}`;
      return {
        label: `${key}-label`,
        key: `${key}-key`,
        value: `${key}-value`,
        ...(depth >= 0 && index < y ? { children: level(depth - 1, key) } : {}),
      };
    });
  const nodes = level(z, '0');
  return { nodes, total };
}
