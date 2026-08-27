import React, { useRef, useState } from 'react';
import Select from '@semi-v2.102.0/select';

const { Option, OptGroup } = Select;

export function SelectScenario(): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [lastValue, setLastValue] = useState('none');
  const getPopupContainer = (): HTMLElement => host.current ?? document.body;
  return (
    <div ref={host} className="select-scenario" data-testid="select-reference">
      <section className="select-scenario__section" aria-label="基础选择">
        <h3>基础选择</h3>
        <div className="select-scenario__row">
          <Select
            defaultValue="douyin"
            style={{ width: '160px' }}
            data-parity-target="select-basic"
            getPopupContainer={getPopupContainer}
          >
            <Option value="douyin">抖音</Option>
            <Option value="ulikecam">轻颜相机</Option>
            <Option value="jianying" disabled>
              剪映
            </Option>
            <Option value="xigua">西瓜视频</Option>
          </Select>
          <Select
            defaultValue="douyin"
            disabled
            style={{ width: '160px' }}
            data-parity-target="select-disabled"
            getPopupContainer={getPopupContainer}
          >
            <Option value="douyin">抖音</Option>
            <Option value="ulikecam">轻颜相机</Option>
          </Select>
          <Select
            placeholder="请选择业务线"
            showClear
            style={{ width: '160px' }}
            data-parity-target="select-placeholder"
            getPopupContainer={getPopupContainer}
          >
            <Option value="douyin">抖音</Option>
            <Option value="ulikecam">轻颜相机</Option>
          </Select>
        </div>
      </section>
      <section className="select-scenario__section" aria-label="多选与搜索">
        <h3>多选与搜索</h3>
        <div className="select-scenario__row">
          <Select
            multiple
            defaultValue={['douyin', 'ulikecam', 'jianying']}
            maxTagCount={2}
            style={{ width: '300px' }}
            data-parity-target="select-multiple"
            getPopupContainer={getPopupContainer}
          >
            <Option value="douyin">抖音</Option>
            <Option value="ulikecam">轻颜相机</Option>
            <Option value="jianying">剪映</Option>
            <Option value="xigua">西瓜视频</Option>
          </Select>
          <Select
            filter
            defaultOpen
            placeholder="搜索国家"
            style={{ width: '220px' }}
            data-parity-target="select-filter"
            getPopupContainer={getPopupContainer}
            motion={false}
            onChange={(value) => setLastValue(String(value))}
          >
            <OptGroup label="Asia">
              <Option value="china">China</Option>
              <Option value="korea">Korea</Option>
            </OptGroup>
            <OptGroup label="Europe">
              <Option value="france">France</Option>
              <Option value="germany">Germany</Option>
            </OptGroup>
          </Select>
        </div>
      </section>
      <output
        className="select-scenario__status"
        aria-live="polite"
      >{`最近选择：${lastValue}`}</output>
    </div>
  );
}
