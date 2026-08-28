import React from 'react';
import Cropper from '@semi-v2.102.0/cropper';

const CROP_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"%3E%3Crect width="640" height="360" fill="%2323293d"/%3E%3Ccircle cx="170" cy="130" r="90" fill="%23009f76"/%3E%3Cpath d="M0 310L170 155l120 100 95-80 255 185H0z" fill="%234f7cff"/%3E%3Crect x="420" y="52" width="150" height="72" rx="24" fill="%23ffb400"/%3E%3C/svg%3E';

export function CropperScenario(): React.ReactElement {
  return (
    <div className="cropper-scenario" data-testid="cropper-reference">
      <section className="cropper-scenario__cell">
        <span className="cropper-scenario__label">默认矩形 · 8 个调整块</span>
        <div data-parity-target="cropper-basic">
          <Cropper src={CROP_IMAGE} style={{ height: 220, width: 360 }} />
        </div>
      </section>
      <section className="cropper-scenario__cell">
        <span className="cropper-scenario__label">圆形 · 固定 1:1 · 4 个调整块</span>
        <div data-parity-target="cropper-round">
          <Cropper
            aspectRatio={1}
            cropperBoxCls="cropper-scenario__round-box"
            shape="round"
            src={CROP_IMAGE}
            style={{ height: 220, width: 360 }}
          />
        </div>
      </section>
    </div>
  );
}
