import React, { useState } from 'react';
import Modal from '@semi-v2.102.0/modal';
import Button from '@semi-v2.102.0/button';
import ConfigProvider from '@semi-v2.102.0/config-provider';

export interface ModalScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function ModalScenario({ direction }: ModalScenarioProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  return (
    <ConfigProvider direction={direction}>
      <div className="modal-scenario" data-testid="modal-reference">
        <Button data-action="open-modal" onClick={() => setVisible(true)}>
          打开发布确认
        </Button>
        <Modal
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
