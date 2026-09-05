<script setup lang="ts">
import type { NuxtError } from '#app';
defineProps<{ error: NuxtError }>();
</script>

<template>
  <main class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>
      {{
        error.statusCode === 404
          ? '页面不存在 / Page not found'
          : '页面加载失败 / Could not load this page'
      }}
    </p>
    <a href="/zh-cn/start/introduction/">返回文档 / Back to documentation</a>
  </main>
</template>
