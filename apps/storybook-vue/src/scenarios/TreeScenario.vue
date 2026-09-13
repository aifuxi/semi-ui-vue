<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const status = shallowRef('等待操作');
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
          data-parity-target="tree-basic"
          default-expand-all
          default-value="Beijing"
          :tree-data="treeData"
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
