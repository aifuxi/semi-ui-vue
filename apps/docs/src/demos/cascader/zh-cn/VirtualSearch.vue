<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/typography.css';
const treeData = ['通用', '场景'].map((label, m) => ({
  label: label,
  value: m,
  children: new Array(100).fill(0).map((_, n) => ({
    value: `${m}-${n}`,
    label: `${m}-${n} 第二级`,
    children: new Array(20).fill(0).map((_, o) => ({
      value: `${m}-${n}-${o}`,
      label: `${m}-${n}-${o} 第三级详细内容`,
    })),
  })),
}));
function labels(items: Array<{ label?: unknown }>, separator: string) {
  return items.map((item) => item.label).join(separator);
}
</script>
<template>
  <Cascader
    multiple
    filter-tree-node
    style="width: 320px"
    :tree-data="treeData"
    placeholder="输入 通用 or 场景 进行搜索"
    :virtualize-in-search="{ height: 172, width: 320, itemSize: 36 }"
    ><template #filter="{ data, onCheck, checkStatus, className, style }"
      ><div
        :class="className"
        :style="[
          style,
          {
            justifyContent: 'start',
            padding: '8px 16px 8px 12px',
            boxSizing: 'border-box',
          },
        ]"
        @click="onCheck"
      >
        <Checkbox
          :indeterminate="checkStatus.halfChecked"
          :checked="checkStatus.checked"
          style="margin-right: 8px"
        /><Text
          :ellipsis="{
            showTooltip: { opts: { style: { wordBreak: 'break-all' } } },
          }"
          style="max-width: 260px"
          >{{ labels(data, ' | ') }}</Text
        >
      </div></template
    ></Cascader
  >
</template>
