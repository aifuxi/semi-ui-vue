import React, { useContext, useState } from 'react';
import type {
  RadioChangeEvent,
  RadioGroupProps,
  RadioProps,
  RadioValue,
} from '@semi-v2.102.0/radio';

interface GroupContextValue {
  value: RadioValue | undefined;
  disabled: boolean;
  mode: '' | 'advanced';
  name: string;
  type: 'default' | 'button' | 'card' | 'pureCard';
  buttonSize: 'small' | 'middle' | 'large';
  onChange(event: RadioChangeEvent): void;
}

const GroupContext = React.createContext<GroupContextValue | undefined>(undefined);

function RadioBase({
  checked,
  defaultChecked = false,
  disabled = false,
  extra,
  mode = '',
  name,
  type = 'default',
  value,
  children,
  onChange,
  className,
  ...rest
}: RadioProps): React.ReactElement {
  const group = useContext(GroupContext);
  const [internal, setInternal] = useState(defaultChecked);
  const actual = group ? group.value === value : (checked ?? internal);
  const actualDisabled = disabled || Boolean(group?.disabled);
  const actualType = group?.type ?? type;
  const button = actualType === 'button';
  const card = actualType === 'card' || actualType === 'pureCard';
  return (
    <label
      {...rest}
      className={`semi-radio${actual ? ' semi-radio-checked' : ''}${actualDisabled ? ' semi-radio-disabled' : ''}${button ? ' semi-radio-buttonRadioGroup' : ''}${group?.buttonSize && button ? ` semi-radio-buttonRadioGroup-${group.buttonSize}` : ''}${card ? ' semi-radio-cardRadioGroup' : ''}${className ? ` ${className}` : ''}`}
    >
      <span
        className={`semi-radio-inner${actual ? ' semi-radio-inner-checked' : ''}${button ? ' semi-radio-inner-buttonRadio' : ''}${actualType === 'pureCard' ? ' semi-radio-inner-pureCardRadio' : ''}`}
      >
        <input
          type={(group?.mode ?? mode) === 'advanced' ? 'checkbox' : 'radio'}
          checked={actual}
          disabled={actualDisabled}
          name={name ?? group?.name}
          readOnly
          onClick={() => {
            if (actualDisabled) return;
            const event = { target: { checked: !actual, value } };
            group?.onChange(event);
            if (!group && checked === undefined) setInternal(!actual);
            onChange?.(event);
          }}
        />
        <span className={button ? '' : 'semi-radio-inner-display'} />
      </span>
      {children || extra ? (
        <div className="semi-radio-content">
          {children ? (
            <span className={button ? 'semi-radio-addon-buttonRadio' : 'semi-radio-addon'}>
              {children}
            </span>
          ) : null}
          {extra && !button ? <div className="semi-radio-extra">{extra}</div> : null}
        </div>
      ) : null}
    </label>
  );
}

function Group({
  defaultValue,
  direction = 'horizontal',
  disabled = false,
  mode = '',
  name = 'default',
  options,
  type = 'default',
  buttonSize = 'middle',
  children,
  onChange,
  className,
  ...rest
}: RadioGroupProps): React.ReactElement {
  const [value, setValue] = useState(defaultValue);
  const content =
    options?.map((option, index) =>
      typeof option === 'string' ? (
        <RadioBase key={index} value={option}>
          {option}
        </RadioBase>
      ) : (
        <RadioBase key={index} {...option}>
          {option.label}
        </RadioBase>
      ),
    ) ?? children;
  return (
    <GroupContext.Provider
      value={{
        value,
        disabled,
        mode,
        name,
        type,
        buttonSize,
        onChange: (event) => {
          const next =
            mode === 'advanced' && !event.target.checked ? undefined : event.target.value;
          setValue(next);
          onChange?.({ ...event, target: { ...event.target, value: next } });
        },
      }}
    >
      <div
        {...rest}
        className={`semi-radioGroup semi-radioGroup-wrapper${type === 'button' ? ' semi-radioGroup-buttonRadio' : ` semi-radioGroup-${direction}`}${className ? ` ${className}` : ''}`}
      >
        {content}
      </div>
    </GroupContext.Provider>
  );
}

const Radio = Object.assign(RadioBase, { Group });
export default Radio;
