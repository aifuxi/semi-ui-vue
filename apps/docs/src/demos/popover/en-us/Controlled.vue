<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Popover :visible="visible" trigger="custom"
      ><Button @click="visible = !visible">Click me</Button
      ><template #content
        ><article style="padding: 12px">
          Hi ByteDancer, this is a popover.<br />
          We have 2 lines.
        </article></template
      ></Popover
    ></ConfigProvider
  >
</template>
