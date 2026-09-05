<script setup lang="ts">
import { computed } from 'vue';
import { categories, categoryLabel, docPages } from '../../data/docs';
import { useDocsPreferences } from '../../composables/useDocsPreferences';
const { locale } = useDocsPreferences();
const groups = computed(() =>
  categories
    .map(([id]) => ({
      id,
      title: categoryLabel(id, locale.value),
      pages: docPages.filter(
        (page) =>
          page.locale === locale.value &&
          page.category === id &&
          page.path.includes('/components/') &&
          page.slug !== 'index',
      ),
    }))
    .filter((group) => group.pages.length),
);
</script>

<template>
  <section v-for="group in groups" :key="group.id">
    <h2 :id="group.id" class="gatsby-h2">{{ group.title }}</h2>
    <div class="component-grid">
      <NuxtLink
        v-for="page in group.pages"
        :key="page.path"
        :to="page.path"
        :prefetch="false"
        class="component-card"
        ><strong>{{ page.englishTitle }}</strong
        ><small>{{ page.title }}</small></NuxtLink
      >
    </div>
  </section>
</template>
