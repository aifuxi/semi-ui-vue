<script setup lang="ts">
import { Tabs, TabPane, TabItem } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
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
</script>

<template>
  <Tabs default-active-key="1"
    ><template #tabBar="{ activeKey, list, onTabClick }"
      ><div class="tab-bar-box">
        这是二次封装的Tab Bar，当前ActiveKey： {{ activeKey }}
        <div
          class="semi-tabs-bar semi-tabs-bar-line semi-tabs-bar-top"
          role="tablist"
          aria-orientation="horizontal"
        >
          <TabItem
            v-for="item in list"
            :key="item.itemKey"
            v-bind="item"
            :selected="item.itemKey === activeKey"
            @click="onTabClick"
            @key-down="(event, key) => onKeyDown(event, key, list, onTabClick)"
          />
        </div></div></template
    ><TabPane tab="文档" item-key="1">文档</TabPane
    ><TabPane tab="快速起步" item-key="2">快速起步</TabPane
    ><TabPane tab="帮助" item-key="3">帮助</TabPane></Tabs
  >
</template>
