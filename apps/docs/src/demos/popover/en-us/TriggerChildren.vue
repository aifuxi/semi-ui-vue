<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
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
      ><Popover
        ><ForwardedTrigger label="Functional Component" /><template #content
          ><article style="padding: 12px">
            Hi ByteDancer, this is a popover.<br />
            We have 2 lines.
          </article></template
        ></Popover
      ><Popover
        ><InheritedTrigger label="ClassComponent" /><template #content
          ><article style="padding: 12px">
            Hi ByteDancer, this is a popover.<br />
            We have 2 lines.
          </article></template
        ></Popover
      ><Popover
        ><span
          style="
            border: 2px solid var(--semi-color-border);
            padding-left: 4px;
            padding-right: 4px;
            border-radius: 4px;
          "
          >DOM</span
        ><template #content
          ><article style="padding: 12px">
            Hi ByteDancer, this is a popover.<br />
            We have 2 lines.
          </article></template
        ></Popover
      ></Space
    ></ConfigProvider
  >
</template>
