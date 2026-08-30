import React from 'react';
import Cascader from '@semi-v2.102.0/cascader';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const treeData = [
  {
    label: '亚洲',
    value: 'Asia',
    children: [
      {
        label: '中国',
        value: 'China',
        children: [
          { label: '北京', value: 'Beijing' },
          { label: '上海', value: 'Shanghai' },
        ],
      },
      { label: '日本', value: 'Japan' },
    ],
  },
  {
    label: '北美洲',
    value: 'America',
    children: [{ label: '加拿大', value: 'Canada', disabled: true }],
  },
];
const localeMap = {
  'zh-CN': { code: 'zh-CN', Cascader: { emptyText: '暂无数据' } },
  'en-US': { code: 'en-US', Cascader: { emptyText: 'No Data' } },
};

export function CascaderScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="cascader-scenario" data-testid="cascader-reference">
        <Cascader
          aria-label="Cascader"
          data-parity-target="cascader-root"
          defaultOpen
          defaultValue={['Asia', 'China', 'Beijing']}
          filterTreeNode
          motion={false}
          placeholder="请选择地区"
          treeData={treeData}
          style={{ width: 300 }}
        />
      </div>
    </ConfigProvider>
  );
}
