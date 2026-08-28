import React, { useState } from 'react';
import Tree from '@semi-v2.102.0/tree';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const treeData = [
  {
    label: '亚洲',
    value: 'Asia',
    key: 'asia',
    children: [
      {
        label: '中国',
        value: 'China',
        key: 'china',
        children: [
          { label: '北京', value: 'Beijing', key: 'beijing' },
          { label: '上海', value: 'Shanghai', key: 'shanghai', disabled: true },
        ],
      },
      { label: '日本', value: 'Japan', key: 'japan' },
    ],
  },
  { label: '北美洲', value: 'America', key: 'america' },
];

const localeMap = {
  'zh-CN': { code: 'zh-CN', Tree: { searchPlaceholder: '搜索', emptyText: '暂无数据' } },
  'en-US': { code: 'en-US', Tree: { searchPlaceholder: 'Search', emptyText: 'No Data' } },
};

export function TreeScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="tree-scenario" data-testid="tree-reference">
        <div className="tree-scenario__section">
          <span className="tree-scenario__label">基础 / 禁用</span>
          <Tree
            data-parity-target="tree-basic"
            defaultExpandAll
            defaultValue="Beijing"
            treeData={treeData}
            onChange={(value) => setStatus(`选择：${String(value)}`)}
          />
        </div>
        <div className="tree-scenario__section">
          <span className="tree-scenario__label">多选 / 关联</span>
          <Tree
            data-parity-target="tree-multiple"
            defaultExpandAll
            defaultValue={['Beijing', 'Japan']}
            multiple
            treeData={treeData}
          />
        </div>
        <div className="tree-scenario__section">
          <span className="tree-scenario__label">搜索</span>
          <Tree
            data-parity-target="tree-search"
            defaultExpandAll
            filterTreeNode
            treeData={treeData}
          />
        </div>
        <div className="tree-scenario__section">
          <span className="tree-scenario__label">目录 / 连接线</span>
          <Tree
            data-parity-target="tree-directory"
            defaultExpandedKeys={['asia', 'china']}
            directory
            showLine
            treeData={treeData}
          />
        </div>
        <output className="tree-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
