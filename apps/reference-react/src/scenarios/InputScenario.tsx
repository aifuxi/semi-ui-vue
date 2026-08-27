import React, { useState } from 'react';
import Input from '@semi-v2.102.0/input';
import InputGroup from '@semi-v2.102.0/input-group';
import TextArea from '@semi-v2.102.0/textarea';

export function InputScenario(): React.ReactElement {
  const [lastValue, setLastValue] = useState('none');

  return (
    <div className="input-scenario" data-testid="input-reference">
      <section className="input-scenario__section" aria-label="基础输入框">
        <h3>基础输入框</h3>
        <div className="input-scenario__grid">
          <Input
            defaultValue="hi"
            className="input-target-basic"
            aria-label="基本输入框"
            data-parity-target="input-basic"
            onChange={(value) => setLastValue(`input:${value}`)}
          />
          <Input
            size="large"
            className="input-target-large"
            placeholder="large"
            aria-label="大输入框"
            data-parity-target="input-large"
          />
          <Input
            prefix="https://"
            className="input-target-affix"
            suffix=".com"
            defaultValue="semi.design"
            aria-label="带前后缀"
            data-parity-target="input-affix"
          />
          <Input
            addonBefore="http://"
            className="input-target-addon"
            addonAfter=".com"
            defaultValue="semi"
            aria-label="带前后标签"
            data-parity-target="input-addon"
          />
          <Input
            mode="password"
            className="input-target-password"
            defaultValue="123456"
            aria-label="密码输入框"
            data-parity-target="input-password"
          />
          <Input
            showClear
            className="input-target-clear"
            defaultValue="click to clear"
            aria-label="可清除输入框"
            data-parity-target="input-clear"
            onClear={() => setLastValue('clear')}
          />
          <Input
            disabled
            className="input-target-disabled"
            defaultValue="disabled input"
            aria-label="禁用输入框"
            data-parity-target="input-disabled"
          />
          <Input
            validateStatus="error"
            className="input-target-error"
            defaultValue="error input"
            aria-label="错误输入框"
            data-parity-target="input-error"
          />
        </div>
      </section>

      <section className="input-scenario__section" aria-label="输入框组合与多行文本">
        <h3>输入框组合与多行文本</h3>
        <InputGroup
          label={{ text: '网址', name: 'website', required: true }}
          className="input-target-group"
          data-parity-target="input-group"
        >
          <Input defaultValue="https://" aria-label="协议" />
          <Input defaultValue="semi.design" aria-label="域名" />
        </InputGroup>
        <div className="input-scenario__textareas">
          <TextArea
            defaultValue={'Semi Design\nVue parity'}
            className="input-target-textarea-counter"
            showCounter
            maxCount={80}
            aria-label="带计数文本域"
            data-parity-target="textarea-counter"
            onChange={(value) => setLastValue(`textarea:${value}`)}
          />
          <TextArea
            defaultValue={'第一行\n第二行\n第三行'}
            className="input-target-textarea-line-number"
            showLineNumber
            rows={4}
            aria-label="带行号文本域"
            data-parity-target="textarea-line-number"
          />
        </div>
      </section>
      <output className="input-scenario__status" aria-live="polite">
        {`最近变化：${lastValue}`}
      </output>
    </div>
  );
}
