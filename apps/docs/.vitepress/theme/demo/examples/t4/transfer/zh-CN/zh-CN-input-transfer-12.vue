<script setup lang="ts">
import { Transfer, type TransferDataItem } from '@aifuxi/semi-ui-vue/transfer';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/transfer.css';
import '@aifuxi/semi-theme-default/button.css';

const data: TransferDataItem[] = Array.from({ length: 30 }, (_, i) => ({
  label: `选项名称 ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));
</script>

<template>
  <Transfer style="width: 568px; height: 416px" :data-source="data">
    <template #sourceHeader="{ num, showButton, allChecked, onAllClick }">
      <div style="margin: 10px 0 0 10px; height: 24px; display: flex; align-items: center">
        <span>共 {{ num }} 项</span>
        <Button
          v-if="showButton"
          theme="borderless"
          type="tertiary"
          size="small"
          @click="onAllClick"
        >
          {{ allChecked ? '取消全选' : '全选' }}
        </Button>
      </div>
    </template>
    <template #selectedHeader="{ num, showButton, onClear }">
      <div style="margin: 10px 0 0 10px; height: 24px; display: flex; align-items: center">
        <span>{{ num }} 项已选</span>
        <Button v-if="showButton" theme="borderless" type="tertiary" size="small" @click="onClear">
          清空
        </Button>
      </div>
    </template>
  </Transfer>
</template>
