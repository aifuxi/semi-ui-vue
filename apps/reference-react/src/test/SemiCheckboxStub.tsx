import React, { useState } from 'react';

type ChangeEvent = { target: { checked: boolean; value?: unknown } };
interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  extra?: React.ReactNode;
  indeterminate?: boolean;
  value?: unknown;
  type?: 'default' | 'card' | 'pureCard';
  onChange?: (event: ChangeEvent) => void;
}
interface GroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  defaultValue?: unknown[];
  direction?: 'horizontal' | 'vertical';
  options?: Array<string | { label: React.ReactNode; value: unknown }>;
  type?: 'default' | 'card' | 'pureCard';
  onChange?: (value: unknown[]) => void;
}

interface GroupContextValue {
  type: 'default' | 'card' | 'pureCard';
  value: unknown[];
  onChange(value: unknown, event: ChangeEvent): void;
}

const CheckboxGroupContext = React.createContext<GroupContextValue | undefined>(undefined);

function CheckboxBase({
  checked,
  defaultChecked = false,
  disabled,
  extra,
  indeterminate,
  value,
  type = 'default',
  children,
  onChange,
  ...rest
}: CheckboxProps): React.ReactElement {
  const group = React.useContext(CheckboxGroupContext);
  const [internal, setInternal] = useState(defaultChecked);
  const actualType = group?.type ?? type;
  const actual = group ? group.value.includes(value) : (checked ?? internal);
  return (
    <span
      {...rest}
      className={`semi-checkbox${actual ? ' semi-checkbox-checked' : ''}${disabled ? ' semi-checkbox-disabled' : ''}${indeterminate ? ' semi-checkbox-indeterminate' : ''}${actualType !== 'default' ? ' semi-checkbox-cardType' : ''}`}
      onClick={() => {
        if (disabled) return;
        const event = { target: { checked: !actual, value } };
        if (group) group.onChange(value, event);
        else setInternal(!actual);
        onChange?.(event);
      }}
    >
      <span className={`semi-checkbox-inner${actual ? ' semi-checkbox-inner-checked' : ''}`}>
        <input type="checkbox" checked={actual} disabled={disabled} readOnly />
        <span className="semi-checkbox-inner-display" />
      </span>
      {children || extra ? (
        <div className="semi-checkbox-content">
          {children ? <span className="semi-checkbox-addon">{children}</span> : null}
          {extra ? <div className="semi-checkbox-extra">{extra}</div> : null}
        </div>
      ) : null}
    </span>
  );
}

function Group({
  defaultValue = [],
  direction = 'vertical',
  options,
  type = 'default',
  children,
  onChange,
  ...rest
}: GroupProps): React.ReactElement {
  const [value, setValue] = useState(defaultValue);
  const handleOptionChange = (optionValue: unknown, event: ChangeEvent): void => {
    const nextValue = event.target.checked
      ? [...value, optionValue]
      : value.filter((item) => item !== optionValue);
    setValue(nextValue);
    onChange?.(nextValue);
  };
  const content =
    options?.map((option, index) =>
      typeof option === 'string' ? (
        <CheckboxBase key={index} value={option}>
          {option}
        </CheckboxBase>
      ) : (
        <CheckboxBase key={index} value={option.value}>
          {option.label}
        </CheckboxBase>
      ),
    ) ?? children;
  return (
    <CheckboxGroupContext.Provider
      value={{
        type,
        value,
        onChange: (optionValue, event) => handleOptionChange(optionValue, event),
      }}
    >
      <div
        {...rest}
        role="list"
        className={`semi-checkboxGroup semi-checkboxGroup-wrapper semi-checkboxGroup-${direction}${type !== 'default' ? ` semi-checkboxGroup-${direction}-cardType` : ''}`}
      >
        {content}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

const Checkbox = Object.assign(CheckboxBase, { Group });
export default Checkbox;
