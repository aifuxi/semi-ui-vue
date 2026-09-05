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
      { label: 'Semi Design Semi Design Semi Design Semi Design', value: 'Semi' },
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
    <p>鼠标 hover 到选项可查看被省略文本完整内容</p>
    <br /><Cascader
      style="width: 320px"
      :tree-data="treeData"
      placeholder="单选，输入 s 自定义搜索选项渲染结果"
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
      style="width: 320px; margin-top: 20px"
      :tree-data="treeData"
      placeholder="多选，输入 s 自定义搜索选项渲染结果"
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
