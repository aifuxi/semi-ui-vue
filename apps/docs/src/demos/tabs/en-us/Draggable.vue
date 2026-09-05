<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane, TabItem } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
const activeKey = shallowRef('1');
const items = shallowRef([
  { itemKey: '1', tab: 'Document', content: 'Document content' },
  { itemKey: '2', tab: 'Table', content: 'Table content' },
  { itemKey: '3', tab: 'Slides', content: 'Slides content' },
  { itemKey: '4', tab: 'Form', content: 'Form content' },
]);
function onKeyDown(
  event: KeyboardEvent,
  key: string,
  list: Array<{ itemKey: string; disabled?: boolean }>,
  select: (key: string, event: KeyboardEvent) => void,
) {
  const enabled = list.filter((item) => !item.disabled);
  const index = enabled.findIndex((item) => item.itemKey === key);
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % enabled.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + enabled.length) % enabled.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = enabled.length - 1;
  else if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  const item = enabled[next];
  if (item) {
    select(item.itemKey, event);
    (event.currentTarget as HTMLElement).parentElement
      ?.querySelector<HTMLElement>(`[data-tabkey="semiTab${item.itemKey}"]`)
      ?.focus();
  }
}
const dragging = shallowRef('');
const delta = shallowRef(0);
let origin = 0;
let started = false;
let suppressClick = false;
function begin(event: PointerEvent, key: string) {
  if (event.button !== 0) return;
  origin = event.clientX;
  started = false;
  dragging.value = key;
  delta.value = 0;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}
function move(event: PointerEvent) {
  if (!dragging.value) return;
  const distance = event.clientX - origin;
  if (Math.abs(distance) >= 5) started = true;
  if (started) {
    event.preventDefault();
    delta.value = distance;
  }
}
function finish(event: PointerEvent) {
  if (started) {
    const bar = (event.currentTarget as HTMLElement).parentElement;
    const nodes = Array.from(bar?.querySelectorAll<HTMLElement>('[data-sort-key]') ?? []);
    let target = dragging.value;
    let min = Infinity;
    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      const offset = node.dataset.sortKey === dragging.value ? delta.value : 0;
      const distance = Math.abs(event.clientX - (rect.left + rect.width / 2 - offset));
      if (distance < min) {
        min = distance;
        target = node.dataset.sortKey ?? target;
      }
    }
    const next = [...items.value];
    const from = next.findIndex((item) => item.itemKey === dragging.value);
    const to = next.findIndex((item) => item.itemKey === target);
    const item = next.splice(from, 1)[0];
    if (item) {
      next.splice(to, 0, item);
      items.value = next;
    }
    suppressClick = true;
  }
  dragging.value = '';
  delta.value = 0;
  started = false;
}
function select(key: string) {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  activeKey.value = key;
}
function cancel() {
  dragging.value = '';
  delta.value = 0;
  started = false;
}
</script>

<template>
  <Tabs v-model:active-key="activeKey" type="line"
    ><template #tabBar
      ><div
        class="semi-tabs-bar semi-tabs-bar-line semi-tabs-bar-top"
        role="tablist"
        aria-orientation="horizontal"
      >
        <TabItem
          v-for="item in items"
          :key="item.itemKey"
          :item-key="item.itemKey"
          :tab="item.tab"
          :selected="activeKey === item.itemKey"
          :data-sort-key="item.itemKey"
          :style="{
            transform: dragging === item.itemKey ? `translateX(${delta}px)` : undefined,
            cursor: 'grab',
            opacity: dragging === item.itemKey && Math.abs(delta) >= 5 ? 0.5 : 1,
            display: 'inline-flex',
            touchAction: 'none',
          }"
          @click="select"
          @pointerdown="(event: PointerEvent) => begin(event, item.itemKey)"
          @pointermove="move"
          @pointerup="finish"
          @pointercancel="cancel"
          @key-down="(event, key) => onKeyDown(event, key, items, (next) => (activeKey = next))"
        /></div></template
    ><TabPane v-for="item in items" :key="item.itemKey" :tab="item.tab" :item-key="item.itemKey"
      ><div style="padding: 20px">{{ item.content }}</div></TabPane
    ></Tabs
  >
</template>
