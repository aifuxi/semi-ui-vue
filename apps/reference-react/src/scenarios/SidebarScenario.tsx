import React, { useState } from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Sidebar from '@semi-v2.102.0/sidebar';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    Sidebar: { copySuccess: '复制成功' },
  },
  'en-US': {
    code: 'en-US',
    Sidebar: { copySuccess: 'Copied' },
  },
};

const codes = [
  {
    key: 'main',
    name: 'main.ts',
    language: 'typescript',
    content: 'const ready = true;\nexport default ready;',
  },
];

export function SidebarScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  // 使用公开详情模式审查代码与文件页，默认主面板继续维持原场景。
  const requestedMode = new URLSearchParams(window.location.search).get('sidebarMode');
  const reviewMode = requestedMode === 'code' || requestedMode === 'file' ? requestedMode : 'main';
  /** 专项 query 开启真实 Sidebar 边缘 resize。 */
  const reviewResizable =
    new URLSearchParams(window.location.search).get('reviewResizable') === '1';
  /** 文件编辑工具栏由真实 fileEditable prop 驱动。 */
  const reviewEditable = new URLSearchParams(window.location.search).get('reviewEditable') === '1';
  const [activeKey, setActiveKey] = useState('code');
  const labels =
    locale === 'zh-CN'
      ? { title: '开发资源', code: '代码', files: '文件' }
      : { title: 'Developer resources', code: 'Code', files: 'Files' };

  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="sidebar-scenario" data-testid="sidebar-reference">
        <Sidebar
          visible
          mode={reviewMode}
          detailContent={
            reviewMode === 'file'
              ? { name: '说明.md', content: '# 开发资源\n\n主题与排版说明。', type: 'text' }
              : codes[0]!
          }
          fileEditable={reviewEditable}
          motion={false}
          resizable={reviewResizable}
          showClose={false}
          title={labels.title}
          activeKey={activeKey}
          options={[
            { key: 'code', icon: <span aria-hidden>⌘</span>, name: labels.code },
            { key: 'files', icon: <span aria-hidden>□</span>, name: labels.files },
          ]}
          onActiveOptionChange={(_event, key) => setActiveKey(key)}
          renderMainContent={() => <Sidebar.CodeContent activeKey="main" codes={codes} />}
        />
      </div>
    </ConfigProvider>
  );
}
