<script setup lang="ts">
import { h, shallowRef, type CSSProperties } from 'vue';
import { IconBell, IconCustomerSupport, IconHelpCircle, IconPlus } from '@workspace/icons';
import {
  FloatButton,
  FloatButtonGroup,
  type FloatButtonGroupItem,
  type FloatButtonSize,
} from '@workspace/ui';

const sizes: readonly FloatButtonSize[] = ['small', 'default', 'large'];
const inlineStyle: CSSProperties = {
  position: 'relative',
  right: 'auto',
  bottom: 'auto',
};
const groupItems: readonly FloatButtonGroupItem[] = [
  { content: '客服', icon: h(IconCustomerSupport), value: 'support' },
  { badge: { count: 6 }, content: '消息', icon: h(IconBell), value: 'message' },
  { content: '帮助', icon: h(IconHelpCircle), value: 'help' },
];
const lastAction = shallowRef('暂无');
</script>

<template>
  <div class="float-button-scenario" data-testid="float-button-vue">
    <section class="float-button-scenario__section" aria-label="尺寸、形状与状态">
      <h3>尺寸、形状与状态</h3>
      <div class="float-button-scenario__row">
        <FloatButton
          v-for="size in sizes"
          :key="size"
          :class="`float-button-target-${size}`"
          :size="size"
          :style="inlineStyle"
          @click="lastAction = size"
        >
          <template #icon><IconPlus /></template>
        </FloatButton>
        <FloatButton class="float-button-target-square" shape="square" :style="inlineStyle">
          <template #icon><IconPlus /></template>
        </FloatButton>
        <FloatButton colorful class="float-button-target-colorful" :style="inlineStyle">
          <template #icon><IconPlus /></template>
        </FloatButton>
        <FloatButton
          disabled
          class="float-button-target-disabled"
          :style="inlineStyle"
          @click="lastAction = 'disabled'"
        >
          <template #icon><IconPlus /></template>
        </FloatButton>
        <FloatButton
          :badge="{ count: 120, overflowCount: 99 }"
          class="float-button-target-badge"
          :style="inlineStyle"
        >
          <template #icon><IconBell /></template>
        </FloatButton>
      </div>
    </section>

    <section class="float-button-scenario__section" aria-label="悬浮按钮组">
      <h3>悬浮按钮组</h3>
      <FloatButtonGroup
        class="float-button-target-group"
        :items="groupItems"
        :style="inlineStyle"
        @click="lastAction = $event"
      />
    </section>

    <output class="scenario-action-output" aria-live="polite"> 最近操作：{{ lastAction }} </output>
  </div>
</template>
