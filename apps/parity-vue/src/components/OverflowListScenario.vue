<script setup lang="ts">
import { OverflowList } from '@aifuxi/semi-ui-vue/overflow-list';

const items = [
  { key: 'alarm', label: 'Alarm' },
  { key: 'bookmark', label: 'Bookmark' },
  { key: 'camera', label: 'Camera' },
  { key: 'duration', label: 'Duration' },
  { key: 'folder', label: 'Folder' },
];
</script>

<template>
  <div class="overflow-list-scenario" data-testid="overflow-list-vue">
    <section data-parity-target="overflow-list-end">
      <OverflowList :items="items">
        <template #visibleItem="{ item }"
          ><span class="overflow-list-scenario__item">{{ item.label }}</span></template
        >
        <template #overflow="{ items: hidden }"
          ><span class="overflow-list-scenario__overflow">+{{ hidden.length }}</span></template
        >
      </OverflowList>
    </section>
    <section data-parity-target="overflow-list-start">
      <OverflowList :items="items" collapse-from="start" :min-visible-items="2">
        <template #visibleItem="{ item }"
          ><span class="overflow-list-scenario__item">{{ item.label }}</span></template
        >
        <template #overflow="{ items: hidden }"
          ><span class="overflow-list-scenario__overflow">+{{ hidden.length }}</span></template
        >
      </OverflowList>
    </section>
    <section data-parity-target="overflow-list-scroll">
      <OverflowList :items="items" render-mode="scroll">
        <template #visibleItem="{ item }"
          ><span class="overflow-list-scenario__scroll-item">{{ item.label }}</span></template
        >
        <template #overflow="{ items: hidden, position }"
          ><span
            v-if="hidden.length"
            class="overflow-list-scenario__edge"
            :data-position="position"
            >{{ hidden.length }}</span
          ></template
        >
      </OverflowList>
    </section>
  </div>
</template>
