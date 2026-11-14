import React, { useEffect, useState } from 'react';
import Modal from '@semi-v2.102.0/modal';
import Button from '@semi-v2.102.0/button';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import { modalReview } from '../../../../packages/test-infra/src/root-theme-review';

export interface ModalScenarioProps {
  direction: 'ltr' | 'rtl';
}

/** 固定上游对照：Provider 挂载与 Modal 显式局部定位分别验证。 */
export function ModalScenario({ direction }: ModalScenarioProps): React.ReactElement {
  /** 与 Vue 使用相同公开参数，不改变固定组件实现或样式。 */
  const review = modalReview(window.location.search);
  /** 回归 query 与 Vue 相同；默认不创建额外宿主。 */
  const containerMode = new URLSearchParams(window.location.search).get('modalContainer');
  /** 只在初次渲染创建 body 末尾宿主，不因 visible 更新更换容器身份。 */
  const [popupHost] = useState(() => {
    if (!containerMode) return undefined;
    /** 尺寸与偏移完全复用 Vue 场景条件。 */
    const host = document.createElement('div');
    host.dataset.testid = 'modal-popup-host';
    host.style.cssText =
      containerMode === 'provider'
        ? 'position:relative;margin-top:100vh'
        : 'position:relative;width:640px;height:480px;margin:120px 40px';
    document.body.appendChild(host);
    return host;
  });
  /** 场景销毁时回收宿主；不改变固定组件实现。 */
  useEffect(() => {
    /** 只移除本场景分配的节点。 */
    return () => popupHost?.remove();
  }, [popupHost]);
  /** getter 只控制公开容器参数。 */
  const getPopupContainer = popupHost ? () => popupHost : undefined;
  /** 初始展示弹窗，并允许公开按钮重开。 */
  const [visible, setVisible] = useState(true);

  return (
    <ConfigProvider
      direction={direction}
      {...(containerMode === 'provider' && getPopupContainer ? { getPopupContainer } : {})}
    >
      <div className="modal-scenario" data-testid="modal-reference">
        <Button
          data-action="open-modal" /* 公开入口重开，供回归确认关闭后的再次操作。 */
          onClick={() => setVisible(true)}
        >
          打开发布确认
        </Button>
        <Modal
          {...review}
          {...(containerMode === 'explicit' && getPopupContainer ? { getPopupContainer } : {})}
          data-parity-target="modal-basic"
          visible={visible}
          title="发布变更"
          motion={false}
          okText="确认发布"
          cancelText="稍后处理"
          /* 取消和确认都由场景更新受控 visible。 */
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
        >
          <p className="modal-scenario__content">确认将 3 项变更发布到生产环境？</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
