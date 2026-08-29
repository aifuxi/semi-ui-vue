import React, { useRef, useState } from 'react';
import Button from '@semi-v2.102.0/button';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Popconfirm from '@semi-v2.102.0/popconfirm';

import type { ParityDirection } from '@workspace/test-infra';

export function PopconfirmScenario({
  direction,
}: {
  direction: ParityDirection;
}): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [defaultVisible, setDefaultVisible] = useState(true);
  const getPopupContainer = () => host.current ?? document.body;

  return (
    <ConfigProvider direction={direction}>
      <div ref={host} className="popconfirm-scenario" data-testid="popconfirm-reference">
        <div className="popconfirm-scenario__triggers">
          <Popconfirm
            className="popconfirm-scenario__default"
            content="This change cannot be undone."
            getPopupContainer={getPopupContainer}
            motion={false}
            position={direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
            title="Save this change?"
            trigger="custom"
            visible={defaultVisible}
            onVisibleChange={setDefaultVisible}
          >
            <Button data-parity-target="popconfirm-trigger-default">Default</Button>
          </Popconfirm>
          <Popconfirm
            cancelText="Back"
            className="popconfirm-scenario__danger"
            content="The selected record will be removed."
            getPopupContainer={getPopupContainer}
            motion={false}
            okText="Delete"
            okType="danger"
            position={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            showArrow
            showCloseIcon={false}
            title="Delete record?"
            trigger="custom"
            visible
          >
            <Button data-parity-target="popconfirm-trigger-danger" type="danger">
              Danger
            </Button>
          </Popconfirm>
        </div>
      </div>
    </ConfigProvider>
  );
}
