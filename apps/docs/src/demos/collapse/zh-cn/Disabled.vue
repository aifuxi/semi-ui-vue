<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse accordion>
    <CollapsePanel header="This is panel header 1" item-key="1" disabled>
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
