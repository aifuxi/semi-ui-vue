<script setup lang="ts">
import { withBase } from 'vitepress';
import { docsNav, iconUrl, splitPageTitle } from '../composables/use-docs-data';

/** 首页与组件总览共用；`start` 分组本身是当前页所在分组，不需要再列一遍。 */
const categories = docsNav.categories.filter((category) => category.id !== 'start');
</script>

<template>
  <section v-for="category in categories" :key="category.id" class="docs-home-category">
    <h2>{{ category.label }}</h2>
    <div class="component-grid">
      <a
        v-for="page in category.pages"
        :key="page.path"
        class="component-card"
        :href="withBase(page.path)"
      >
        <img v-if="iconUrl(page.icon)" :src="withBase(iconUrl(page.icon)!)" alt="" />
        <span>
          <strong>{{ page.englishTitle }}</strong>
          <small>{{ splitPageTitle(page.title).chineseTitle }}</small>
        </span>
      </a>
    </div>
  </section>
</template>
