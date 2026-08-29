import React from 'react';
import type { ModalProps } from '@semi-v2.102.0/modal';

export default function SemiModalStub(props: ModalProps): React.ReactElement | null {
  if (!props.visible && !props.keepDOM) return null;
  return (
    <div
      data-parity-target={props['data-parity-target']}
      className={props.direction === 'rtl' ? 'semi-modal-rtl' : undefined}
    >
      {props.mask === false ? null : <div className="semi-modal-mask" />}
      <div className="semi-modal-wrap">
        <div className={`semi-modal semi-modal-${props.size ?? 'small'}`}>
          <div className="semi-modal-content" role="dialog" aria-modal="true">
            {props.title == null ? null : (
              <div className="semi-modal-header">
                <h5 className="semi-modal-title">{props.title}</h5>
              </div>
            )}
            <div className="semi-modal-body">{props.children}</div>
            {props.footer === null ? null : <div className="semi-modal-footer" />}
          </div>
        </div>
      </div>
    </div>
  );
}
