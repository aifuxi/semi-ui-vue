import React from 'react';

export interface StubColorValue {
  hsva: { h: number; s: number; v: number; a: number };
  rgba: { r: number; g: number; b: number; a: number };
  hex: string;
}

function colorStringToValue(raw: string): StubColorValue {
  const hex = raw.slice(1);
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const a = hex.length >= 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return { hsva: { h: 0, s: 0, v: 0, a }, rgba: { r, g, b, a }, hex: raw };
}

function SemiColorPickerStub({
  defaultValue,
  height = 280,
  usePopover,
  width = 280,
}: {
  defaultValue?: StubColorValue;
  height?: number;
  usePopover?: boolean;
  width?: number;
}): React.ReactElement {
  if (usePopover) {
    return <div className="semi-colorPicker-popover-defaultChildren" />;
  }
  return (
    <div className="semi-colorPicker" data-color={defaultValue?.hex}>
      <div className="semi-colorPicker-colorChooseArea" style={{ width, height }} />
      <div className="semi-colorPicker-colorSlider" />
      <div className="semi-colorPicker-alphaSlider" />
      <div className="semi-colorPicker-dataPart" />
    </div>
  );
}

SemiColorPickerStub.colorStringToValue = colorStringToValue;

export default SemiColorPickerStub as typeof SemiColorPickerStub & {
  colorStringToValue: typeof colorStringToValue;
};
