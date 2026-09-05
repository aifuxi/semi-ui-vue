<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { useRoute } from '#imports';
import type { DocHeading } from '../../data/docs';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

const props = defineProps<{ headings: DocHeading[] }>();
const route = useRoute();
const { locale } = useDocsPreferences();
const active = shallowRef('');
const links = computed(() =>
  props.headings.flatMap((heading) => [heading, ...(heading.children ?? [])]),
);
let frame = 0;
function update() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    let candidate = links.value[0]?.id ?? '';
    for (const link of links.value) {
      const element = document.getElementById(link.id);
      if (element && element.getBoundingClientRect().top <= 120) candidate = link.id;
    }
    active.value = candidate;
  });
}
onMounted(() => {
  window.addEventListener('scroll', update, { passive: true });
  update();
});
onUnmounted(() => {
  window.removeEventListener('scroll', update);
  cancelAnimationFrame(frame);
});
</script>

<template>
  <nav
    v-if="links.length"
    class="category-anchor"
    :aria-label="locale === 'zh-CN' ? '本页目录' : 'On this page'"
  >
    <ul>
      <li v-for="link in links" :key="link.id" :class="{ nested: link.depth > 2 }">
        <a
          :href="`${route.path}#${encodeURIComponent(link.id)}`"
          :class="{ active: active === link.id }"
          :aria-current="active === link.id ? 'location' : undefined"
          >{{ link.text }}</a
        >
      </li>
    </ul>
  </nav>
</template>
