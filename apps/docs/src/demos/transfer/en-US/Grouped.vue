<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import {
  Transfer,
  type TransferDataItem,
  type TransferGroupItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';

const data: TransferGroupItem[] = [
  {
    title: 'GroupA',
    children: [
      { label: 'A-1', value: 1, disabled: false, key: 1 },
      { label: 'A-2', value: 2, disabled: false, key: 2 },
      { label: 'A-3', value: 3, disabled: false, key: 3 },
    ],
  },
  {
    title: 'GroupB',
    children: [
      { label: 'B-1', value: 4, disabled: false, key: 4 },
      { label: 'B-2', value: 5, disabled: false, key: 5 },
      { label: 'B-3（disabled）', value: 6, disabled: true, key: 6 },
    ],
  },
  {
    title: 'GroupC',
    children: [
      { label: 'C-1', value: 7, disabled: false, key: 7 },
      { label: 'C-2', value: 8, disabled: false, key: 8 },
      { label: 'C-3', value: 9, disabled: false, key: 9 },
      { label: 'C-4', value: 10, disabled: false, key: 10 },
      { label: 'C-5', value: 11, disabled: false, key: 11 },
      { label: 'C-6', value: 12, disabled: false, key: 12 },
      { label: 'C-7', value: 13, disabled: false, key: 13 },
    ],
  },
];

function handleChange(values: TransferPrimitive[], items: TransferDataItem[]): void {
  console.log(values, items);
}
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Transfer
      type="groupList"
      style="width: 568px"
      :data-source="data"
      :default-value="[6]"
      @change="handleChange"
    />
  </ConfigProvider>
</template>
