<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
import {
  Transfer,
  type TransferDataItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';

const currentPage = shallowRef(1);
const data: TransferDataItem[] = Array.from({ length: 100 }, (_, i) => ({
  label: `Item ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));

function handlePageChange(page: number): void {
  currentPage.value = page;
}

function handleChange(values: TransferPrimitive[], items: TransferDataItem[]): void {
  console.log(values, items);
}
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div>
      <ButtonGroup style="margin-bottom: 12px">
        <Button @click="currentPage = 1">Page 1</Button>
        <Button @click="currentPage = 2">Page 2</Button>
        <Button @click="currentPage = 5">Page 5</Button>
        <Button @click="currentPage = 10">Page 10</Button>
      </ButtonGroup>
      <div>Current page: {{ currentPage }}</div>
      <Transfer
        style="width: 568px; height: 416px"
        :data-source="data"
        :pagination="{ pageSize: 10, currentPage, onPageChange: handlePageChange }"
        @change="handleChange"
      />
    </div>
  </ConfigProvider>
</template>
