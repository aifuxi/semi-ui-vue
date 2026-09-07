<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import {
  Transfer,
  type TransferPrimitive,
  type TransferTreeItem,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/transfer.css';

const value = shallowRef<TransferPrimitive[]>([]);
const treeData: TransferTreeItem[] = [
  {
    label: '文件夹 1',
    value: 'folder1',
    key: 'folder1',
    children: [
      {
        label: '文件 1-1',
        value: 'file1-1',
        key: 'file1-1',
      },
      {
        label: '文件 1-2',
        value: 'file1-2',
        key: 'file1-2',
      },
      {
        label: '子文件夹 1',
        value: 'subfolder1',
        key: 'subfolder1',
        children: [
          {
            label: '文件 1-1-1',
            value: 'file1-1-1',
            key: 'file1-1-1',
          },
          {
            label: '文件 1-1-2',
            value: 'file1-1-2',
            key: 'file1-1-2',
          },
        ],
      },
    ],
  },
  {
    label: '文件夹 2',
    value: 'folder2',
    key: 'folder2',
    children: [
      {
        label: '文件 2-1',
        value: 'file2-1',
        key: 'file2-1',
      },
      {
        label: '文件 2-2',
        value: 'file2-2',
        key: 'file2-2',
      },
    ],
  },
  {
    label: '独立文件',
    value: 'file3',
    key: 'file3',
  },
];
</script>

<template>
  <Transfer v-model="value" :style="{ width: '600px' }" :data-source="treeData" type="treeList">
    <template #sourceHeader="{ num, leafOnlyNum, showButton, allChecked, onAllClick }">
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: '1px solid var(--semi-color-border)',
        }"
      >
        <span>
          <strong>文件总数：</strong>
          {{ leafOnlyNum !== undefined ? leafOnlyNum : num }} 个文件
          <span
            v-if="leafOnlyNum !== undefined"
            :style="{ color: 'var(--semi-color-text-2)', marginLeft: '8px', fontSize: '12px' }"
          >
            （总节点数：{{ num }}）
          </span>
        </span>
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
  </Transfer>
</template>
