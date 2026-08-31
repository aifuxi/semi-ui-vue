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
          motion={false}
          resizable={false}
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
