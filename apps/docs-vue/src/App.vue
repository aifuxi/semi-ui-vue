<script setup lang="ts">
import { REFERENCE_BASELINE } from '@workspace/test-infra';
</script>

<template>
  <main class="workspace-shell">
    <p class="workspace-shell__eyebrow">Vue parity target</p>
    <h1>Semi UI Vue 对照工作台</h1>
    <p>
      当前固定参考版本为
      <code>{{ REFERENCE_BASELINE.tag }}</code>
      。组件实现将按对齐矩阵逐项进入这里。
    </p>
    <div class="visual-calibration" data-testid="visual-calibration" aria-hidden="true">
      <span class="visual-calibration__primary" />
      <span class="visual-calibration__success" />
      <span class="visual-calibration__warning" />
    </div>
  </main>
</template>
