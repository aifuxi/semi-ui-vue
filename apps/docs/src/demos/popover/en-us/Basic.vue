<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Popover>
      <Tag>Hover here</Tag>
      <template #content
        ><article :style="{ padding: '12px' }">
          Hi ByteDancer, this is a popover.
          <br />
          We have 2 lines.
        </article></template
      ></Popover
    ></ConfigProvider
  >
</template>
