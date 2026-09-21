<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Text as TypographyText } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { IconMore } from '@aifuxi/semi-icons-vue';
const treeData: TreeNodeData[] = [
  {
    label: '亚洲亚洲亚洲亚洲亚洲亚洲亚洲亚洲',
    key: 'yazhou',
    value: 'yazhou',
    children: [
      { label: '中国中国中国中国中国中国中国中国', key: 'zhongguo', value: 'zhongguo' },
      { label: '日本日本日本日本日本日本日本日本', key: 'riben', value: 'riben' },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const message = shallowRef('');
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle"
    ><template #label="{ label, node }"
      ><div style="display: flex">
        <TypographyText :ellipsis="{ showTooltip: true }" style="width: calc(100% - 48px)">{{
          label
        }}</TypographyText
        ><Button size="small" aria-label="更多操作" @click.stop="message = String(node.key)"
          ><template #icon><IconMore /></template
        ></Button></div></template
  ></Tree>
  <p role="status">{{ message }}</p>
</template>
