import React, { useState } from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Feedback from '@semi-v2.102.0/feedback';

export interface FeedbackScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function FeedbackScenario({ direction }: FeedbackScenarioProps): React.ReactElement {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [popupVisible, setPopupVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastValue, setLastValue] = useState('未选择');

  return (
    <ConfigProvider direction={direction}>
      <div className="feedback-scenario">
        <div className="feedback-scenario__actions">
          <button
            type="button"
            data-action="open-feedback-popup"
            onClick={() => setPopupVisible(true)}
          >
            打开表情反馈
          </button>
          <button
            type="button"
            data-action="open-feedback-modal"
            onClick={() => setModalVisible(true)}
          >
            打开单选反馈
          </button>
          <span role="status">最近选择：{lastValue}</span>
        </div>
        <div
          ref={setContainer}
          className="feedback-scenario__stage"
          data-testid="feedback-reference"
        >
          <span className="feedback-scenario__backdrop-label">体验反馈工作台</span>
          {container ? (
            <>
              <Feedback
                data-parity-target="feedback-basic"
                visible={popupVisible}
                mode="popup"
                type="emoji"
                title="这次体验怎么样？"
                motion={false}
                getPopupContainer={() => container}
                onValueChange={(value) => setLastValue(JSON.stringify(value))}
                onCancel={() => setPopupVisible(false)}
                onOk={() => setPopupVisible(false)}
              />
              <Feedback
                visible={modalVisible}
                mode="modal"
                type="radio"
                title="主要问题是什么？"
                motion={false}
                getPopupContainer={() => container}
                radioGroupProps={{
                  options: [
                    { label: '交互不够清晰', value: 'interaction' },
                    { label: '响应速度较慢', value: 'performance' },
                    { label: '功能不符合预期', value: 'feature' },
                  ],
                }}
                onValueChange={(value) => setLastValue(JSON.stringify(value))}
                onCancel={() => setModalVisible(false)}
                onOk={() => setModalVisible(false)}
              />
            </>
          ) : null}
        </div>
      </div>
    </ConfigProvider>
  );
}
