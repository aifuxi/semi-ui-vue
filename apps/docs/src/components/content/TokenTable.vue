<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useAsyncData } from '#imports';
import { useDocsPreferences } from '../../composables/useDocsPreferences';
const props = defineProps<{ component?: string }>();
const { locale } = useDocsPreferences();
const filter = shallowRef('');
const { data } = await useAsyncData<Array<{ component: string; name: string; value: string }>>(
  `tokens:${props.component ?? 'all'}`,
  () =>
    import('../../data/tokens.json').then((module) =>
      module.default.filter((row) => !props.component || row.component === props.component),
    ),
);
const rows = computed(() =>
  (data.value ?? []).filter(
    (row) =>
      (!props.component || row.component === props.component) &&
      `${row.name} ${row.value}`.toLowerCase().includes(filter.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="token-table">
    <label
      >{{ locale === 'zh-CN' ? '搜索设计变量' : 'Search design tokens' }}
      <input v-model="filter" type="search"
    /></label>
    <table class="gatsby-table">
      <thead>
        <tr>
          <th>{{ locale === 'zh-CN' ? '变量' : 'Variable' }}</th>
          <th>{{ locale === 'zh-CN' ? '默认值' : 'Default' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="`${row.component}:${row.name}`">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>
            <code>{{ row.value }}</code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
