<script setup lang="ts">
import { Cascader, type CascaderData } from '@aifuxi/semi-ui-vue/cascader';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

/** 与固定 React 同一输入，不用 class 或内联样式模拟尺寸和校验。 */
const reviewProps = readInputReviewProps(['size', 'disabled', 'validateStatus']);

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const treeData: CascaderData[] = [
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
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': { code: 'zh-CN', Cascader: { emptyText: '暂无数据' } },
  'en-US': { code: 'en-US', Cascader: { emptyText: 'No Data' } },
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="cascader-scenario" data-testid="cascader-vue">
      <Cascader
        v-bind="reviewProps"
        aria-label="Cascader"
        data-parity-target="cascader-root"
        default-open
        :default-value="['Asia', 'China', 'Beijing']"
        filter-tree-node
        :motion="false"
        placeholder="请选择地区"
        :tree-data="treeData"
        :style="{ width: '300px' }"
      />
    </div>
  </ConfigProvider>
</template>
