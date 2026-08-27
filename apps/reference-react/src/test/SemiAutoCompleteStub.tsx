import React, { useState } from 'react';

type Item = string | number | { value?: string | number; label?: React.ReactNode };
interface Props extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'prefix'
> {
  data?: Item[];
  defaultOpen?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  prefix?: React.ReactNode;
  renderItem?: (item: Item) => React.ReactNode;
  showClear?: boolean;
  value?: string | number;
}

export default function SemiAutoCompleteStub({
  data = [],
  defaultOpen = false,
  defaultValue = '',
  disabled = false,
  onChange,
  placeholder,
  prefix,
  renderItem,
  value,
  ...rest
}: Props): React.ReactElement {
  const [internal, setInternal] = useState(defaultValue);
  const displayed = value ?? internal;
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  );
  return (
    <div {...dataAttrs} className="semi-autocomplete" style={rest.style}>
      <div className="semi-input-wrapper semi-input-wrapper-default">
        {prefix ? <span className="semi-input-prefix">{prefix}</span> : null}
        <input
          className="semi-input semi-input-default"
          disabled={disabled}
          placeholder={placeholder}
          value={displayed}
          onChange={(event) => {
            setInternal(event.target.value);
            onChange?.(event.target.value);
          }}
        />
      </div>
      {defaultOpen ? (
        <div className="semi-autocomplete-option-list" role="listbox">
          {data.map((item, index) => (
            <div className="semi-autocomplete-option" role="option" key={index}>
              {renderItem?.(item) ?? (typeof item === 'object' ? (item.label ?? item.value) : item)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
