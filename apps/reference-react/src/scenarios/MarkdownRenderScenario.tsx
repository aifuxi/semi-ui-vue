import React from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import MarkdownRender from '@semi-v2.102.0/markdown-render';
import type { ParityDirection } from '@workspace/test-infra';

const RAW = `## MarkdownRender 对齐

这是一个 **完整切片**，包含 [Semi Design](https://semi.design) 与 \`inline code\`。

- 固定 v2.102.0 源码
- Vue 原生组件映射

| 能力 | 状态 |
| - | -: |
| Markdown | Ready |
| GFM Table | Ready |
`;

export function MarkdownRenderScenario({
  direction,
}: {
  direction: ParityDirection;
}): React.ReactElement {
  return (
    <ConfigProvider direction={direction}>
      <div className="markdown-render-scenario" data-testid="markdown-render-reference">
        <MarkdownRender raw={RAW} data-parity-target="markdown-render-root" />
      </div>
    </ConfigProvider>
  );
}
