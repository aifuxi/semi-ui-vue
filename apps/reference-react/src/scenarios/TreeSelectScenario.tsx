import React from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import TreeSelect from '@semi-v2.102.0/tree-select';
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
          { label: '上海', value: 'Shanghai', key: 'shanghai' },
        ],
      },
      { label: '日本', value: 'Japan', key: 'japan' },
    ],
  },
  {
    label: '北美洲',
    value: 'America',
    key: 'america',
    children: [{ label: '加拿大', value: 'Canada', key: 'canada', disabled: true }],
  },
];
const localeMap = {
  'zh-CN': { code: 'zh-CN', TreeSelect: { searchPlaceholder: '搜索' } },
  'en-US': { code: 'en-US', TreeSelect: { searchPlaceholder: 'Search' } },
};

export function TreeSelectScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="tree-select-scenario" data-testid="tree-select-reference">
        <TreeSelect
          data-parity-target="tree-select-root"
          defaultOpen
          defaultExpandAll
          defaultValue="China"
          filterTreeNode
          motion={false}
          motionExpand={false}
          placeholder="请选择地区"
          showClear
          treeData={treeData}
          style={{ width: 300 }}
        />
      </div>
    </ConfigProvider>
  );
}
