import React from 'react';
import type { SideSheetProps } from '@semi-v2.102.0/side-sheet';

export default function SemiSideSheetStub(props: SideSheetProps): React.ReactElement | null {
  if (!props.visible && !props.keepDOM) return null;
  return (
    <div
      className={`semi-sidesheet semi-sidesheet-${props.placement ?? 'right'}`}
      data-parity-target={props['data-parity-target']}
    >
      <div className="semi-sidesheet-mask" />
      <div role="dialog" className="semi-sidesheet-inner">
        <div role="heading" className="semi-sidesheet-header">
          <div className="semi-sidesheet-title">{props.title}</div>
        </div>
        <div className="semi-sidesheet-body">{props.children}</div>
        <div className="semi-sidesheet-footer">{props.footer}</div>
      </div>
    </div>
  );
}
