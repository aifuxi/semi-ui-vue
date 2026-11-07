<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref } from 'vue';
import { Button, Modal, Switch } from '@aifuxi/semi-ui-vue';
import {
  IconColorPalette,
  IconUndo,
  IconRedo,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconSave,
  IconLayers,
  IconGridRectangle,
  IconEyeOpened,
} from '@aifuxi/semi-icons-vue';
import { createStudio, studioKey } from './studio';
import { categories, components, globalTokens, componentTokens } from './token-catalog';
import StudioEditor from './components/StudioEditor.vue';
import ThemePreview from './components/ThemePreview.vue';
import TokenBrowser from './components/TokenBrowser.vue';

/** 一个页面拥有一个主题会话，不修改 body、文档站或其他应用。 */
const studio = createStudio();
provide(studioKey, studio);
/** 静态部署使用 hash 路由，浏览器前进后退可恢复工作区。 */
const route = ref(readRoute());
/** 工作台只包含样式设计和预览，不提供主题包发布入口。 */
const routes = [
  { value: 'tokens', label: '全局样式定制' },
  { value: 'components', label: '组件样式定制' },
  { value: 'preview', label: '主题预览' },
];
/** 预览场景使用实际 Vue 组件，无作者资料或无关业务介绍。 */
const scenes = [
  { value: 'overview', label: '组件总览' },
  { value: 'form', label: '数据表单' },
  { value: 'table', label: '数据表格' },
  { value: 'scopes', label: '局部主题对照' },
];
/** 预览场景不会重置主题编辑。 */
const scene = ref('overview');
/** 导出对话框展示明确的本地文件用途。 */
const exportVisible = ref(false);
/** 文件控件不读取文件之外的本地信息。 */
const fileInput = ref<HTMLInputElement>();
/** 当前模式的显式覆盖数与另一个模式分开计数。 */
const changes = computed(() => Object.keys(studio.overrides[studio.global.mode]).length);
/** 场景标题来自导航，不另造营销文字。 */
const previewTitle = computed(() =>
  route.value === 'components'
    ? components.find(
        /** 按组件 id 显示目录中文名称。 */
        (item) => item.value === studio.settings.component,
      )?.label
    : route.value === 'preview'
      ? '主题效果总览'
      : '实时预览',
);
/** 无效地址回到全局样式，不依赖服务器回退。 */
function readRoute(): string {
  return ['tokens', 'components', 'preview'].includes(location.hash.slice(2))
    ? location.hash.slice(2)
    : 'tokens';
}
/** 路由卸载预览时让默认浮层正常清理。 */
function syncRoute(): void {
  route.value = readRoute();
  window.scrollTo(0, 0);
}
/** 全局导航只修改本应用 hash。 */
function navigate(value: string): void {
  if (value === 'components') chooseComponent(studio.settings.component);
  location.hash = `/${value}`;
}
/** 各分类总数只计算一次，避免模板回调混入交互逻辑。 */
const categoryCounts = Object.fromEntries(
  categories.map(
    /** 目录中全局变量与组件属性分开计数。 */
    (category) => [
      category.value,
      globalTokens.filter(
        /** 按目录分类累加。 */
        (token) => token.category === category.value,
      ).length,
    ],
  ),
);
/** 切换分类同时选中该分类首项，并清除上个分类的搜索。 */
function chooseCategory(value: string): void {
  studio.settings.category = value;
  studio.selection.search = '';
  studio.selection.modifiedOnly = false;
  /** 优先使用真实目录中的默认代表变量。 */
  const first = globalTokens.find(
    /** 不将组件专属变量混入全局选择。 */
    (item) => item.category === value,
  );
  if (first) studio.selection.name = first.name;
}
/** 组件选择只影响编辑目标，其他组件的已有覆盖继续保留。 */
function chooseComponent(value: string): void {
  studio.settings.component = value;
  /** 首个可编辑属性由元数据目录决定。 */
  const first = componentTokens.find(
    /** 此处无硬编码 token 名称。 */
    (item) => item.component === value,
  );
  if (first) studio.selection.name = first.name;
}
/** 只读取用户明确选择的 JSON 文件，完整校验后才应用主题。 */
async function importFile(event: Event): Promise<void> {
  /** 每次导入后清空 file input，使同一文件可以再次导入。 */
  const input = event.target as HTMLInputElement;
  /** 用户取消选择时保留当前主题。 */
  const file = input.files?.[0];
  if (!file) return;
  try {
    studio.importJson(await file.text());
  } catch {
    studio.message.value = '无法读取文件，请重新选择 JSON。';
  }
  input.value = '';
}
/** 保留输入控件原生撤销，只有编辑器空白区域的快捷键操作主题历史。 */
function historyKey(event: KeyboardEvent): void {
  if (
    !(event.metaKey || event.ctrlKey) ||
    event.key.toLowerCase() !== 'z' ||
    (event.target instanceof Element &&
      event.target.closest('input, textarea, [contenteditable=true]'))
  )
    return;
  event.preventDefault();
  studio.moveHistory(event.shiftKey ? 1 : -1);
}
window.addEventListener('hashchange', syncRoute);
window.addEventListener('keydown', historyKey);
// 应用卸载后释放路由和快捷键监听。
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute);
  window.removeEventListener('keydown', historyKey);
});
/** 关闭导出面板，不改变当前主题。 */
function closeExport(): void {
  exportVisible.value = false;
}
/** 跳转到工作区焦点，不改写承担应用路由的 hash。 */
function focusWorkspace(): void {
  document.getElementById('studio-content')?.focus();
}
</script>

