<script setup lang="ts">
import { categoryLabel, type DocPage } from '../../data/docs';
defineProps<{ page: DocPage }>();
</script>

<template>
  <header class="title-area">
    <div class="header-tinyTitle">
      {{ categoryLabel(page.category, page.locale) }} · {{ page.englishTitle }}
    </div>
    <h1 class="header-title">{{ page.title }}</h1>
    <div class="article-brief">{{ page.description }}</div>
  </header>
</template>
