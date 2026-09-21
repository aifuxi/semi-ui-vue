<script setup lang="ts">
import {
  Transfer,
  type TransferDataItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';

const data: TransferDataItem[] = Array.from({ length: 30 }, (_, i) => ({
  label: `选项名称 ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));

function handleChange(values: TransferPrimitive[], items: TransferDataItem[]): void {
  console.log(values, items);
}
</script>

<template>
  <Transfer
    style="width: 568px; height: 416px"
    :data-source="data"
    draggable
    :default-value="[2, 4]"
    @change="handleChange"
  />
</template>
