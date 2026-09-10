<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Popconfirm content="Are you sure to delete this comment" title="Confirm Delete">
      <span :style="{ display: 'inline-block' }">
        <Tooltip :content="'Delete Comment'">
          <Button type="danger"> Delete</Button>
        </Tooltip>
      </span>
    </Popconfirm></ConfigProvider
  >
</template>
