import React from 'react';

interface CascaderData {
  children?: CascaderData[];
  label?: React.ReactNode;
  value?: string | number;
}

interface CascaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  defaultValue?: string | number | Array<string | number> | Array<Array<string | number>>;
  placeholder?: string;
  treeData?: CascaderData[];
}

function selectedLabels(
  nodes: CascaderData[],
  value: CascaderProps['defaultValue'],
): React.ReactNode[] {
  const path = Array.isArray(value) && !Array.isArray(value[0]) ? value : [];
  const labels: React.ReactNode[] = [];
  let level = nodes;
  for (const part of path as Array<string | number>) {
    const item = level.find((node) => node.value === part);
    if (!item) break;
    labels.push(item.label);
    level = item.children ?? [];
  }
  return labels;
}

export default function SemiCascaderStub({
  className,
  defaultValue,
  placeholder,
  treeData = [],
  ...props
}: CascaderProps): React.ReactElement {
  const labels = selectedLabels(treeData, defaultValue);
  return (
    <div
      aria-label="Cascader"
      className={`semi-cascader semi-cascader-single${className ? ` ${className}` : ''}`}
      role="combobox"
      {...props}
    >
      <div className="semi-cascader-selection">
        <span className="semi-cascader-selection-text">
          {labels.length
            ? labels.map((label, index) => (index ? [' / ', label] : label))
            : placeholder}
        </span>
      </div>
      <span className="semi-cascader-arrow" />
    </div>
  );
}
