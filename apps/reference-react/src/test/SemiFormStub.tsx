import React from 'react';

interface StubFormProps {
  children?: React.ReactNode;
  className?: string;
}

interface StubFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string;
  helpText?: React.ReactNode;
  initValue?: unknown;
  label?: React.ReactNode;
  rules?: Array<{ required?: boolean }>;
}

function StubField({ field, helpText, initValue, label, rules, ...inputProps }: StubFieldProps) {
  const required = rules?.some((rule) => rule.required);
  return (
    <div className="semi-form-field" x-field-id={field} x-label-pos="top">
      <label
        className={`semi-form-field-label semi-form-field-label-left${required ? ' semi-form-field-label-required' : ''}`}
        htmlFor={field}
      >
        <div className="semi-form-field-label-text">{label}</div>
      </label>
      <div className="semi-form-field-main">
        <span className="semi-input-wrapper semi-input-wrapper-default">
          <input
            {...inputProps}
            className="semi-input semi-input-default"
            defaultValue={String(initValue ?? '')}
            id={field}
          />
        </span>
        {helpText ? <div className="semi-form-field-help-text">{helpText}</div> : null}
      </div>
    </div>
  );
}

const StubFormBase = ({ children, className }: StubFormProps) => (
  <form className={`${className ?? ''} semi-form semi-form-vertical`}>{children}</form>
);

const StubForm = Object.assign(StubFormBase, { Input: StubField });

export { StubForm as Form };
export default StubForm;
