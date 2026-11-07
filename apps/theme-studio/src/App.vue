<script setup lang="ts">
import { onBeforeUnmount, provide, ref } from 'vue';
import { Button, Tag } from '@aifuxi/semi-ui-vue';
import {
  IconColorPalette,
  IconFont,
  IconLayers,
  IconRefresh,
  IconGridRectangle,
  IconEyeOpened,
} from '@aifuxi/semi-icons-vue';
import { createStudio, studioKey } from './studio';
import StudioEditor from './components/StudioEditor.vue';
import ThemePreview from './components/ThemePreview.vue';

/** 工作台会话属于此 App，独立于 docs 和浏览器全局主题。 */
const studio = createStudio();
provide(studioKey, studio);
/** Hash 路由避免静态托管要求服务端回退；三个入口可直接访问。 */
const route = ref(readRoute());
/** 已确认首期的三个独立应用入口。 */
const routes = [
  { value: 'tokens', label: '全局样式定制' },
  { value: 'components', label: '组件样式定制' },
  { value: 'preview', label: '主题预览' },
];
/** 分类只展示首期实际可编辑能力，不制造未实现入口。 */
const categories = [
  { value: 'color', label: '品牌颜色', icon: IconColorPalette },
  { value: 'typography', label: '字体排版', icon: IconFont },
  { value: 'local', label: '局部主题', icon: IconLayers },
];
/** 非法路径回到全局编辑，入口不依赖 docs 路由。 */
function readRoute(): string {
  return ['tokens', 'components', 'preview'].includes(location.hash.slice(2))
    ? location.hash.slice(2)
    : 'tokens';
}
/** 浏览器前进/后退同步面板；预览子树随路由释放默认弹层。 */
function syncRoute(): void {
  route.value = readRoute();
}
/** 写入独立应用 hash，不更改文档页面。 */
function navigate(value: string): void {
  location.hash = `/${value}`;
}
window.addEventListener('hashchange', syncRoute);
// 组件卸载时移除应用路由订阅。
onBeforeUnmount(() => window.removeEventListener('hashchange', syncRoute));
</script>

<template>
  <div class="studio-shell">
    <header class="studio-header">
      <a class="studio-wordmark" href="#/tokens" aria-label="AIFUXI Theme Studio 首页"
        ><IconColorPalette size="extra-large" /><span>AIFUXI <strong>Theme Studio</strong></span></a
      >
      <div class="header-actions">
        <Tag>本地编辑</Tag
        ><Button type="tertiary" aria-label="复原主题" @click="studio.reset"
          ><template #icon><IconRefresh /></template>复原主题</Button
        >
      </div>
    </header>
    <nav class="studio-tabs" aria-label="工作台导航">
      <Button
        v-for="item in routes"
        :key="item.value"
        type="tertiary"
        :class="{ active: route === item.value }"
        :aria-current="route === item.value ? 'page' : undefined"
        @click="navigate(item.value)"
        >{{ item.label }}</Button
      >
    </nav>
    <main class="studio-main" :class="{ 'preview-only': route === 'preview' }">
      <nav v-if="route === 'tokens'" class="category-rail" aria-label="设计变量分类">
        <span class="rail-label">设计变量</span
        ><Button
          v-for="category in categories"
          :key="category.value"
          type="tertiary"
          :aria-label="category.label"
          :class="{ active: studio.settings.category === category.value }"
          :aria-pressed="studio.settings.category === category.value"
          @click="studio.settings.category = category.value"
          ><template #icon><component :is="category.icon" /></template>{{ category.label }}</Button
        >
        <div class="rail-footnote">颜色与排版<br />实时作用于 Vue 组件</div>
      </nav>
      <nav v-else-if="route === 'components'" class="category-rail" aria-label="组件分类">
        <span class="rail-label">组件变量</span
        ><Button type="tertiary" class="active"
          ><template #icon><IconGridRectangle /></template>Button 按钮</Button
        >
        <div class="rail-footnote">组件排版覆盖<br />优先于共享排版</div>
      </nav>
      <StudioEditor v-if="route !== 'preview'" :key="studio.settings.revision" :route="route" />
      <section class="preview-workspace" aria-label="主题效果">
        <div class="workspace-heading">
          <div>
            <span class="eyebrow">THEME / LIVE PREVIEW</span>
            <h1>{{ route === 'preview' ? '主题效果总览' : '主题实时预览' }}</h1>
          </div>
          <IconEyeOpened size="large" />
        </div>
        <ThemePreview :key="route" />
      </section>
    </main>
    <footer class="studio-footer">
      <span>@aifuxi/semi-ui-vue · 固定 Semi v2.102.0 基线</span
      ><span>普通 CSS 变量 · 无需 Sass</span>
    </footer>
  </div>
</template>
