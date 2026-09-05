<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { useRoute } from '#imports';
import { useDocsPreferences } from '../composables/useDocsPreferences';

const route = useRoute();
const { locale } = useDocsPreferences();
const navigationOpen = shallowRef(false);
const searchOpen = shallowRef(false);
watch(
  () => route.path,
  () => {
    navigationOpen.value = false;
    searchOpen.value = false;
  },
);
</script>

<template>
  <a class="skip-link" href="#main-content">{{
    locale === 'zh-CN' ? '跳转到主内容' : 'Skip to content'
  }}</a>
  <SiteHeader @menu="navigationOpen = !navigationOpen" @search="searchOpen = true" />
  <SidebarNavigation :open="navigationOpen" @close="navigationOpen = false" />
  <main id="main-content" class="content-area" tabindex="-1"><slot /></main>
  <SearchDialog v-model:open="searchOpen" />
</template>
