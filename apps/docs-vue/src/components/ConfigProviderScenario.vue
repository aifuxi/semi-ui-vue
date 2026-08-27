<script setup lang="ts">
import {
  ConfigConsumer,
  ConfigProvider,
  Text,
  type ConfigContextValue,
  type SemiLocale,
} from '@workspace/ui';
import ConfigProviderSummary from './ConfigProviderSummary.vue';

const englishLocale: SemiLocale = {
  code: 'en-US',
  currency: 'USD',
  Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
};
</script>

<template>
  <div class="config-provider-scenario" data-testid="config-provider-vue">
    <ConfigProvider
      direction="rtl"
      :locale="englishLocale"
      time-zone="Asia/Shanghai"
      responsive-observe
    >
      <ConfigConsumer v-slot="context">
        <ConfigProviderSummary :context="context as ConfigContextValue" />
      </ConfigConsumer>
      <Text copyable data-parity-target="config-provider-locale">Global configuration</Text>
      <ConfigProvider direction="ltr" :locale="englishLocale">
        <ConfigConsumer v-slot="context">
          <span
            class="config-provider-scenario__nested"
            data-parity-target="config-provider-nested"
          >
            {{ `nested: ${context.direction}` }}
          </span>
        </ConfigConsumer>
      </ConfigProvider>
    </ConfigProvider>
  </div>
</template>
