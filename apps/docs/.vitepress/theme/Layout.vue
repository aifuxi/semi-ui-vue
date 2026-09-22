<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Content, useData, useRoute } from 'vitepress';
import SiteHeader from './components/SiteHeader.vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import SearchDialog from './components/SearchDialog.vue';
import PageOutline from './components/PageOutline.vue';
import PrevNext from './components/PrevNext.vue';
import SourceNote from './components/SourceNote.vue';
import {
  categoryOf,
  findNavPage,
  normalizeRoute,
  splitPageTitle,
} from './composables/use-docs-data';

const route = useRoute();
const { frontmatter, page } = useData();

const navigationOpen = ref(false);
const searchOpen = ref(false);

const routePath = computed(() => normalizeRoute(route.path));
const isHome = computed(() => routePath.value === '/');
const navPage = computed(() => findNavPage(routePath.value));
const category = computed(() => categoryOf(routePath.value));
const titleParts = computed(() =>
  splitPageTitle(String(frontmatter.value.title ?? navPage.value?.title ?? page.value.title ?? '')),
);
const description = computed(() => String(frontmatter.value.description ?? ''));
const headings = computed(() => page.value.headers ?? []);

watch(routePath, () => {
  navigationOpen.value = false;
});
</script>

<template>
  <div class="docs-layout">
    <a class="skip-to-content-link" href="#main-content">跳转到主内容</a>
    <SiteHeader @menu="navigationOpen = true" @search="searchOpen = true" />
    <SidebarNavigation
      v-if="!isHome"
      :open="navigationOpen"
      :path="routePath"
      @close="navigationOpen = false"
    />
    <div id="main-content" class="content-area" :class="{ 'content-area-home': isHome }">
      <div class="article-wrapper" :class="{ 'article-wrapper-home': isHome }">
        <template v-if="isHome">
          <div class="markdown docs-home"><Content /></div>
        </template>
        <template v-else>
          <PageOutline :headings="headings" />
          <div class="title-area">
            <div>
              <div class="header-tinyTitle">
                {{ category?.label }} · {{ titleParts.englishTitle }}
              </div>
              <div class="header-title">{{ titleParts.chineseTitle }}</div>
              <div v-if="description" class="article-brief">{{ description }}</div>
            </div>
          </div>
          <div class="main-article">
            <div class="markdown"><Content /></div>
            <SourceNote :path="routePath" />
            <PrevNext :path="routePath" />
          </div>
        </template>
      </div>
    </div>
    <SearchDialog v-model:open="searchOpen" />
  </div>
</template>
