import React, { useEffect, useRef, useState } from 'react';
import Dropdown from '@semi-v2.102.0/dropdown';

export function DropdownScenario(): React.ReactElement {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('等待操作');
  const portalHost = useRef<HTMLDivElement>(null);

  useEffect(() => setReady(true), []);
  const getPopupContainer = (): HTMLElement => portalHost.current!;

  return (
    <div className="dropdown-scenario" data-testid="dropdown-reference">
      <div ref={portalHost} className="dropdown-scenario__stage">
        {ready ? (
          <>
            <Dropdown
              className="dropdown-scenario__static-wrapper"
              contentClassName="dropdown-parity-menu"
              getPopupContainer={getPopupContainer}
              motion={false}
              position="bottomLeft"
              render={
                <Dropdown.Menu>
                  <Dropdown.Title>常用操作</Dropdown.Title>
                  <Dropdown.Item active type="primary" onClick={() => setStatus('已选择：编辑')}>
                    编辑
                  </Dropdown.Item>
                  <Dropdown.Item>复制链接</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item disabled type="danger">
                    删除
                  </Dropdown.Item>
                </Dropdown.Menu>
              }
              showTick
              trigger="custom"
              visible
            >
              <button className="dropdown-scenario__trigger" data-parity-target="dropdown-trigger">
                文件操作
              </button>
            </Dropdown>

            <Dropdown
              className="dropdown-scenario__interactive-wrapper"
              contentClassName="dropdown-interactive-menu"
              getPopupContainer={getPopupContainer}
              motion={false}
              position="bottomRight"
              render={
                <Dropdown.Menu>
                  <Dropdown.Item disabled>不可用</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatus('已选择：Alpha')}>Alpha</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatus('已选择：Beta')}>Beta</Dropdown.Item>
                </Dropdown.Menu>
              }
              trigger="click"
            >
              <button className="dropdown-scenario__trigger" data-action="open-dropdown">
                键盘菜单
              </button>
            </Dropdown>
          </>
        ) : null}
      </div>
      <output aria-live="polite">{status}</output>
    </div>
  );
}
