<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import IconCopy from '@aifuxi/semi-icons-vue/icons/IconCopy';
import '@aifuxi/semi-theme-default/collapse.css';
import '@aifuxi/semi-theme-default/tag.css';
</script>

<template>
  <Collapse>
    <CollapsePanel header="This is panel header 1" item-key="1" extra="1234">
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
    <CollapsePanel header="This is panel header 2" item-key="2"
      ><template #extra><IconCopy /></template>
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
    <CollapsePanel header="This is panel header 3" item-key="3"
      ><template #extra
        ><Tag color="violet" :style="{ margin: 0 }">{{ ' Recommended ' }}</Tag></template
      >
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
  </Collapse>
</template>
