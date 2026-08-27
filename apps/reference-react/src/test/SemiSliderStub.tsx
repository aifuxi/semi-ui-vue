import React from 'react';

interface SliderStubProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  'aria-label'?: string;
  defaultValue?: number | number[];
  disabled?: boolean;
  handleDot?: { color?: string; size?: string } | Array<{ color?: string; size?: string }>;
  marks?: Record<number, string>;
  max?: number;
  min?: number;
  range?: boolean;
  vertical?: boolean;
}

export default function SemiSliderStub({
  defaultValue,
  disabled = false,
  handleDot,
  marks,
  max = 100,
  min = 0,
  range = false,
  vertical = false,
  ...rest
}: SliderStubProps): React.ReactElement {
  const value = defaultValue ?? (range ? [0, 0] : 0);
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className={vertical ? 'semi-slider-vertical' : 'semi-slider'}>
      <div
        {...rest}
        className={`semi-slider-wrapper${vertical ? ' semi-slider-vertical-wrapper' : ''}${disabled ? ' semi-slider-disabled' : ''}`}
      >
        <div className="semi-slider-rail" />
        <div className="semi-slider-track" />
        {marks ? (
          <div className="semi-slider-marks">
            {Object.entries(marks).map(([mark, label]) => (
              <span className="semi-slider-mark" key={mark}>
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <div>
          {values.map((item, index) => (
            <span
              aria-disabled={disabled}
              aria-valuemax={max}
              aria-valuemin={min}
              aria-valuenow={item}
              className="semi-slider-handle"
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
            >
              {handleDot ? <span className="semi-slider-handle-dot" /> : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
