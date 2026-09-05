<script setup lang="ts">
import { computed } from 'vue';
import {
  createError,
  queryCollection,
  useAsyncData,
  useHead,
  useRoute,
  useSeoMeta,
} from '#imports';
import { canonicalPath, docPages } from '../data/docs';

const route = useRoute();
const path = canonicalPath(route.path);
const page = docPages.find((entry) => entry.path === path);
if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found' });
const { data: document } = await useAsyncData(`document:${path}`, () =>
  queryCollection('docs').path(path.replace(/\/$/, '')).first(),
);
if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Document not found' });
const headings = computed(() => document.value?.body.toc?.links ?? []);
const sibling = docPages.find(
  (entry) =>
    entry.locale !== page.locale && entry.slug === page.slug && entry.category === page.category,
);
useSeoMeta({
  title: `${page.englishTitle}${page.locale === 'zh-CN' ? ` ${page.title}` : ''} - Semi UI Vue`,
  description: page.description,
});
useHead({
  link: [
    { rel: 'canonical', href: `https://semi.fuxiaochen.com${page.path}` },
    {
      rel: 'alternate' as const,
      hreflang: page.locale,
      href: `https://semi.fuxiaochen.com${page.path}`,
    },
    ...(sibling
      ? [
          {
            rel: 'alternate' as const,
            hreflang: sibling.locale,
            href: `https://semi.fuxiaochen.com${sibling.path}`,
          },
        ]
      : []),
  ],
});
</script>

<template>
  <article class="article-wrapper">
    <DocumentTitle :page="page" />
    <PageTableOfContents :key="page.path" :headings="headings" />
    <div class="main-article">
      <ContentRenderer v-if="document" :value="document" class="markdown" />
      <PreviousNext :page="page" />
      <footer class="docs-footer">
        Semi UI Vue ·
        {{
          page.locale === 'zh-CN'
            ? '基于 Semi Design v2.102.0 的独立 Vue 实现'
            : 'An independent Vue implementation of Semi Design v2.102.0'
        }}
        · MIT
      </footer>
    </div>
  </article>
</template>
