<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { withBase, useRouter } from 'vitepress';
import {
  Nav,
  NavItem,
  SubNav,
  type ItemKey,
  type NavigationOpenChangeData,
} from '@aifuxi/semi-ui-vue/navigation';
import { docsNav, iconUrl, normalizeRoute } from '../composables/use-docs-data';

const props = defineProps<{ open: boolean; path: string }>();
defineEmits<{ close: [] }>();

const router = useRouter();
const openKeys = shallowRef<ItemKey[]>(docsNav.categories.map((category) => category.id));
const selectedKeys = computed(() => [normalizeRoute(props.path)]);

function onOpenChange(data: NavigationOpenChangeData): void {
  openKeys.value = [...data.openKeys];
}

function onNavigate(event: MouseEvent, path: string): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
    return;
  event.preventDefault();
  void router.go(withBase(path));
}
</script>

<template>
  <button
    v-if="open"
    class="navigation-backdrop"
    type="button"
    aria-label="关闭导航"
    @click="$emit('close')"
  />
  <aside id="side-nav" class="side-nav" :class="{ show: open }" aria-label="文档导航">
    <Nav
      style="width: 100%; height: 100%; min-width: 240px; max-width: 280px"
      body-style="height: 100%"
      :selected-keys="selectedKeys"
      :open-keys="openKeys"
      :sub-nav-motion="false"
      @open-change="onOpenChange"
    >
      <SubNav
        v-for="category in docsNav.categories"
        :key="category.id"
        :item-key="category.id"
        :text="category.label"
        :max-height="2500"
      >
        <a
          v-for="page in category.pages"
          :key="page.path"
          class="docs-nav-link"
          :href="withBase(page.path)"
          @click="onNavigate($event, page.path)"
        >
          <NavItem :item-key="page.path" :tab-index="-1" :indent="true" :text="page.title">
            <template v-if="iconUrl(page.icon)" #icon>
              <img class="docs-nav-icon" :src="withBase(iconUrl(page.icon)!)" alt="" />
            </template>
          </NavItem>
        </a>
      </SubNav>
    </Nav>
  </aside>
</template>
