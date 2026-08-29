<script setup lang="ts">
import { Spin } from '@workspace/ui';
</script>

<template>
  <div class="spin-scenario" data-testid="spin-vue">
    <div class="spin-scenario__sizes">
      <Spin size="small" data-parity-target="spin-small" />
      <Spin data-parity-target="spin-middle" />
      <Spin size="large" data-parity-target="spin-large" />
      <Spin data-parity-target="spin-custom" wrapper-class-name="spin-scenario__custom">
        <template #indicator><span class="spin-scenario__custom-indicator">↻</span></template>
      </Spin>
    </div>

    <Spin data-parity-target="spin-block">
      <template #tip><span class="spin-scenario__tip">Loading profile</span></template>
      <article class="spin-scenario__content">
        <strong>Profile</strong>
        <span>Content is being refreshed.</span>
      </article>
    </Spin>

    <Spin :spinning="false" data-parity-target="spin-hidden">
      <p class="spin-scenario__ready">Content ready</p>
    </Spin>
  </div>
</template>
