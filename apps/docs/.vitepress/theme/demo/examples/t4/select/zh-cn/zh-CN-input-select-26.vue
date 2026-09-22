<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/tag.css';
import { IconAppCenter, IconChevronDown } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const value = shallowRef<SelectModelValue>(['douyin', 'ulikecam']);
const list = [
  { value: 'douyin', label: '抖音' },
  { value: 'ulikecam', label: '轻颜相机' },
  { value: 'jianying', label: '剪映' },
  { value: 'toutiao', label: '今日头条' },
];
function labels(items: Array<{ label?: unknown }>, separator: string) {
  return items.map((item) => item.label).join(separator);
}
</script>
<template>
  <div>
    <h4>不同背景色的触发器</h4>
    <Select
      v-model="value"
      :option-list="list"
      multiple
      filter
      search-position="dropdown"
      style="width: 240px"
      ><template #trigger="{ value: selected }"
        ><div
          style="
            min-width: 112px;
            background-color: var(--semi-color-primary-light-default);
            height: 32px;
            display: flex;
            align-items: center;
            padding-left: 12px;
            border-radius: 3px;
            color: var(--semi-color-primary);
          "
        >
          <div style="font-weight: 600; flex-shrink: 0; font-size: 14px">业务线</div>
          <div
            style="
              margin: 4px;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex-grow: 1;
              overflow: hidden;
            "
          >
            {{ labels(selected, ' , ') }}
          </div>
          <IconAppCenter style="margin-right: 8px; flex-shrink: 0" /></div></template></Select
    ><br /><br />
    <h4>使用 circle Tag 作为触发器</h4>
    <Select
      v-model="value"
      :option-list="list"
      multiple
      filter
      search-position="dropdown"
      style="width: 240px; margin-top: 20px; outline: 0"
      ><template #trigger="{ value: selected }"
        ><div
          style="
            margin: 4px;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            align-items: center;
          "
        >
          <Tag size="large" color="cyan" shape="circle"
            ><template #suffixIcon><IconChevronDown /></template>{{ labels(selected, ' / ') }}</Tag
          >
        </div></template
      ></Select
    >
  </div>
</template>
