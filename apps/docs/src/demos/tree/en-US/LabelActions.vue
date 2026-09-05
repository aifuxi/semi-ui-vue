<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    key: 'yazhou',
    value: 'yazhou',
    children: [
      { label: 'China', key: 'zhongguo', value: 'zhongguo' },
      { label: 'Japan', key: 'riben', value: 'riben' },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const message = shallowRef('');
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle"
    ><template #label="{ label }"
      ><div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ label }}</span
        ><ButtonGroup size="small" theme="borderless"
          ><Button @click.stop="message = 'Hi, Bytedance dance dance'">Notice</Button
          ><Button>Click</Button></ButtonGroup
        >
      </div></template
    ></Tree
  >
  <p role="status">{{ message }}</p>
</template>
