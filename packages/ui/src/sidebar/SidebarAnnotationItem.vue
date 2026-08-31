<script setup lang="ts">
import { IconPlay } from '@aifuxi/semi-icons-vue';

import { formatVideoTime } from '../video-player/utils';
import type { SidebarAnnotationItem } from './types';

const props = defineProps<SidebarAnnotationItem>();
const emit = defineEmits<{ click: [event: MouseEvent, item: SidebarAnnotationItem] }>();

function handleClick(event: MouseEvent): void {
  if (props.url && typeof window !== 'undefined') window.open(props.url, '_blank');
  const item = Object.fromEntries(
    Object.entries(props).filter(([key, value]) => key !== 'onClick' && value !== undefined),
  ) as SidebarAnnotationItem;
  emit('click', event, item);
}
</script>

<template>
  <div
    class="semi-sidebar-annotation-item"
    :class="`semi-sidebar-annotation-item-${props.type === 'video' ? 'video' : 'text'}`"
    @click="handleClick"
  >
    <template v-if="props.type === 'video'">
      <div class="semi-sidebar-annotation-item-video-img-wrapper">
        <img
          v-if="props.img"
          class="semi-sidebar-annotation-item-video-img"
          :src="props.img"
          :alt="props.title"
        />
        <IconPlay class="semi-sidebar-annotation-item-video-play" />
        <span
          v-if="typeof props.duration === 'number'"
          class="semi-sidebar-annotation-item-video-duration"
          >{{ formatVideoTime(props.duration) }}</span
        >
      </div>
      <div class="semi-sidebar-annotation-item-video-content">
        <div class="semi-sidebar-annotation-item-title">{{ props.title }}</div>
        <div class="semi-sidebar-annotation-item-footer">
          <img
            class="semi-sidebar-annotation-item-footer-logo"
            :src="props.logo"
            :alt="props.title"
          />
          <span class="semi-sidebar-annotation-item-footer-text">{{ props.siteName }}</span>
          <span
            v-if="typeof props.order === 'number'"
            class="semi-sidebar-annotation-item-footer-order"
            >{{ props.order }}</span
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div class="semi-sidebar-annotation-item-title">{{ props.title }}</div>
      <div class="semi-sidebar-annotation-item-text-detail">{{ props.detail }}</div>
      <div class="semi-sidebar-annotation-item-footer">
        <img
          v-if="props.logo"
          class="semi-sidebar-annotation-item-footer-logo"
          :src="props.logo"
          :alt="props.title"
        />
        <span v-if="props.siteName" class="semi-sidebar-annotation-item-footer-text">{{
          props.siteName
        }}</span>
        <span
          v-if="typeof props.order === 'number'"
          class="semi-sidebar-annotation-item-footer-order"
          >{{ props.order }}</span
        >
      </div>
    </template>
  </div>
</template>
