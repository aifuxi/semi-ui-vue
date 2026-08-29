import React, { useState } from 'react';
import ScrollList from '@semi-v2.102.0/scroll-list';
import ScrollItem from '@semi-v2.102.0/scroll-item';
import type { ScrollItemData, ScrollItemSelectData } from '@semi-v2.102.0/scroll-list';

const periods: ScrollItemData[] = [
  { value: 'AM', transform: () => 'Morning' },
  { value: 'PM' },
  { value: 'Night', disabled: true },
];
const hours: ScrollItemData[] = Array.from({ length: 8 }, (_, index) => ({
  value: index + 1,
  disabled: index === 5,
}));
const minutes: ScrollItemData[] = Array.from({ length: 8 }, (_, index) => ({
  value: index * 5,
  disabled: index === 3,
}));

export function ScrollListScenario(): React.ReactElement {
  const [normalPeriod, setNormalPeriod] = useState(0);
  const [normalHour, setNormalHour] = useState(2);
  const [wheelPeriod, setWheelPeriod] = useState(1);
  const [wheelHour, setWheelHour] = useState(3);
  const [wheelMinute, setWheelMinute] = useState(4);

  const selectNormal = (data: ScrollItemSelectData) => {
    if (data.type === 'normal-period') setNormalPeriod(data.index);
    if (data.type === 'normal-hour') setNormalHour(data.index);
  };
  const selectWheel = (data: ScrollItemSelectData) => {
    if (data.type === 'wheel-period') setWheelPeriod(data.index);
    if (data.type === 'wheel-hour') setWheelHour(data.index);
    if (data.type === 'wheel-minute') setWheelMinute(data.index);
  };

  return (
    <div className="scroll-list-scenario" data-testid="scroll-list-reference">
      <section data-parity-target="scroll-list-normal">
        <ScrollList bodyHeight={180} header="Normal columns" footer={<span>Click to select</span>}>
          <ScrollItem
            aria-label="Normal period"
            list={periods}
            mode="normal"
            onSelect={selectNormal}
            selectedIndex={normalPeriod}
            type="normal-period"
          />
          <ScrollItem
            aria-label="Normal hour"
            list={hours}
            mode="normal"
            onSelect={selectNormal}
            selectedIndex={normalHour}
            transform={(value) => `${String(value)} h`}
            type="normal-hour"
          />
        </ScrollList>
      </section>
      <section data-parity-target="scroll-list-wheel">
        <ScrollList bodyHeight={180} header="Wheel columns" footer={<span>Scroll to select</span>}>
          <ScrollItem
            aria-label="Wheel period"
            list={periods}
            mode="wheel"
            motion={false}
            onSelect={selectWheel}
            selectedIndex={wheelPeriod}
            type="wheel-period"
          />
          <ScrollItem
            aria-label="Wheel hour"
            cycled
            list={hours}
            mode="wheel"
            motion={false}
            onSelect={selectWheel}
            selectedIndex={wheelHour}
            type="wheel-hour"
          />
          <ScrollItem
            aria-label="Wheel minute"
            list={minutes}
            mode="wheel"
            motion={false}
            onSelect={selectWheel}
            selectedIndex={wheelMinute}
            transform={(value) => `${String(value)} min`}
            type="wheel-minute"
          />
        </ScrollList>
      </section>
    </div>
  );
}
