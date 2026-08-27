import React, { useRef, useState } from 'react';
import AutoComplete from '@semi-v2.102.0/auto-complete';
import { IconSearch } from '@semi-v2.102.0/icons';

const domains = ['gmail.com', '163.com', 'qq.com'];
const people = [
  { value: '夏可漫', label: 'xiakeman@example.com', team: 'Design' },
  { value: '申悦', label: 'shenyue@example.com', team: 'Engineering' },
  { value: '曲晨一', label: 'quchenyi@example.com', team: 'Product' },
];

export function AutoCompleteScenario(): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(domains.map((domain) => `semi@${domain}`));
  const [value, setValue] = useState('semi');
  const [lastValue, setLastValue] = useState('none');
  const getPopupContainer = (): HTMLElement => host.current ?? document.body;
  const search = (input: string): void => {
    setData(input ? domains.map((domain) => `${input}@${domain}`) : []);
  };

  return (
    <div ref={host} className="auto-complete-scenario" data-testid="auto-complete-reference">
      <section className="auto-complete-scenario__section" aria-label="基础自动完成">
        <h3>基础自动完成</h3>
        <div className="auto-complete-scenario__row">
          <AutoComplete
            data={data}
            value={value}
            showClear
            prefix={<IconSearch />}
            placeholder="搜索..."
            style={{ width: 220 }}
            data-parity-target="auto-complete-basic"
            dropdownClassName="auto-complete-target-basic-options"
            getPopupContainer={getPopupContainer}
            motion={false}
            onSearch={search}
            onChange={(next) => {
              setValue(String(next));
              setLastValue(String(next));
            }}
          />
          <AutoComplete
            data={[1, 2, 3]}
            disabled
            placeholder="禁用"
            style={{ width: 160 }}
            data-parity-target="auto-complete-disabled"
            getPopupContainer={getPopupContainer}
          />
          <AutoComplete
            data={[1, 2, 3]}
            defaultValue="warning"
            size="large"
            validateStatus="warning"
            style={{ width: 180 }}
            data-parity-target="auto-complete-large"
            getPopupContainer={getPopupContainer}
          />
        </div>
      </section>
      <section className="auto-complete-scenario__section" aria-label="候选项与浮层">
        <h3>候选项与浮层</h3>
        <AutoComplete
          data={people}
          defaultOpen
          defaultActiveFirstOption
          style={{ width: 280 }}
          data-parity-target="auto-complete-custom"
          dropdownClassName="auto-complete-target-options"
          getPopupContainer={getPopupContainer}
          motion={false}
          renderItem={(item) => {
            const person = item as (typeof people)[number];
            return (
              <span className="auto-complete-scenario__person">
                <strong>{person.value}</strong>
                <span>{person.label}</span>
              </span>
            );
          }}
          renderSelectedItem={(option) => String(option.label)}
          onChange={(next) => setLastValue(String(next))}
        />
      </section>
      <output className="auto-complete-scenario__status" aria-live="polite">
        {`最近输入：${lastValue}`}
      </output>
    </div>
  );
}
