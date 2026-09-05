<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
  Nav,
  SubNav,
  NavItem,
  type ItemKey,
  type NavigationOpenChangeData,
} from '@aifuxi/semi-ui-vue/navigation';
import { useRoute } from '#imports';
import { categories, categoryLabel, docPages, canonicalPath } from '../../data/docs';
import { useDocsPreferences } from '../../composables/useDocsPreferences';

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();
const route = useRoute();
const { locale } = useDocsPreferences();
const openGroups = shallowRef<ItemKey[]>(categories.map(([id]) => id));
const groups = computed(() =>
  categories
    .map(([id]) => ({
      id,
      label: categoryLabel(id, locale.value),
      pages: docPages
        .filter(
          (page) =>
            page.locale === locale.value && page.category === id && page.navigation !== false,
        )
        .sort((a, b) => a.order - b.order),
    }))
    .filter((group) => group.pages.length),
);
function onOpenChange(data: NavigationOpenChangeData) {
  openGroups.value = data.openKeys;
}
</script>

<template>
  <button
    v-if="open"
    class="navigation-backdrop"
    type="button"
    :aria-label="locale === 'zh-CN' ? '关闭导航' : 'Close navigation'"
    @click="$emit('close')"
  />
  <aside
    id="side-nav"
    class="side-nav"
    :class="{ show: open }"
    :aria-label="locale === 'zh-CN' ? '文档导航' : 'Documentation navigation'"
  >
    <Nav
      :style="{ width: '100%', height: '100%', minWidth: 240, maxWidth: 280 }"
      :body-style="{ height: '100%' }"
      :selected-keys="[canonicalPath(route.path)]"
      :open-keys="openGroups"
      :sub-nav-motion="false"
      @open-change="onOpenChange"
    >
      <SubNav
        v-for="group in groups"
        :key="group.id"
        :item-key="group.id"
        :text="group.label"
        :max-height="2500"
      >
        <NuxtLink
          v-for="page in group.pages"
          :key="page.path"
          :to="page.path"
          :prefetch="false"
          :aria-current="canonicalPath(route.path) === page.path ? 'page' : undefined"
          @click="$emit('close')"
        >
          <NavItem
            :item-key="page.path"
            :tab-index="-1"
            :text="
              locale === 'zh-CN' && page.title !== page.englishTitle
                ? `${page.englishTitle} ${page.title}`
                : page.title
            "
          >
            <template #icon>
              <span class="semi-icon semi-icon-extra-large" aria-hidden="true">
                <img
                  v-if="page.icon"
                  :src="`/upstream/doc-icons/${page.icon}.svg`"
                  width="24"
                  height="24"
                  alt=""
                />
                <span v-else class="nav-icon">◇</span>
              </span>
            </template>
          </NavItem>
        </NuxtLink>
      </SubNav>
    </Nav>
  </aside>
</template>
