import React, { useState } from 'react';
import Tree, { type TreeProps } from '@semi-v2.102.0/tree';
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
  /** 与 Vue 同一 query，默认场景保留。 */
  const reviewTree = new URLSearchParams(window.location.search).get('reviewTree');
  /** 固定行高和八十节点用于真实虚拟滚动。 */
  const virtualData = Array.from(
    { length: 80 },
    /** 序号使首/中/尾窗口可以从页面内容核实。 */
    (_, index) => ({
      key: `virtual-${index}`,
      value: index,
      label: `节点 ${String(index + 1).padStart(2, '0')}`,
    }),
  );
  /** 只通过公开参数开启拖拽、pending loading 或虚拟列表。 */
  const reviewProps: TreeProps =
    reviewTree === 'drag'
      ? { draggable: true }
      : reviewTree === 'loading'
        ? {
            /** Pending Promise 保证实际加载态可重复观察，不用固定延时。 */
            loadData: () =>
              new Promise<void>(
                /** 专项视觉场景保持请求未完成。 */
                () => undefined,
              ),
          }
        : reviewTree === 'virtual'
          ? { virtualize: { itemSize: 28, height: 180, width: 360 } }
          : {};
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="tree-scenario" data-testid="tree-reference">
        <div className="tree-scenario__section">
          <span className="tree-scenario__label">基础 / 禁用</span>
          <Tree
            {...reviewProps}
            data-parity-target="tree-basic"
            defaultExpandAll={reviewTree !== 'loading'}
            defaultValue="Beijing"
            treeData={
              reviewTree === 'virtual'
                ? virtualData
                : reviewTree === 'loading'
                  ? [{ key: 'async', value: 'async', label: '异步节点', isLeaf: false }]
                  : treeData
            }
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
