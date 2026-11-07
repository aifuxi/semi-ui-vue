<script setup lang="ts">
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { TreeSelect, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

/** 默认值与展开内容不变，仅在审查 query 中切换公开样式分支。 */
const reviewProps = readInputReviewProps(['size', 'disabled', 'validateStatus']);

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
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
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': { code: 'zh-CN', TreeSelect: { searchPlaceholder: '搜索' } },
  'en-US': { code: 'en-US', TreeSelect: { searchPlaceholder: 'Search' } },
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="tree-select-scenario" data-testid="tree-select-vue">
      <TreeSelect
        v-bind="reviewProps"
        data-parity-target="tree-select-root"
        default-open
        default-expand-all
        default-value="China"
        filter-tree-node
        :motion="false"
        :motion-expand="false"
        placeholder="请选择地区"
        show-clear
        :tree-data="treeData"
        :style="{ width: '300px' }"
      />
    </div>
  </ConfigProvider>
</template>
