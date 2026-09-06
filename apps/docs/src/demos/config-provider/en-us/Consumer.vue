<script setup lang="ts">
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/typography.css';
</script>
<template>
  <ConfigProvider time-zone="GMT+08:00">
    <ConfigConsumer v-slot="context">
      <Text
        :ellipsis="{ showTooltip: { opts: { style: { minWidth: '1200px' } } } }"
        :style="{ width: '600px' }"
        >{{
          JSON.stringify({
            timeZone: context.timeZone,
            locale: context.locale,
            responsiveObserve: context.responsiveObserve,
            direction: context.direction,
            responsiveMap: context.responsiveMap,
            screens: context.screens,
          })
        }}</Text
      >
    </ConfigConsumer>
  </ConfigProvider>
</template>
