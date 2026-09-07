<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
import {
  Transfer,
  type TransferPrimitive,
  type TransferTreeItem,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';

const value = shallowRef<TransferPrimitive[]>(['Shanghai']);
const treeData: TransferTreeItem[] = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        children: [
          {
            label: 'Beijing',
            value: 'Beijing',
            key: '0-0-0',
          },
          {
            label: 'Shanghai',
            value: 'Shanghai',
            key: '0-0-1',
          },
          {
            label: 'Chengdu',
            value: 'Chengdu',
            key: '0-0-2',
          },
        ],
      },
      {
        label: 'Japan',
        value: 'Japan',
        key: '0-1',
        children: [
          {
            label: 'Osaka',
            value: 'Osaka',
            key: '0-1-0',
          },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'North America',
    key: '1',
    children: [
      {
        label: 'United States',
        value: 'United States',
        key: '1-0',
      },
      {
        label: 'Canada',
        value: 'Canada',
        key: '1-1',
      },
      {
        label: 'Mexico',
        value: 'Mexico',
        disabled: true,
        key: '1-2',
      },
      {
        label: 'Cuba',
        value: 'Cuba',
        key: '1-3',
      },
    ],
  },
];
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div :style="{ margin: '10px', padding: '10px', width: '600px' }">
      <Transfer v-model="value" :data-source="treeData" type="treeList" />
    </div>
  </ConfigProvider>
</template>
