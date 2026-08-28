import React from 'react';

interface NodeData {
  key: string;
  label: React.ReactNode;
  value?: unknown;
  disabled?: boolean;
  children?: NodeData[];
}
interface Props {
  treeData?: NodeData[];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultValue?: unknown;
  multiple?: boolean;
  filterTreeNode?: boolean;
  directory?: boolean;
  showLine?: boolean;
  onChange?: (value: unknown) => void;
  'data-parity-target'?: string;
}

export default function Tree({
  treeData = [],
  defaultExpandAll,
  defaultExpandedKeys = [],
  defaultValue,
  multiple,
  filterTreeNode,
  onChange,
  ...props
}: Props): React.ReactElement {
  const expanded = new Set(
    defaultExpandAll
      ? treeData.flatMap((node) => [node.key, ...(node.children ?? []).map((child) => child.key)])
      : defaultExpandedKeys,
  );
  const selected = new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  const render = (nodes: NodeData[], level = 0): React.ReactNode =>
    nodes.flatMap((node) => {
      const active = selected.has(node.value ?? node.key);
      const current = (
        <li
          key={node.key}
          role="treeitem"
          data-key={node.key}
          className={`semi-tree-option${active ? ' semi-tree-option-selected' : ''}`}
          onClick={() => !node.disabled && onChange?.(node.value ?? node.key)}
        >
          {multiple ? (
            <span className={`semi-checkbox${active ? ' semi-checkbox-checked' : ''}`} />
          ) : null}
          <span className="semi-tree-option-label-text">{node.label}</span>
        </li>
      );
      return [current, ...(expanded.has(node.key) ? [render(node.children ?? [], level + 1)] : [])];
    });
  return (
    <div className="semi-tree-wrapper" {...props}>
      {filterTreeNode ? (
        <div className="semi-tree-search-wrapper">
          <input aria-label="Filter Tree" />
        </div>
      ) : null}
      <div className="semi-tree-option-list semi-tree-option-list-block" role="tree">
        {render(treeData)}
      </div>
    </div>
  );
}
