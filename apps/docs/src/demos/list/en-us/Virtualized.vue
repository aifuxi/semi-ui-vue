<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
} from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';
interface Item {
  title: string;
  color: 'grey';
}
const rowHeight = 118;
const rowCount = 50;
const scrollTop = shallowRef(0);
const records = shallowRef<Record<number, Item>>({});
const start = computed(() => Math.max(0, Math.floor(scrollTop.value / rowHeight) - 2));
const indices = computed(() =>
  Array.from({ length: Math.min(10, rowCount - start.value) }, (_, offset) => start.value + offset),
);
const pending = new Set<number>();
const timers = new Set<ReturnType<typeof setTimeout>>();
function loadVisible() {
  const missing = indices.value.filter((index) => !records.value[index] && !pending.has(index));
  if (!missing.length) return;
  missing.forEach((index) => pending.add(index));
  const timer = setTimeout(() => {
    const next = { ...records.value };
    missing.forEach((index) => {
      next[index] = { title: `Semi Design Title ${index}`, color: 'grey' };
      pending.delete(index);
    });
    records.value = next;
    timers.delete(timer);
  }, 1000);
  timers.add(timer);
}
function onScroll(event: Event) {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
  loadVisible();
}
onMounted(loadVisible);
onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div style="border: 1px solid var(--semi-color-border); padding: 10px">
      <div
        style="height: 500px; overflow: auto"
        tabindex="0"
        aria-label="Virtual scrolling list"
        @scroll="onScroll"
      >
        <List
          ><div :style="{ height: `${rowCount * rowHeight}px`, position: 'relative' }">
            <div
              v-for="index in indices"
              :key="index"
              :style="{
                position: 'absolute',
                top: `${index * rowHeight}px`,
                height: `${rowHeight}px`,
                width: '100%',
              }"
            >
              <Skeleton :loading="!records[index]"
                ><template #placeholder
                  ><div
                    style="
                      display: flex;
                      align-items: flex-start;
                      padding: 12px;
                      border-bottom: 1px solid var(--semi-color-border);
                    "
                  >
                    <SkeletonAvatar style="margin-right: 12px" />
                    <div>
                      <SkeletonTitle
                        style="width: 120px; margin-bottom: 12px; margin-top: 12px"
                      /><SkeletonParagraph style="width: 600px" :rows="2" />
                    </div></div></template
                ><ListItem
                  ><template #header
                    ><Avatar :color="records[index]?.color || 'grey'">SE</Avatar></template
                  ><template #main
                    ><div>
                      <span style="color: var(--semi-color-text-0); font-weight: 500">{{
                        records[index]?.title
                      }}</span>
                      <p style="color: var(--semi-color-text-2); margin: 4px 0">
                        Life's but a walking shadow, a poor player, that struts and frets his hour
                        upon the stage, and then is heard no more; it is a tale told by an idiot,
                        full of sound and fury, signifying nothing.
                      </p>
                    </div></template
                  ></ListItem
                ></Skeleton
              >
            </div>
          </div></List
        >
      </div>
    </div></ConfigProvider
  >
</template>
