<script setup lang="ts">
defineProps<{
  scenarioId: string;
  referenceSource: string | null;
}>();
</script>

<template>
  <div class="scenario-unavailable" role="status" data-testid="vue-scenario-pending">
    <strong>Vue 场景尚未接入</strong>
    <p>
      <code>{{ scenarioId }}</code>
      已有真实 React 基线，但在 Vue 公共组件、行为测试和视觉证据完成前不会参与自动对照。
    </p>
    <p v-if="referenceSource" class="scenario-unavailable__source">
      参考入口：<code>{{ referenceSource }}</code>
    </p>
  </div>
</template>
