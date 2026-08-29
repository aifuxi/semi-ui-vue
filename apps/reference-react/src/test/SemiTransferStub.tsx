import React from 'react';

interface TransferDataItem {
  disabled?: boolean;
  key: string | number;
  label?: React.ReactNode;
  value?: string | number;
}

interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  dataSource?: TransferDataItem[];
  defaultValue?: Array<string | number>;
}

export default function Transfer({
  className,
  dataSource = [],
  defaultValue = [],
  ...props
}: TransferProps): React.ReactElement {
  const selected = new Set(defaultValue);
  const selectedItems = dataSource.filter((item) => selected.has(item.value ?? item.key));
  return (
    <div className={`semi-transfer${className ? ` ${className}` : ''}`} {...props}>
      <section className="semi-transfer-left">
        <div className="semi-transfer-filter">
          <input placeholder="搜索" />
        </div>
        <div className="semi-transfer-header semi-transfer-left-header">
          总个数：{dataSource.length}
        </div>
        <div className="semi-transfer-left-list">
          {dataSource.map((item) => (
            <label
              className={`semi-checkbox semi-transfer-item${item.disabled ? ' semi-transfer-item-disabled' : ''}`}
              key={item.key}
            >
              <input
                checked={selected.has(item.value ?? item.key)}
                disabled={item.disabled}
                readOnly
              />
              {item.label}
            </label>
          ))}
        </div>
      </section>
      <section className="semi-transfer-right">
        <div className="semi-transfer-header semi-transfer-right-header">
          已选个数：{selectedItems.length}
        </div>
        <div className="semi-transfer-right-list">
          {selectedItems.map((item) => (
            <div className="semi-transfer-item semi-transfer-right-item" key={item.key}>
              {item.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
