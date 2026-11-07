import React, { useState } from 'react';
import Modal from '@semi-v2.102.0/modal';
import Button from '@semi-v2.102.0/button';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import { modalReview } from '../../../../packages/test-infra/src/root-theme-review';

export interface ModalScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function ModalScenario({ direction }: ModalScenarioProps): React.ReactElement {
  /** 与 Vue 使用相同公开参数，不改变固定组件实现或样式。 */
  const review = modalReview(window.location.search);
  const [visible, setVisible] = useState(true);

  return (
    <ConfigProvider direction={direction}>
      <div className="modal-scenario" data-testid="modal-reference">
        <Button data-action="open-modal" onClick={() => setVisible(true)}>
          打开发布确认
        </Button>
        <Modal
          {...review}
          data-parity-target="modal-basic"
          visible={visible}
          title="发布变更"
          motion={false}
          okText="确认发布"
          cancelText="稍后处理"
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
        >
          <p className="modal-scenario__content">确认将 3 项变更发布到生产环境？</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
