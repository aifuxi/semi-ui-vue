<script setup lang="ts">
import { computed } from 'vue';

import NavItem from './NavItem';
import SubNav from './SubNav.vue';
import type { NavigationItemInput, NavigationItemObject, SubNavProps } from './types';

defineOptions({ name: 'NavigationItemTree', inheritAttrs: false });
const props = defineProps<{
  item: NavigationItemObject;
  level: number;
}>();

function normalize(item: NavigationItemInput): NavigationItemObject {
  return typeof item === 'string' ? { itemKey: item, text: item } : { ...item };
}

const children = computed(() =>
  Array.isArray(props.item.items) ? props.item.items.map(normalize) : [],
);
const bindings = computed<SubNavProps>(() => {
  const output = { ...props.item, level: props.level };
  delete output.items;
  return output as SubNavProps;
});
</script>

<template>
  <SubNav v-if="children.length" v-bind="bindings">
    <NavigationItemTree
      v-for="(child, index) in children"
      :key="child.itemKey ?? `${props.level + 1}-${index}`"
      :item="child"
      :level="props.level + 1"
    />
  </SubNav>
  <NavItem v-else v-bind="bindings" />
</template>
