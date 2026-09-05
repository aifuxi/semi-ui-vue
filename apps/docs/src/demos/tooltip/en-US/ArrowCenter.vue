<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>
<template>
  <ConfigProvider :locale="enUS">
    <div>
      <Tooltip position="topLeft" content="semi design tooltip">
        <Button type="secondary" :style="{ marginRight: '8px' }"> Arrow Point at Center</Button>
      </Tooltip>
    </div>

    <div :style="{ marginTop: '20px' }">
      <Tooltip content="semi design tooltip" :arrow-point-at-center="false" position="topLeft">
        <Button type="secondary" :style="{ marginRight: '8px', width: '120px' }">
          Edge align</Button
        >
      </Tooltip>
    </div>
  </ConfigProvider>
</template>
