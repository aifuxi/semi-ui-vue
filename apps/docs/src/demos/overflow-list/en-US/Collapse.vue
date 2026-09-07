<script setup lang="ts">
import { shallowRef, type Component } from 'vue';
import { OverflowList } from '@aifuxi/semi-ui-vue/overflow-list';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import {
  IconAlarm,
  IconBookmark,
  IconCamera,
  IconDuration,
  IconEdit,
  IconFolder,
} from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/overflow-list.css';
import '@aifuxi/semi-theme-default/slider.css';
import '@aifuxi/semi-theme-default/tag.css';

const width = shallowRef(100);
const items = [
  { icon: IconAlarm, key: 'alarm' },
  { icon: IconBookmark, key: 'bookmark' },
  { icon: IconCamera, key: 'camera' },
  { icon: IconDuration, key: 'duration' },
  { icon: IconEdit, key: 'edit' },
  { icon: IconFolder, key: 'folder' },
];
</script>

<template>
  <div>
    <Slider
      :step="1"
      :value="width"
      aria-label="List width percentage"
      @change="width = Number($event)"
    />
    <br />
    <br />
    <div :style="{ width: `${width}%` }">
      <OverflowList :items="items">
        <template #visibleItem="{ item }">
          <Tag color="blue" style="margin-right: 8px; flex: 0 0 auto">
            <component :is="item.icon as Component" style="margin-right: 4px" />{{ item.key }}
          </Tag>
        </template>
        <template #overflow="{ items: hidden }">
          <Tag v-if="hidden.length" style="flex: 0 0 auto; font-variant-numeric: tabular-nums"
            >+{{ hidden.length }}</Tag
          >
        </template>
      </OverflowList>
    </div>
  </div>
</template>
