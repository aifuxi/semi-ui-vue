import React, { useState } from 'react';
import SideSheet from '@semi-v2.102.0/side-sheet';
import ConfigProvider from '@semi-v2.102.0/config-provider';

export interface SideSheetScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function SideSheetScenario({ direction }: SideSheetScenarioProps): React.ReactElement {
  const [visible, setVisible] = useState(true);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <ConfigProvider direction={direction}>
      <div className="side-sheet-scenario">
        <button
          type="button"
          className="side-sheet-scenario__open"
          data-action="open-side-sheet"
          onClick={() => setVisible(true)}
        >
          打开资源详情
        </button>
        <div
          ref={setContainer}
          className="side-sheet-scenario__stage"
          data-testid="side-sheet-reference"
        >
          <span className="side-sheet-scenario__backdrop-label">项目工作台</span>
          {container ? (
            <SideSheet
              data-parity-target="side-sheet-basic"
              visible={visible}
              title="资源详情"
              width="72%"
              motion={false}
              getPopupContainer={() => container}
              footer={
                <button type="button" className="side-sheet-scenario__footer">
                  保存变更
                </button>
              }
              onCancel={() => setVisible(false)}
            >
              <p className="side-sheet-scenario__body-title">生产环境</p>
              <p>3 项配置等待确认，提交后立即生效。</p>
            </SideSheet>
          ) : null}
        </div>
      </div>
    </ConfigProvider>
  );
}
