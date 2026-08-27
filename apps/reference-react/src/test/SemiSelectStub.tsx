import React, { useState } from 'react';

type Primitive = string | number;
interface OptionProps {
  children?: React.ReactNode;
  disabled?: boolean;
  value: Primitive;
}
interface GroupProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}
interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'placeholder'
> {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  defaultValue?: Primitive | Primitive[];
  disabled?: boolean;
  filter?: boolean;
  getPopupContainer?: () => HTMLElement;
  maxTagCount?: number;
  motion?: boolean;
  multiple?: boolean;
  onChange?: (value: Primitive | Primitive[]) => void;
  placeholder?: React.ReactNode;
  showClear?: boolean;
}

function Option(props: OptionProps): null {
  void props;
  return null;
}

function OptGroup(props: GroupProps): null {
  void props;
  return null;
}

function optionNodes(children: React.ReactNode): React.ReactElement<OptionProps>[] {
  const result: React.ReactElement<OptionProps>[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === Option) result.push(child as React.ReactElement<OptionProps>);
    if (child.type === OptGroup) result.push(...optionNodes((child.props as GroupProps).children));
  });
  return result;
}

function SelectComponent({
  children,
  className,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  filter = false,
  maxTagCount,
  multiple = false,
  placeholder,
  style,
  ...rest
}: SelectProps): React.ReactElement {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue === undefined
      ? []
      : [defaultValue];
  const [selected] = useState(initial);
  const options = optionNodes(children);
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  );
  const labels = selected.map(
    (value) => options.find((option) => option.props.value === value)?.props.children ?? value,
  );

  return (
    <div className={className} style={style}>
      <div
        {...dataAttrs}
        className={`semi-select ${multiple ? 'semi-select-multiple' : 'semi-select-single'}${disabled ? ' semi-select-disabled' : ''}${filter ? ' semi-select-filterable' : ''}`}
        role="combobox"
        aria-disabled={disabled}
        aria-expanded={defaultOpen}
      >
        {multiple
          ? labels.map((label, index) => (
              <span className="semi-tag" key={selected[index]}>
                {label}
              </span>
            ))
          : (labels[0] ?? placeholder)}
        {maxTagCount && labels.length > maxTagCount ? (
          <span>+{labels.length - maxTagCount}</span>
        ) : null}
      </div>
      {defaultOpen ? (
        <div className="semi-select-option-list-wrapper">
          {options.map((option) => (
            <div className="semi-select-option" key={option.props.value}>
              {option.props.children}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const Select = Object.assign(SelectComponent, { Option, OptGroup });
export default Select;
