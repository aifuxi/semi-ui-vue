<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef } from 'vue';
import type { CSSProperties } from 'vue';
import type { SelectModelValue, SelectOptionProps } from '@aifuxi/semi-ui-vue/select';
const list: Record<string, SelectOptionProps[]> = {
  component: [
    { value: 'select', label: '选择器' },
    { value: 'tabs', label: '标签' },
    { value: 'avatar', label: '头像' },
    { value: 'button', label: '按钮' },
  ],
  design: [
    { value: 'color', label: '颜色' },
    { value: 'dark', label: '暗色模式' },
    { value: 'icon', label: '图标' },
    { value: 'font', label: '字体' },
  ],
  feedback: [
    { value: 'faq', label: '常见问题' },
    { value: 'join', label: '加入用户群' },
    { value: 'hornbill', label: '犀鸟反馈问题' },
  ],
};
const key = shallowRef('component');
const value = shallowRef<SelectModelValue>({ value: 'faq', label: '常见问题' });
const tabOptions = [
  { itemKey: 'component', label: '组件' },
  { itemKey: 'design', label: '设计' },
  { itemKey: 'feedback', label: '反馈' },
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
