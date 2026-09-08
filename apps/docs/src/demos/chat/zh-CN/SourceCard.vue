<script setup lang="ts">
import { shallowRef } from 'vue';
import { Avatar, AvatarGroup } from '@aifuxi/semi-ui-vue/avatar';
import { IconChevronUp } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/avatar.css';
defineProps<{
  source: Array<{ avatar: string; title: string; subTitle: string; content: string }>;
}>();
const collapsed = shallowRef(true);
</script>
<template>
  <div
    class="source-card"
    :style="{ height: collapsed ? '30px' : '200px', width: collapsed ? '190px' : '100%' }"
  >
    <button v-show="collapsed" class="source-summary" @click="collapsed = false">
      基于{{ source.length }}个搜索来源<AvatarGroup size="extra-extra-small"
        ><Avatar v-for="item in source" :key="item.title" :src="item.avatar"
      /></AvatarGroup>
    </button>
    <div v-show="!collapsed" class="source-expanded">
      <button class="source-heading" @click="collapsed = true">Source<IconChevronUp /></button>
      <div class="source-list">
        <article v-for="item in source" :key="item.title">
          <span
            ><Avatar
              :src="item.avatar"
              shape="square"
              :style="{ width: '16px', height: '16px', flexShrink: 0 }"
            />{{ item.title }}</span
          ><span class="source-subtitle">{{ item.subTitle }}</span
          ><span>{{ item.content }}</span>
        </article>
      </div>
    </div>
  </div>
</template>
<style scoped>
.source-card {
  transition:
    height 0.4s ease,
    width 0.4s ease;
  background: var(--semi-color-tertiary-light-hover);
  border-radius: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
  overflow: hidden;
}
.source-summary,
.source-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: var(--semi-color-text-1);
  font: inherit;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
}
.source-summary {
  white-space: nowrap;
}
.source-expanded {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.source-heading {
  width: 100%;
  justify-content: space-between;
  font-weight: 500;
}
.source-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: auto;
  padding: 5px 10px;
}
.source-list article {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1 0 150px;
  border: 1px solid var(--semi-color-border);
  border-radius: 12px;
  padding: 12px;
  font-size: 12px;
  color: var(--semi-color-text-2);
}
.source-list article > span:first-child {
  display: flex;
  gap: 5px;
  align-items: center;
}
.source-subtitle {
  color: var(--semi-color-primary);
}
</style>
