<script setup lang="ts">
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
  label: `选项名称 ${i}`,
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
  <div>
    <ButtonGroup style="margin-bottom: 12px">
      <Button @click="currentPage = 1">第1页</Button>
      <Button @click="currentPage = 2">第2页</Button>
      <Button @click="currentPage = 5">第5页</Button>
      <Button @click="currentPage = 10">第10页</Button>
    </ButtonGroup>
    <div>当前页码: {{ currentPage }}</div>
    <Transfer
      style="width: 568px; height: 416px"
      :data-source="data"
      :pagination="{ pageSize: 10, currentPage, onPageChange: handlePageChange }"
      @change="handleChange"
    />
  </div>
</template>
