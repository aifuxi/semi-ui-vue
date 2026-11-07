<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { Tree, type TreeNodeData, type TreeProps, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const status = shallowRef('等待操作');
/** 专项 query 只替换首棵树，默认场景的四种用法不变。 */
const reviewTree = new URLSearchParams(window.location.search).get('reviewTree');
/** 八十个实际节点覆盖虚拟窗口首部、中部及底部。 */
const virtualData: TreeNodeData[] = Array.from(
  { length: 80 },
  /** 行序号用于确认滚动后确实切换了可见节点。 */
  (_, index) => ({
    key: `virtual-${index}`,
    value: index,
    label: `节点 ${String(index + 1).padStart(2, '0')}`,
  }),
);
/** 未完成的公开 loadData Promise 保持 loading，避免靠时间制造瞬态截图。 */
const reviewProps: TreeProps =
  reviewTree === 'drag'
    ? { draggable: true }
    : reviewTree === 'loading'
      ? {
          /** 本地专项状态只观察加载指示器，不代表远端接口联调。 */
          loadData: () =>
            new Promise<void>(
              /** 保持 pending，供两端在相同加载态审查。 */
              () => undefined,
            ),
        }
      : reviewTree === 'virtual'
        ? { virtualize: { itemSize: 28, height: 180, width: 360 } }
        : {};
const treeData: TreeNodeData[] = [
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
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': { code: 'zh-CN', Tree: { searchPlaceholder: '搜索', emptyText: '暂无数据' } },
  'en-US': { code: 'en-US', Tree: { searchPlaceholder: 'Search', emptyText: 'No Data' } },
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="tree-scenario" data-testid="tree-vue">
      <div class="tree-scenario__section">
        <span class="tree-scenario__label">基础 / 禁用</span>
        <Tree
          v-bind="reviewProps"
          data-parity-target="tree-basic"
          :default-expand-all="reviewTree !== 'loading'"
          default-value="Beijing"
          :tree-data="
            reviewTree === 'virtual'
              ? virtualData
              : reviewTree === 'loading'
                ? [{ key: 'async', value: 'async', label: '异步节点', isLeaf: false }]
                : treeData
          "
          @change="(value: TreeValue | undefined) => (status = `选择：${String(value)}`)"
        />
      </div>
      <div class="tree-scenario__section">
        <span class="tree-scenario__label">多选 / 关联</span>
        <Tree
          data-parity-target="tree-multiple"
          default-expand-all
          :default-value="['Beijing', 'Japan']"
          multiple
          :tree-data="treeData"
        />
      </div>
      <div class="tree-scenario__section">
        <span class="tree-scenario__label">搜索</span>
        <Tree
          data-parity-target="tree-search"
          default-expand-all
          filter-tree-node
          :tree-data="treeData"
        />
      </div>
      <div class="tree-scenario__section">
        <span class="tree-scenario__label">目录 / 连接线</span>
        <Tree
          data-parity-target="tree-directory"
          :default-expanded-keys="['asia', 'china']"
          directory
          show-line
          :tree-data="treeData"
        />
      </div>
      <output class="tree-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
