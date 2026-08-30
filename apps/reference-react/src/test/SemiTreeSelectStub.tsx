import React from 'react';

interface TreeSelectNodeData {
  children?: TreeSelectNodeData[];
  disabled?: boolean;
  key?: string;
  label?: React.ReactNode;
  value?: string | number;
}

interface TreeSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  defaultValue?: string | number | object | Array<string | number | object>;
  placeholder?: string;
  treeData?: TreeSelectNodeData[];
}

function findSelected(
  nodes: TreeSelectNodeData[],
  value: TreeSelectProps['defaultValue'],
): TreeSelectNodeData | undefined {
  for (const node of nodes) {
    if (node.value === value) return node;
    const child = findSelected(node.children ?? [], value);
    if (child) return child;
  }
  return undefined;
}

export default function TreeSelect({
  className,
  defaultValue,
  placeholder,
  treeData = [],
  ...props
}: TreeSelectProps): React.ReactElement {
  const selected = findSelected(treeData, defaultValue);
  return (
    <div
      aria-label="TreeSelect"
      className={`semi-tree-select semi-tree-select-single${className ? ` ${className}` : ''}`}
      role="combobox"
      {...props}
    >
      <div className="semi-tree-select-selection">
        <span className="semi-tree-select-selection-text">{selected?.label ?? placeholder}</span>
      </div>
      <span className="semi-tree-select-arrow" />
    </div>
  );
}
