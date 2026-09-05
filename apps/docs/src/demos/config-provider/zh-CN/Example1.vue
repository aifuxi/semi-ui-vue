<script setup lang="ts">
import {
  ConfigConsumer,
  ConfigProvider,
  type SemiLocale,
} from '@aifuxi/semi-ui-vue/config-provider';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/typography.css';

const locale: SemiLocale = {
  code: 'en-US',
  Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
};
</script>

<template>
  <ConfigProvider direction="rtl" time-zone="Asia/Shanghai" :locale="locale">
    <Text copyable>Global configuration</Text>
    <ConfigConsumer v-slot="context">
      <pre>{{ context.direction }} / {{ context.timeZone }}</pre>
    </ConfigConsumer>
  </ConfigProvider>
</template>
