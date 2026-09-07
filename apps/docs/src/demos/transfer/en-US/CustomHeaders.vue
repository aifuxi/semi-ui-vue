<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Transfer, type TransferDataItem } from '@aifuxi/semi-ui-vue/transfer';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/transfer.css';
import '@aifuxi/semi-theme-default/button.css';

const data: TransferDataItem[] = Array.from({ length: 30 }, (_, i) => ({
  label: `Item ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Transfer style="width: 568px; height: 416px" :data-source="data">
      <template #sourceHeader="{ num, showButton, allChecked, onAllClick }">
        <div style="margin: 10px 0 0 10px; height: 24px; display: flex; align-items: center">
          <span>Total {{ num }} items</span>
          <Button
            v-if="showButton"
            theme="borderless"
            type="tertiary"
            size="small"
            @click="onAllClick"
          >
            {{ allChecked ? 'Unselect all' : 'Select all' }}
          </Button>
        </div>
      </template>
      <template #selectedHeader="{ num, showButton, onClear }">
        <div style="margin: 10px 0 0 10px; height: 24px; display: flex; align-items: center">
          <span>{{ num }} items selected</span>
          <Button
            v-if="showButton"
            theme="borderless"
            type="tertiary"
            size="small"
            @click="onClear"
          >
            Clear
          </Button>
        </div>
      </template>
    </Transfer>
  </ConfigProvider>
</template>