<template>
  <div class="studio-shell">
    <a class="skip-link" href="#studio-content" @click.prevent="focusWorkspace">跳转到样式工作区</a>
    <header class="studio-header">
      <a class="studio-wordmark" href="#/tokens" aria-label="Theme Studio 首页"
        ><IconColorPalette size="extra-large" /><strong>Theme Studio</strong></a
      >
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
      <div class="header-actions">
        <Button
          type="tertiary"
          aria-label="撤销修改"
          :disabled="!studio.canUndo.value"
          @click="studio.moveHistory(-1)"
          ><template #icon><IconUndo /></template></Button
        ><Button
          type="tertiary"
          aria-label="重做修改"
          :disabled="!studio.canRedo.value"
          @click="studio.moveHistory(1)"
          ><template #icon><IconRedo /></template></Button
        ><span class="toolbar-divider" /><Button
          type="tertiary"
          aria-label="复原主题"
          @click="studio.reset"
          ><template #icon><IconRefresh /></template></Button
        ><Button type="tertiary" aria-label="导入主题 JSON" @click="fileInput?.click()"
          ><template #icon><IconUpload /></template></Button
        ><Button aria-label="导出" @click="exportVisible = true"
          ><template #icon><IconDownload /></template>导出</Button
        ><Button theme="solid" aria-label="保存草稿" @click="studio.save"
          ><template #icon><IconSave /></template>保存草稿</Button
        >
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        class="file-input"
        aria-label="导入主题文件"
        @change="importFile"
      />
    </header>
    <main
      id="studio-content"
      tabindex="-1"
      class="studio-main"
      :class="{ 'preview-only': route === 'preview' }"
    >
      <nav
        class="category-rail"
        :aria-label="
          route === 'tokens' ? '设计变量分类' : route === 'components' ? '组件分类' : '预览场景'
        "
      >
        <template v-if="route === 'tokens'"
          ><span class="rail-label">全局样式</span
          ><Button
            v-for="category in categories"
            :key="category.value"
            type="tertiary"
            :class="{ active: studio.settings.category === category.value }"
            :aria-label="category.label"
            :aria-pressed="studio.settings.category === category.value"
            @click="chooseCategory(category.value)"
            >{{ category.label
            }}<span class="category-count">{{ categoryCounts[category.value] }}</span></Button
          >
          <div class="rail-separator" />
          <Button
            type="tertiary"
            aria-label="局部主题"
            :class="{ active: studio.settings.category === 'local' }"
            @click="chooseCategory('local')"
            ><template #icon><IconLayers /></template>局部主题</Button
          ></template
        >
        <template v-else-if="route === 'components'"
          ><span class="rail-label">组件样式</span
          ><Button
            v-for="item in components"
            :key="item.value"
            type="tertiary"
            :class="{ active: studio.settings.component === item.value }"
            :aria-pressed="studio.settings.component === item.value"
            @click="chooseComponent(item.value)"
            >{{ item.label }}</Button
          ></template
        >
        <template v-else
          ><span class="rail-label">预览场景</span
          ><Button
            v-for="item in scenes"
            :key="item.value"
            type="tertiary"
            :class="{ active: scene === item.value }"
            :aria-pressed="scene === item.value"
            @click="scene = item.value"
            >{{ item.label }}</Button
          ></template
        >
        <div class="rail-bottom">
          <Button type="tertiary" @click="studio.load">恢复已保存草稿</Button
          ><span>所有编辑均在本地进行</span>
        </div>
      </nav>
      <div class="studio-center">
        <div class="workspace-toolbar">
          <span
            ><component
              :is="
                route === 'components'
                  ? IconGridRectangle
                  : route === 'preview'
                    ? IconEyeOpened
                    : IconColorPalette
              "
            />{{
              route === 'tokens' ? '设计变量' : route === 'components' ? '组件预览' : '主题预览'
            }}</span
          >
          <div>
            <span class="change-count">{{ changes ? `${changes} 个变量已修改` : '默认变量' }}</span
            ><label class="mode-control"
              >深色<Switch
                :checked="studio.global.mode === 'dark'"
                aria-label="工作区深色模式"
                size="small"
                @change="studio.global.mode = $event ? 'dark' : 'light'"
            /></label>
          </div>
        </div>
        <TokenBrowser v-if="route === 'tokens' && studio.settings.category !== 'local'" />
        <section class="preview-workspace" aria-label="主题效果">
          <div class="workspace-heading">
            <h2 v-if="route === 'tokens'">{{ previewTitle }}</h2>
            <h1 v-else>{{ previewTitle }}</h1>
            <span>{{ studio.global.mode === 'dark' ? '深色' : '浅色' }}主题</span>
          </div>
          <ThemePreview
            :key="route"
            :scene="route === 'preview' ? scene : 'scopes'"
            :component="route === 'components' ? studio.settings.component : undefined"
          />
        </section>
      </div>
      <StudioEditor v-if="route !== 'preview'" :key="studio.settings.revision" :route="route" />
    </main>
    <div v-if="studio.message.value" class="studio-status" role="status">
      {{ studio.message.value }}
    </div>
    <Modal
      :visible="exportVisible"
      title="导出主题"
      :footer="null"
      :motion="false"
      width="min(520px, calc(100vw - 32px))"
      @cancel="closeExport"
      ><div class="export-options">
        <section>
          <h3>CSS 样式</h3>
          <p>导出深浅模式变量和组件覆盖，用于应用主题。</p>
          <Button theme="solid" @click="studio.download('css')">下载 CSS</Button>
        </section>
        <section>
          <h3>JSON 主题文件</h3>
          <p>保存全部编辑配置，可再次导入 Theme Studio。</p>
          <Button @click="studio.download('json')">下载 JSON</Button>
        </section>
      </div></Modal
    >
  </div>
</template>
