<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import IconPlus from '@aifuxi/semi-icons-vue/icons/IconPlus';
import IconMinus from '@aifuxi/semi-icons-vue/icons/IconMinus';
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse
    ><template #expandIcon><IconPlus /></template><template #collapseIcon><IconMinus /></template>
    <CollapsePanel header="This is panel header 1" item-key="1">
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
    <CollapsePanel header="This is panel header 2" item-key="2">
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
    <CollapsePanel header="This is panel header 3" item-key="3">
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
  </Collapse>
</template>
