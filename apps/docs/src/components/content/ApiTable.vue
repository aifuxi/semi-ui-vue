<script setup lang="ts">
import { computed } from 'vue';
import { useAsyncData } from '#imports';
import type { ApiSection } from '../../data/api/types';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

const props = defineProps<{ slug: string }>();
const { locale } = useDocsPreferences();
const modules = import.meta.glob('../../data/api/*.ts');
const { data: sections } = await useAsyncData(`api:${props.slug}`, async () => {
  const loader = modules[`../../data/api/${props.slug}.ts`];
  if (!loader) throw new Error(`API metadata missing: ${props.slug}`);
  const data = (await loader()) as Record<string, unknown>;
  return Object.values(data).find(Array.isArray) as ApiSection[];
});
const labels = computed(() =>
  locale.value === 'zh-CN'
    ? ['名称', '说明', '类型', '默认值']
    : ['Name', 'Description', 'Type', 'Default'],
);
</script>

<template>
  <section v-for="section in sections" :key="section.id" :data-api-kind="section.kind">
    <h3 :id="section.id" class="gatsby-h3">{{ section.title[locale] }}</h3>
    <table class="gatsby-table">
      <thead>
        <tr>
          <th v-for="label in labels" :key="label">{{ label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in section.items" :key="item.name">
          <td>
            <code>{{ item.name }}</code>
          </td>
          <td>{{ item.description[locale] }}</td>
          <td>
            <code>{{ item.type }}</code>
          </td>
          <td>{{ item.defaultValue ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
