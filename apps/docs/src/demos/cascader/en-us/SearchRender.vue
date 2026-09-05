<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/typography.css';
const treeData = [
  {
    label: 'Semi',
    value: 'Semi',
    children: [
      { label: 'Semi-Material Semi-Material Semi-Material Semi-Material', value: 'Semi-Material' },
      { label: 'Semi-DSM Semi-DSM Semi-DSM Semi-DSM', value: 'Semi-DSM' },
      { label: 'Semi Design Semi Design Semi Design Semi Design', value: 'Semi Design' },
      { label: 'Semi-C2D Semi-C2D Semi-C2D Semi-C2D Semi-C2D', value: 'Semi-C2D' },
      { label: 'Semi-D2C Semi-D2C Semi-D2C Semi-D2C Semi-D2C ', value: 'Semi-D2C' },
    ],
  },
];
function labels(items: Array<{ label?: unknown }>, separator: string) {
  return items.map((item) => item.label).join(separator);
}
</script>
<template>
  <div>
    <p>Mouse over the option to view the complete content of the omitted text</p>
    <br /><Cascader
      style="width: 300px"
      :tree-data="treeData"
      placeholder="Single selection, enter s"
      filter-tree-node
      ><template #filter="{ className, data, selected, onClick }"
        ><li
          :class="className"
          style="justify-content: flex-start"
          role="treeitem"
          :aria-selected="selected"
          @click="onClick"
          @keydown.enter="onClick"
        >
          <Text
            :ellipsis="{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }"
            :style="{ width: '270px', color: selected ? 'var(--semi-color-primary)' : undefined }"
            >{{ labels(data, ' / ') }}</Text
          >
        </li></template
      ></Cascader
    ><br /><Cascader
      multiple
      style="width: 300px; margin-top: 20px"
      :tree-data="treeData"
      placeholder="Multiple selection, enter s"
      filter-tree-node
      ><template #filter="{ className, data, checkStatus, onCheck }"
        ><li
          :class="className"
          style="justify-content: flex-start"
          role="treeitem"
          :aria-checked="checkStatus.halfChecked ? 'mixed' : checkStatus.checked"
          @click="onCheck"
          @keydown.enter="onCheck"
        >
          <Checkbox
            :indeterminate="checkStatus.halfChecked"
            :checked="checkStatus.checked"
            style="margin-right: 8px"
          /><Text
            :ellipsis="{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }"
            style="width: 250px"
            >{{ labels(data, ' / ') }}</Text
          >
        </li></template
      ></Cascader
    >
  </div>
</template>
