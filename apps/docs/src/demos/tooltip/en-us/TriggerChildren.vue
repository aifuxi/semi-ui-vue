<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import ForwardedTrigger from './ForwardedTrigger.vue';
import InheritedTrigger from './InheritedTrigger.vue';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Space
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
    ></ConfigProvider
  >
</template>
