import React, { useState } from 'react';
import Breadcrumb, { type BreadcrumbItemInfo, type RouteProps } from '@semi-v2.102.0/breadcrumb';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import { IconChevronRight, IconHome } from '@semi-v2.102.0/icons';
import type { ParityDirection } from '@workspace/test-infra';

function itemName(item: BreadcrumbItemInfo | RouteProps): string {
  return typeof item.name === 'string' ? item.name : String(item.path ?? '自定义项');
}

export function BreadcrumbScenario({
  direction,
}: {
  direction: ParityDirection;
}): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  return (
    <ConfigProvider direction={direction}>
      <div className="breadcrumb-scenario" data-testid="breadcrumb-reference">
        <div className="breadcrumb-scenario__canvas">
          <div className="breadcrumb-scenario__section">
            <span className="breadcrumb-scenario__label">基础与图标</span>
            <Breadcrumb
              aria-label="文档路径"
              data-parity-target="breadcrumb-basic"
              onClick={(item) => setStatus(`父级：${itemName(item)}`)}
            >
              <Breadcrumb.Item
                icon={<IconHome />}
                onClick={(item) => setStatus(`子项：${itemName(item)}`)}
              >
                首页
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#components">组件</Breadcrumb.Item>
              <Breadcrumb.Item>面包屑</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="breadcrumb-scenario__section">
            <span className="breadcrumb-scenario__label">折叠与 Popover</span>
            <Breadcrumb
              data-parity-target="breadcrumb-collapsed"
              moreType="popover"
              onClick={(item) => setStatus(`折叠项：${itemName(item)}`)}
            >
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>设计系统</Breadcrumb.Item>
              <Breadcrumb.Item>导航组件</Breadcrumb.Item>
              <Breadcrumb.Item>层级结构</Breadcrumb.Item>
              <Breadcrumb.Item>面包屑</Breadcrumb.Item>
              <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="breadcrumb-scenario__section">
            <span className="breadcrumb-scenario__label">宽松尺寸与受控激活</span>
            <Breadcrumb
              activeIndex={1}
              compact={false}
              data-parity-target="breadcrumb-loose"
              separator={<IconChevronRight size="small" />}
            >
              <Breadcrumb.Item>工作台</Breadcrumb.Item>
              <Breadcrumb.Item href="#current">当前页面</Breadcrumb.Item>
              <Breadcrumb.Item noLink>详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <output className="breadcrumb-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
