<script setup lang="ts">
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { IconMore } from '@aifuxi/semi-icons-vue';
import type { VNodeChild } from 'vue';
import type { BreadcrumbItemInfo } from '@aifuxi/semi-ui-vue/breadcrumb';
const routes = [
  'Home',
  'Many levels',
  'Another level',
  'Another level again',
  'Here is another one',
  'Penultimate',
  'Detail',
];
// The slot supplies existing VNodes; preserve their identity and event handlers.
const RenderNode = (props: { node: VNodeChild }) => props.node;
function logClick(item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent) {
  console.log(item, event);
}
</script>

<template>
  <Breadcrumb :routes="routes" @click="logClick">
    <template #more="{ items }">
      <Popover style="padding: 12px" show-arrow>
        <template #content>
          <template v-for="(item, index) in items" :key="index">
            <RenderNode :node="item" />
            <span
              v-if="index !== items.length - 1"
              style="color: var(--semi-color-text-2); margin-right: 6px"
              >-</span
            >
          </template>
        </template>
        <IconMore aria-label="More levels" tabindex="0" />
      </Popover>
    </template>
  </Breadcrumb>
</template>
