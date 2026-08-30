import React from 'react';
import DatePicker from '@semi-v2.102.0/date-picker';

const selectedDate = new Date(2024, 4, 10, 0, 0, 0, 0);
const pickerDate = new Date(2024, 4, 1, 0, 0, 0, 0);

export function DatePickerScenario({
  direction,
}: {
  direction: 'ltr' | 'rtl';
}): React.ReactElement {
  return (
    <div className="date-picker-scenario" data-testid="date-picker-reference">
      <div data-parity-target="date-picker-trigger">
        <DatePicker
          defaultValue={selectedDate}
          defaultPickerValue={pickerDate}
          dropdownClassName="date-picker-target-popup"
          motion={false}
          open={true}
          position={direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
          onChange={() => undefined}
          onOpenChange={() => undefined}
        />
      </div>
    </div>
  );
}
