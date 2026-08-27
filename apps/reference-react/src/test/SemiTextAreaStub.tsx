import React, { useState } from 'react';

interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> {
  maxCount?: number;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showCounter?: boolean;
  showLineNumber?: boolean;
}

export default function SemiTextAreaStub({
  className,
  defaultValue,
  maxCount,
  onChange,
  showCounter,
  showLineNumber,
  value: controlledValue,
  ...rest
}: TextAreaProps): React.ReactElement {
  const [value, setValue] = useState(String(controlledValue ?? defaultValue ?? ''));
  const actualValue = controlledValue === undefined ? value : String(controlledValue);
  return (
    <div className={`semi-input-textarea-wrapper${className ? ` ${className}` : ''}`}>
      {showLineNumber ? (
        <div className="semi-input-textarea-lineNumber">
          {actualValue.split('\n').map((_line, index) => (
            <div className="semi-input-textarea-lineNumber-item" key={index}>
              {index + 1}
            </div>
          ))}
        </div>
      ) : null}
      <textarea
        {...rest}
        className="semi-input-textarea"
        value={actualValue}
        onChange={(event) => {
          if (controlledValue === undefined) setValue(event.target.value);
          onChange?.(event.target.value, event);
        }}
      />
      {showCounter || maxCount ? (
        <div className="semi-input-textarea-counter">
          {actualValue.length}
          {maxCount ? `/${maxCount}` : ''}
        </div>
      ) : null}
    </div>
  );
}
