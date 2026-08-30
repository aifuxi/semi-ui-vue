import React from 'react';

interface DatePickerStubProps {
  defaultValue?: Date;
  id?: string;
}

export default function SemiDatePickerStub({
  defaultValue,
  id,
}: DatePickerStubProps): React.ReactElement {
  const value = defaultValue
    ? `${defaultValue.getFullYear()}-${String(defaultValue.getMonth() + 1).padStart(2, '0')}-${String(defaultValue.getDate()).padStart(2, '0')}`
    : '';
  return (
    <div className="semi-datepicker">
      <div className="semi-input-wrapper">
        <input id={id} className="semi-input" readOnly value={value} />
      </div>
    </div>
  );
}
