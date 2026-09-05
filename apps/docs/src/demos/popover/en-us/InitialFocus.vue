<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Popover trigger="click"
      ><template #content="{ initialFocusRef }"
        ><div style="padding: 12px">
          <Space
            ><Button>first focusable element</Button
            ><Input :ref="initialFocusRef" placeholder="focus here"
          /></Space></div></template
      ><Button>click me</Button></Popover
    ></ConfigProvider
  >
</template>
