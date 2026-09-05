<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef } from 'vue';
import type { CSSProperties } from 'vue';
import type { SelectModelValue, SelectOptionProps } from '@aifuxi/semi-ui-vue/select';
const list: Record<string, SelectOptionProps[]> = {
  component: [
    { value: 'select', label: 'Select' },
    { value: 'tabs', label: 'Tabs' },
    { value: 'avatar', label: 'Avatar' },
    { value: 'button', label: 'Button' },
  ],
  design: [
    { value: 'color', label: 'Color' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'icon', label: 'Icon' },
    { value: 'font', label: 'Topography' },
  ],
  feedback: [
    { value: 'faq', label: 'FAQ' },
    { value: 'join', label: 'Join Chat Group' },
    { value: 'hornbill', label: 'Hornbill' },
  ],
};
const key = shallowRef('component');
const value = shallowRef<SelectModelValue>({ value: 'faq', label: 'FAQ' });
const tabOptions = [
  { itemKey: 'component', label: 'Compoonent' },
  { itemKey: 'design', label: 'Design' },
  { itemKey: 'feedback', label: 'Feedback' },
];
const tabStyle: CSSProperties = { cursor: 'pointer', marginRight: '12px', paddingBottom: '4px' };
const tabActiveStyle: CSSProperties = {
  ...tabStyle,
  borderBottom: '1px solid var(--semi-color-primary)',
  fontWeight: 700,
};
const tabWrapper: CSSProperties = {
  display: 'flex',
  paddingTop: '8px',
  paddingLeft: '32px',
  paddingRight: '32px',
  borderBottom: '0.5px solid var(--semi-color-border)',
};
</script>
<template>
  <Select
    v-model="value"
    default-open
    :auto-adjust-overflow="false"
    on-change-with-object
    style="width: 200px"
    :option-list="list[key] ?? []"
    ><template #outerTop
      ><div :style="tabWrapper">
        <div
          v-for="item in tabOptions"
          :key="item.itemKey"
          :style="item.itemKey === key ? tabActiveStyle : tabStyle"
          @click="key = item.itemKey"
        >
          {{ item.label }}
        </div>
      </div></template
    ></Select
  >
</template>
