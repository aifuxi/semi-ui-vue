<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import ForwardedTrigger from './ForwardedTrigger.vue';
import InheritedTrigger from './InheritedTrigger.vue';
</script>
<template>
  <Space
    ><Tooltip content="semi design"><ForwardedTrigger label="Functional Component" /></Tooltip
    ><Tooltip content="semi design"><InheritedTrigger label="ClassComponent" /></Tooltip
    ><Tooltip content="semi design"
      ><span
        style="
          border: 2px solid var(--semi-color-border);
          padding-left: 4px;
          padding-right: 4px;
          border-radius: 4px;
        "
        >DOM</span
      ></Tooltip
    ></Space
  >
</template>
