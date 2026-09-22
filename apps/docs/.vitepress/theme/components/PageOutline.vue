<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { useRoute } from 'vitepress';

interface Heading {
  level: number;
  title: string;
  slug: string;
  link: string;
  children?: Heading[];
}

const props = defineProps<{ headings: Heading[] }>();
const route = useRoute();
const active = shallowRef('');
const tree = computed(() => props.headings);

function flatten(headings: Heading[]): Heading[] {
  return headings.flatMap((heading) => [heading, ...flatten(heading.children ?? [])]);
}

const links = computed(() => flatten(tree.value));

let frame = 0;
function update(): void {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    let candidate = links.value[0]?.slug ?? '';
    for (const link of links.value) {
      const element = document.getElementById(link.slug);
      if (element && element.getBoundingClientRect().top <= 120) candidate = link.slug;
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
  <nav v-if="links.length" class="pageAnchor category-anchor" aria-label="本页目录">
    <ul>
      <li v-for="link in links" :key="link.slug" :class="{ nested: link.level > 2 }">
        <a
          :href="`${route.path.split('#')[0]}#${link.slug}`"
          :class="{ active: active === link.slug }"
          :aria-current="active === link.slug ? 'location' : undefined"
          >{{ link.title }}</a
        >
      </li>
    </ul>
  </nav>
</template>
