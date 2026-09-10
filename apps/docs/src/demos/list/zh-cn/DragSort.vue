<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { onBeforeUnmount, shallowRef } from 'vue';
const data = shallowRef([
  { id: 1, title: 'Semi Design Title 1', color: 'red' },
  { id: 2, title: 'Semi Design Title 2', color: 'grey' },
  { id: 3, title: 'Semi Design Title 3', color: 'light-green' },
  { id: 4, title: 'Semi Design Title 4', color: 'light-blue' },
  { id: 5, title: 'Semi Design Title 5', color: 'pink' },
] as const);
const items = shallowRef([...data.value]);
const container = shallowRef<HTMLElement | null>(null);
const active = shallowRef<number | null>(null);
const offset = shallowRef(0);
let startY = 0;
let startScrollY = 0;
let pointerY = 0;
let frame = 0;
function autoScroll() {
  const margin = 40;
  if (pointerY < margin) window.scrollBy(0, -8);
  else if (pointerY > window.innerHeight - margin) window.scrollBy(0, 8);
  offset.value = pointerY - startY + window.scrollY - startScrollY;
  frame = requestAnimationFrame(autoScroll);
}
function startDrag(event: PointerEvent, id: number) {
  if (event.button !== 0) return;
  active.value = id;
  startY = event.clientY;
  startScrollY = window.scrollY;
  pointerY = event.clientY;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  frame = requestAnimationFrame(autoScroll);
}
function moveDrag(event: PointerEvent) {
  if (active.value === null) return;
  pointerY = event.clientY;
  offset.value = event.clientY - startY + window.scrollY - startScrollY;
}
function endDrag(event: PointerEvent) {
  const id = active.value;
  if (id === null) return;
  if (Math.abs(offset.value) < 1) {
    cancelDrag();
    return;
  }
  const nodes = [...(container.value?.querySelectorAll<HTMLElement>('[data-row]') || [])];
  const center = (node: HTMLElement) => {
    const rect = node.getBoundingClientRect();
    return rect.top + rect.height / 2 - (Number(node.dataset.row) === id ? offset.value : 0);
  };
  const target = nodes.reduce<HTMLElement | undefined>(
    (closest, node) =>
      !closest || Math.abs(event.clientY - center(node)) < Math.abs(event.clientY - center(closest))
        ? node
        : closest,
    undefined,
  );
  const from = items.value.findIndex((item) => item.id === id);
  const to = items.value.findIndex((item) => item.id === Number(target?.dataset.row));
  if (from >= 0 && to >= 0 && from !== to) {
    const next = [...items.value];
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    items.value = next;
  }
  cancelDrag();
}
function cancelDrag() {
  active.value = null;
  offset.value = 0;
  cancelAnimationFrame(frame);
}
onBeforeUnmount(cancelDrag);
</script>

<template>
  <div ref="container">
    <List
      ><div
        v-for="item in items"
        :key="item.id"
        :data-row="item.id"
        class="drag-item"
        :style="
          active === item.id
            ? {
                transform: `translateY(${offset}px)`,
                position: 'relative',
                zIndex: 999,
                background: 'var(--semi-color-bg-0)',
              }
            : {}
        "
        @pointerdown="startDrag($event, item.id)"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="cancelDrag"
      >
        <ListItem
          ><template #header><Avatar :color="item.color">SE</Avatar></template
          ><template #main
            ><div>
              <span style="color: var(--semi-color-text-0); font-weight: 500">{{
                item.title
              }}</span>
              <p style="color: var(--semi-color-text-2); margin: 4px 0">
                Semi Design 是由抖音前端团队与 UED
                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                Web 应用。
              </p>
            </div></template
          ></ListItem
        >
      </div></List
    >
  </div>
</template>

<style scoped>
.drag-item {
  border: 1px solid var(--semi-color-border);
  margin-bottom: 12px;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.drag-item:active {
  cursor: grabbing;
}
</style>
