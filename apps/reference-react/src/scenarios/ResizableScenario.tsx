import React, { useState } from 'react';
import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from '@semi-v2.102.0/resizable';

const panelStyle: React.CSSProperties = {
  border: '1px solid var(--harness-border)',
  backgroundColor: 'var(--harness-panel)',
};

export function ResizableScenario(): React.ReactElement {
  const [singleStatus, setSingleStatus] = useState('Drag edge to resize');
  const [groupStatus, setGroupStatus] = useState('Drag divider to resize');

  return (
    <div className="resizable-scenario" data-testid="resizable-reference">
      <section className="resizable-scenario__section" aria-label="单体伸缩框">
        <h3>单体伸缩框</h3>
        <div className="resizable-scenario__single-host">
          <Resizable
            className="resizable-scenario__single"
            data-parity-target="resizable-single"
            defaultSize={{ width: '60%', height: 132 }}
            minWidth={120}
            maxWidth="90%"
            onChange={() => setSingleStatus('Resizing')}
            onResizeEnd={() => setSingleStatus('Drag edge to resize')}
            style={panelStyle}
          >
            <span>{singleStatus}</span>
          </Resizable>
        </div>
      </section>

      <section className="resizable-scenario__section" aria-label="水平组合伸缩框">
        <h3>水平组合</h3>
        <div className="resizable-scenario__group-host">
          <ResizeGroup
            className="resizable-scenario__group"
            data-parity-target="resize-group-horizontal"
            direction="horizontal"
          >
            <ResizeItem
              className="resizable-target-item-horizontal-first"
              defaultSize="35%"
              min="20%"
              onChange={() => setGroupStatus('Resizing')}
              onResizeEnd={() => setGroupStatus('Drag divider to resize')}
              style={panelStyle}
            >
              <span>{groupStatus}</span>
            </ResizeItem>
            <ResizeHandler className="resizable-target-handler-horizontal" />
            <ResizeItem defaultSize="65%" min="30%" style={panelStyle}>
              <span>Detail panel</span>
            </ResizeItem>
          </ResizeGroup>
        </div>
      </section>

      <section className="resizable-scenario__section" aria-label="垂直组合伸缩框">
        <h3>垂直组合</h3>
        <div className="resizable-scenario__vertical-host">
          <ResizeGroup
            className="resizable-scenario__group"
            data-parity-target="resize-group-vertical"
            direction="vertical"
          >
            <ResizeItem defaultSize="40%" style={panelStyle}>
              <span>Top panel</span>
            </ResizeItem>
            <ResizeHandler className="resizable-target-handler-vertical" />
            <ResizeItem defaultSize="60%" style={panelStyle}>
              <span>Bottom panel</span>
            </ResizeItem>
          </ResizeGroup>
        </div>
      </section>
    </div>
  );
}
