import React from 'react';
import { REFERENCE_BASELINE } from '@workspace/test-infra';

export function App(): React.ReactElement {
  return (
    <main className="workspace-shell">
      <p className="workspace-shell__eyebrow">React reference target</p>
      <h1>Semi Design React 参考工作台</h1>
      <p>
        当前固定参考版本为 <code>{REFERENCE_BASELINE.tag}</code>
        。这里将直接加载本地固定源码的参考场景。
      </p>
      <div className="visual-calibration" data-testid="visual-calibration" aria-hidden="true">
        <span className="visual-calibration__primary" />
        <span className="visual-calibration__success" />
        <span className="visual-calibration__warning" />
      </div>
    </main>
  );
}
