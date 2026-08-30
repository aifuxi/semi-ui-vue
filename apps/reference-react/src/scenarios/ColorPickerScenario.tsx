import React from 'react';
import ColorPicker from '@semi-v2.102.0/color-picker';

const initialColor = ColorPicker.colorStringToValue('#7856ffcc');

export function ColorPickerScenario(): React.ReactElement {
  return (
    <div className="color-picker-scenario" data-testid="color-picker-reference">
      <div className="color-picker-scenario__inline" data-parity-target="color-picker-inline">
        <ColorPicker
          alpha={true}
          eyeDropper={false}
          width={220}
          height={140}
          defaultValue={initialColor}
          onChange={() => undefined}
        />
      </div>
      <div
        className="color-picker-scenario__popover-trigger"
        data-parity-target="color-picker-trigger"
      >
        <ColorPicker
          alpha={true}
          eyeDropper={false}
          width={180}
          height={110}
          defaultValue={initialColor}
          onChange={() => undefined}
          usePopover={true}
          popoverProps={{
            className: 'color-picker-target-popover',
            motion: false,
            position: 'bottom',
            trigger: 'custom',
            visible: true,
          }}
        />
      </div>
    </div>
  );
}
