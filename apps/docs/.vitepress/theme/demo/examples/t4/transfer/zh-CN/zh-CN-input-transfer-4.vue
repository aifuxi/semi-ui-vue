<script setup lang="ts">
import { shallowRef } from 'vue';
import {
  Transfer,
  type TransferDataItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
import { Avatar, type AvatarColor } from '@aifuxi/semi-ui-vue/avatar';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import IconClose from '@aifuxi/semi-icons-vue/icons/IconClose';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/highlight.css';

interface Contact extends TransferDataItem {
  label: string;
  value: string;
  abbr: string;
  color: AvatarColor;
  area: string;
}

const searchText = shallowRef('');
const data: Contact[] = [
  {
    label: '夏可漫',
    value: 'xiakeman@example.com',
    abbr: '夏',
    color: 'amber',
    area: 'US',
    key: 1,
  },
  { label: '申悦', value: 'shenyue@example.com', abbr: '申', color: 'indigo', area: 'UK', key: 2 },
  {
    label: '文嘉茂',
    value: 'wenjiamao@example.com',
    abbr: '文',
    color: 'cyan',
    area: 'HK',
    key: 3,
  },
  {
    label: '曲晨一',
    value: 'quchenyi@example.com',
    abbr: '曲',
    color: 'blue',
    area: 'India',
    key: 4,
  },
  {
    label: '曲晨二',
    value: 'quchener@example.com',
    abbr: '二',
    color: 'blue',
    area: 'India',
    key: 5,
  },
  {
    label: '曲晨三',
    value: 'quchensan@example.com',
    abbr: '三',
    color: 'blue',
    area: 'India',
    key: 6,
  },
];

function customFilter(input: string, item: TransferDataItem): boolean {
  const contact = item as Contact;
  return contact.value.includes(input) || contact.label.includes(input);
}

function handleChange(values: TransferPrimitive[], items: TransferDataItem[]): void {
  console.log(values, items);
}
</script>

<template>
  <Transfer
    style="width: 568px"
    :data-source="data"
    :filter="customFilter"
    :default-value="['xiakeman@example.com', 'shenyue@example.com']"
    :input-props="{ placeholder: '搜索姓名或邮箱' }"
    @search="searchText = $event"
    @change="handleChange"
  >
    <template #sourceItem="item">
      <div class="components-transfer-demo-source-item">
        <Checkbox
          :checked="item.checked"
          style="height: 52px; align-items: center"
          @change="item.onChange()"
        >
          <Avatar :color="(item as Contact).color" size="small">{{
            (item as Contact).abbr
          }}</Avatar>
          <div class="info">
            <div class="name">
              <Highlight :source-string="(item as Contact).label" :search-words="[searchText]" />
            </div>
            <div class="email">
              <Highlight :source-string="(item as Contact).value" :search-words="[searchText]" />
            </div>
          </div>
        </Checkbox>
      </div>
    </template>
    <template #selectedItem="item">
      <div class="components-transfer-demo-selected-item">
        <Avatar :color="(item as Contact).color" size="small">{{ (item as Contact).abbr }}</Avatar>
        <div class="info">
          <div class="name">{{ item.label }}</div>
          <div class="email">{{ item.value }}</div>
        </div>
        <button
          type="button"
          class="remove-button"
          :aria-label="`移除 ${item.label}`"
          @click="item.onRemove()"
        >
          <IconClose />
        </button>
      </div>
    </template>
  </Transfer>
</template>

<style scoped>
.components-transfer-demo-selected-item .remove-button {
  visibility: hidden;
  color: var(--semi-color-tertiary);
}

.components-transfer-demo-selected-item:hover .remove-button,
.components-transfer-demo-selected-item:focus-within .remove-button {
  visibility: visible;
}

.components-transfer-demo-selected-item,
.components-transfer-demo-source-item {
  height: 52px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
}

.components-transfer-demo-selected-item:hover,
.components-transfer-demo-source-item:hover {
  background-color: var(--semi-color-fill-0);
}

.info {
  margin-left: 8px;
  flex-grow: 1;
}

.name {
  font-size: 14px;
  line-height: 20px;
}

.email {
  font-size: 12px;
  line-height: 16px;
  color: var(--semi-color-text-2);
}

.remove-button {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}
</style>
