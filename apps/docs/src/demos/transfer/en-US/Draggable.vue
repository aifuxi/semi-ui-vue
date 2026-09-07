<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import {
  Transfer,
  type TransferDataItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';

const data: TransferDataItem[] = Array.from({ length: 30 }, (_, i) => ({
  label: `Item ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));

function handleChange(values: TransferPrimitive[], items: TransferDataItem[]): void {
  console.log(values, items);
}
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Transfer
      style="width: 568px; height: 416px"
      :data-source="data"
      draggable
      :default-value="[2, 4]"
      @change="handleChange"
    />
  </ConfigProvider>
</template>
