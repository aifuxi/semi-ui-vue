import React, { useState } from 'react';
import SideSheet from '@semi-v2.102.0/side-sheet';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import { sheetReview } from '../../../../packages/test-infra/src/root-theme-review';

export interface SideSheetScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function SideSheetScenario({ direction }: SideSheetScenarioProps): React.ReactElement {
  /** 只在审查尺寸时使用组件自身宽度，默认仍为原场景的 72%。 */
  const review = sheetReview(window.location.search);
  /** 与 Vue 一致，通过公开容器入口审查视口中的内置尺寸。 */
  const bodyPortal = new URLSearchParams(window.location.search).has('reviewSheetBody');
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
              {...review}
              data-parity-target="side-sheet-basic"
              visible={visible}
              title="资源详情"
              {...(review.size ? {} : { width: '72%' })}
              motion={false}
              {...(bodyPortal ? {} : { getPopupContainer: () => container })}
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
