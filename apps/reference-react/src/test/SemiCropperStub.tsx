import React from 'react';

export interface SemiCropperStubProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: number;
  cropperBoxCls?: string;
  shape?: 'rect' | 'round' | 'roundRect';
  src?: string;
}

export default function SemiCropperStub({
  aspectRatio,
  cropperBoxCls,
  shape = 'rect',
  src,
  ...props
}: SemiCropperStubProps): React.ReactElement {
  void aspectRatio;

  return (
    <div {...props} className={`semi-cropper ${props.className ?? ''}`}>
      <div className="semi-cropper-img-wrapper">
        <img className="semi-cropper-img" src={src} />
      </div>
      <div className="semi-cropper-mask" />
      <div className={`semi-cropper-box ${cropperBoxCls ?? ''}`}>
        <div
          className={`semi-cropper-view-box${shape.includes('round') ? ' semi-cropper-view-box-round' : ''}`}
        >
          <img className="semi-cropper-view-img" src={src} />
        </div>
      </div>
    </div>
  );
}
