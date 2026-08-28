import React, { useState } from 'react';
import TagInput from '@semi-v2.102.0/tag-input';

export function TagInputScenario(): React.ReactElement {
  const [status, setStatus] = useState('none');

  return (
    <div className="tag-input-scenario" data-testid="tag-input-reference">
      <section className="tag-input-scenario__section" aria-label="基础标签输入">
        <h3>基础、尺寸与状态</h3>
        <div className="tag-input-scenario__stack">
          <TagInput
            defaultValue={['抖音', '火山', '西瓜视频']}
            placeholder="请输入..."
            showContentTooltip={false}
            data-parity-target="tag-input-basic"
            onChange={(value) => setStatus(`change:${value.join('|')}`)}
          />
          <div className="tag-input-scenario__row">
            <TagInput
              size="small"
              defaultValue={['small']}
              showContentTooltip={false}
              data-parity-target="tag-input-small"
            />
            <TagInput
              size="large"
              defaultValue={['large']}
              showContentTooltip={false}
              data-parity-target="tag-input-large"
            />
          </div>
          <div className="tag-input-scenario__row">
            <TagInput
              disabled
              defaultValue={['disabled']}
              showContentTooltip={false}
              data-parity-target="tag-input-disabled"
            />
            <TagInput
              validateStatus="warning"
              defaultValue={['warning']}
              showContentTooltip={false}
              data-parity-target="tag-input-warning"
            />
          </div>
        </div>
      </section>

      <section className="tag-input-scenario__section" aria-label="折叠与装饰">
        <h3>折叠、前后缀与清空</h3>
        <div className="tag-input-scenario__stack">
          <TagInput
            prefix="平台"
            suffix="标签"
            defaultValue={['Semi', 'Vue']}
            showClear
            showContentTooltip={false}
            data-parity-target="tag-input-affix"
          />
          <TagInput
            maxTagCount={2}
            defaultValue={['Semi', 'Design', 'Vue', 'Parity']}
            showContentTooltip={false}
            data-parity-target="tag-input-collapsed"
          />
        </div>
      </section>

      <output className="tag-input-scenario__status" aria-live="polite">
        {`最近变化：${status}`}
      </output>
    </div>
  );
}
