<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import {
  Transfer,
  type TransferDataItem,
  type TransferPrimitive,
} from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
import { Avatar, type AvatarColor } from '@aifuxi/semi-ui-vue/avatar';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import IconClose from '@aifuxi/semi-icons-vue/icons/IconClose';
import IconHandle from '@aifuxi/semi-icons-vue/icons/IconHandle';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/checkbox.css';

interface Contact extends TransferDataItem {
  label: string;
  value: string;
  abbr: string;
  color: AvatarColor;
  area: string;
}

const data: Contact[] = [
  {
    label: 'Xiakeman',
    value: 'xiakeman@example.com',
    abbr: 'Xia',
    color: 'amber',
    area: 'US',
    key: 1,
  },
  {
    label: 'Shenyue',
    value: 'shenyue@example.com',
    abbr: 'Shen',
    color: 'indigo',
    area: 'UK',
    key: 2,
  },
  {
    label: 'Wenjiamao',
    value: 'wenjiamao@example.com',
    abbr: 'Wen',
    color: 'cyan',
    area: 'HK',
    key: 3,
  },
  {
    label: 'Quchenyi',
    value: 'quchenyi@example.com',
    abbr: 'Qu',
    color: 'blue',
    area: 'India',
    key: 4,
  },
  {
    label: 'Quchener',
    value: 'quchener@example.com',
    abbr: 'Er',
    color: 'blue',
    area: 'India',
    key: 5,
  },
  {
    label: 'Quchensan',
    value: 'quchensan@example.com',
    abbr: 'San',
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
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Transfer
      draggable
      style="width: 568px"
      :data-source="data"
      :filter="customFilter"
      :default-value="['xiakeman@example.com', 'shenyue@example.com']"
      :input-props="{ placeholder: 'Search for a name or email' }"
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
              <div class="name">{{ item.label }}</div>
              <div class="email">{{ item.value }}</div>
            </div>
          </Checkbox>
        </div>
      </template>
      <template #selectedItem="item">
        <div class="components-transfer-demo-selected-item">
          <IconHandle v-bind="item.dragHandleProps" class="semi-right-item-drag-handler" />
          <Avatar :color="(item as Contact).color" size="small">{{
            (item as Contact).abbr
          }}</Avatar>
          <div class="info">
            <div class="name">{{ item.label }}</div>
            <div class="email">{{ item.value }}</div>
          </div>
          <button
            type="button"
            class="remove-button"
            :aria-label="`Remove ${item.label}`"
            @click="item.onRemove()"
          >
            <IconClose />
          </button>
        </div>
      </template>
    </Transfer>
  </ConfigProvider>
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
