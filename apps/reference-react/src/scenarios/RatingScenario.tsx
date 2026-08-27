import React, { useState } from 'react';
import Rating from '@semi-v2.102.0/rating';

const TOOLTIPS = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

export function RatingScenario(): React.ReactElement {
  const [status, setStatus] = useState('none');

  return (
    <div className="rating-scenario" data-testid="rating-reference">
      <section className="rating-scenario__section" aria-label="基础评分">
        <h3>基础、半星与状态</h3>
        <div className="rating-scenario__row">
          <Rating
            defaultValue={3}
            aria-label="基础评分"
            data-parity-target="rating-default"
            onChange={(value) => setStatus(`change:${value}`)}
          />
          <Rating
            allowHalf
            defaultValue={3.5}
            aria-label="半星评分"
            data-parity-target="rating-half"
          />
          <Rating
            disabled
            defaultValue={2}
            aria-label="禁用评分"
            data-parity-target="rating-disabled"
          />
        </div>
      </section>

      <section className="rating-scenario__section" aria-label="尺寸与字符">
        <h3>尺寸、自定义字符与提示</h3>
        <div className="rating-scenario__row rating-scenario__row--center">
          <Rating size="small" defaultValue={4} data-parity-target="rating-small" />
          <Rating size={32} character="S" defaultValue={3} data-parity-target="rating-custom" />
          <Rating
            tooltips={TOOLTIPS}
            defaultValue={2}
            data-parity-target="rating-tooltip"
            onHoverChange={(value) => setStatus(`hover:${String(value)}`)}
          />
        </div>
      </section>

      <output className="rating-scenario__status" aria-live="polite">
        {`最近变化：${status}`}
      </output>
    </div>
  );
}
