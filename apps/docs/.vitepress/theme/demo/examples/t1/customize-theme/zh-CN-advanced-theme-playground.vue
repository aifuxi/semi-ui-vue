<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { Button, Input, Modal, Select, Tag, Tooltip, Typography } from '@aifuxi/semi-ui-vue';
import {
  colorThemeToCss,
  createColorTheme,
  type ColorMode,
} from '@aifuxi/semi-theme-default/colors';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/tooltip.css';
import '@aifuxi/semi-theme-default/modal.css';

/** 预设包括真实固定基线；选择基线时不调用生成器重建默认颜色。 */
const brands = [
  { label: '紫罗兰', value: '#7c3aed' },
  { label: '橙色', value: '#e8590c' },
  { label: '青绿色', value: '#00a696' },
  { label: '固定 Semi 基线', value: 'baseline' },
];
/** 默认只为示例预览区启用紫罗兰品牌，站点本身不改变。 */
const brand = ref('#7c3aed');
/** 示例显式指定模式，不写入 body 或站点主题偏好。 */
const mode = ref<ColorMode>('light');
/** 与固定 Semi 相同的默认字体栈，独立局部边界和方案复原共用。 */
const baselineFontFamily =
  '"Inter", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';
/** 两档排版用普通 CSS 变量演示，不修改组件尺寸。 */
const typography = ref('baseline');
/** 独立局部主题可以关闭，用于直观看到正常继承。 */
const localEnabled = ref(true);
/** 声明式弹窗保留在主主题边界内，默认 Portal 自动桥接。 */
const modalVisible = ref(false);
/** 初始与切换后的色盘均通过真实公开 API 生成；不在示例中重写算法。 */
const themes = Object.fromEntries(
  brands
    .filter(
      /** 基线由已有编译 CSS 提供。 */
      (item) => item.value !== 'baseline',
    )
    .map(
      /** 每个品牌同时保存深浅模式，切换时直接选择标准 CSS。 */
      (item) => [item.value, createColorTheme({ brand: item.value })],
    ),
);
/** 品牌切换使用主题观察器识别的 class；所有选择器都限制在命名示例边界，Portal 通过库的主题桥接消费相同变量。 */
const themeCss = [
  ...Object.entries(themes).map(
    /** 为主预览的每个品牌输出显式 light/dark 选择器。 */
    ([color, theme]) =>
      colorThemeToCss(theme, {
        selectors: {
          light: `[data-semi-theme="docs-brand"].theme-brand-${color.slice(1)}[theme-mode="light"]`,
          dark: `[data-semi-theme="docs-brand"].theme-brand-${color.slice(1)}[theme-mode="dark"]`,
        },
      }),
  ),
  colorThemeToCss(themes['#00a696']!, {
    selectors: {
      light: '[data-semi-theme="docs-local"][theme-mode="light"]',
      dark: '[data-semi-theme="docs-local"][theme-mode="dark"]',
    },
  }),
].join('\n');
/** 原生 style 是 raw-text 元素，SSR 必须保留生成 CSS 的引号而非 HTML 转义。
 * 内容仅来自上面固定品牌的公开生成器，不接受外部 HTML。
 */
function ThemeStyles() {
  return h('style', { innerHTML: themeCss });
}

/** 舒适排版采用 16/26 的正文和 700 强调字重，标题独立设为 24/34。 */
const typographyStyle = computed(
  /** 直接覆盖公开变量；固定方案显式恢复基线，避免继承站点正文的样式。 */
  () =>
    typography.value === 'comfortable'
      ? {
          '--semi-font-family-regular': 'Georgia, "Songti SC", serif',
          '--semi-font-size-regular': '16px',
          '--semi-line-height-regular': '26px',
          '--semi-font-weight-strong': '700',
          '--semi-font-size-header-4': '24px',
          '--semi-line-height-header-4': '34px',
        }
      : {
          '--semi-font-family-regular': baselineFontFamily,
          '--semi-font-size-regular': '14px',
          '--semi-line-height-regular': '20px',
          '--semi-font-weight-strong': '600',
          '--semi-font-size-header-4': '20px',
          '--semi-line-height-header-4': '28px',
        },
);
/** 局部主题独立声明排版；关闭边界时连同变量一并撤回以恢复继承。 */
const localTypography = {
  '--semi-font-family-regular': baselineFontFamily,
  '--semi-font-size-regular': '14px',
  '--semi-line-height-regular': '20px',
  '--semi-font-weight-strong': '600',
};
/** 标明当前真实品牌颜色，便于对照深浅校准后的第 5 级色阶。 */
const currentScale = computed(
  /** 固定基线没有生成色盘，避免把算法输出误标为默认主题。 */
  () => (brand.value === 'baseline' ? null : themes[brand.value]!.palette[mode.value].brand),
);
/** 表单选项仅体现控件对主题的消费，业务值不参与主题算法。 */
const choice = ref('workspace');
/** 两个示例选项足以展示默认下拉框的颜色与排版继承。 */
const options = [
  { label: '团队工作区', value: 'workspace' },
  { label: '个人工作区', value: 'personal' },
];

/** 显示默认挂到 body 的声明式弹窗。 */
function openModal(): void {
  modalVisible.value = true;
}

/** 关闭后保留主预览的当前主题选择。 */
function closeModal(): void {
  modalVisible.value = false;
}
</script>

<template>
  <div class="theme-playground" data-testid="theme-playground">
    <!-- 生成的是普通 CSS；style 元素随本示例挂载与卸载，不污染全局模式。 -->
    <ThemeStyles />
    <div class="theme-controls" role="group" aria-label="主题设置">
      <label
        >品牌颜色
        <select v-model="brand" aria-label="品牌颜色">
          <option v-for="item in brands" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </label>
      <label
        >示例模式
        <select v-model="mode" aria-label="示例模式">
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </label>
      <label
        >排版方案
        <select v-model="typography" aria-label="排版方案">
          <option value="baseline">固定 Semi 排版</option>
          <option value="comfortable">舒适阅读</option>
        </select>
      </label>
      <label class="theme-toggle"
        ><input v-model="localEnabled" type="checkbox" />启用局部主题</label
      >
    </div>
    <p class="theme-hint">设置仅在下方预览区生效，文档站保持当前主题。</p>
    <section
      class="theme-preview"
      :class="[
        mode === 'dark' ? 'semi-always-dark' : 'semi-always-light',
        brand === 'baseline' ? undefined : `theme-brand-${brand.slice(1)}`,
      ]"
      data-testid="theme-preview"
      data-semi-theme="docs-brand"
      :data-brand="brand"
      :theme-mode="mode"
      :style="typographyStyle"
      aria-label="主题预览"
    >
      <Typography.Title :heading="4" data-testid="theme-title"
        >为工作留出专注的空间</Typography.Title
      >
      <Typography.Text data-testid="theme-text"
        >统一的字体、字号与行高，让按钮、表单和正文自然协调。</Typography.Text
      >
      <div class="theme-actions">
        <Button theme="solid" data-testid="theme-primary">创建工作区</Button>
        <Button>了解更多</Button>
        <Tag color="blue" type="solid">独立信息蓝</Tag>
      </div>
      <div class="theme-fields">
        <Input aria-label="主题输入框" placeholder="输入工作区名称" />
        <Select v-model="choice" :option-list="options" :motion="false" />
      </div>
      <div class="theme-actions">
        <Tooltip trigger="click" :motion="false" :close-on-esc="true">
          <Button>查看主题提示</Button>
          <template #content
            ><Typography.Text link data-testid="theme-tooltip-link"
              >提示中的品牌链接</Typography.Text
            ></template
          >
        </Tooltip>
        <Button @click="openModal">打开主题弹窗</Button>
      </div>
      <div v-if="currentScale" class="theme-scale" aria-label="当前品牌十级色阶">
        <div v-for="(color, index) in currentScale" :key="index" class="theme-swatch">
          <span :style="{ backgroundColor: color }" :title="color" />
          <small>{{ index }}</small>
        </div>
      </div>
      <Typography.Text v-if="currentScale" size="small"
        >当前主色 {{ currentScale[5] }}</Typography.Text
      >
      <Typography.Text v-else size="small"
        >当前使用固定 Semi 基线，未重新生成默认色盘。</Typography.Text
      >
      <section
        class="theme-local"
        :class="localEnabled ? 'semi-always-dark' : undefined"
        data-testid="theme-local"
        :data-semi-theme="localEnabled ? 'docs-local' : undefined"
        :theme-mode="localEnabled ? 'dark' : undefined"
        :style="localEnabled ? localTypography : undefined"
        aria-label="局部主题预览"
      >
        <Typography.Text strong>{{
          localEnabled ? '独立局部主题 · 青绿深色' : '局部主题已关闭 · 跟随外层'
        }}</Typography.Text>
        <Typography.Text>同一页面可以拥有独立的品牌颜色和排版。</Typography.Text>
        <Button theme="solid" data-testid="theme-local-primary">局部操作</Button>
      </section>
      <Modal
        :visible="modalVisible"
        title="在弹窗中继续预览"
        :motion="false"
        @cancel="closeModal"
        @ok="closeModal"
      >
        <div class="theme-modal-controls">
          <label
            >弹窗品牌颜色
            <select v-model="brand" aria-label="弹窗品牌颜色">
              <option v-for="item in brands" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
          <label
            >弹窗模式
            <select v-model="mode" aria-label="弹窗模式">
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </label>
          <Typography.Text>弹层自动沿用打开位置的主题，并跟随设置更新。</Typography.Text>
          <Button theme="solid" data-testid="theme-modal-primary">继续创建</Button>
        </div>
      </Modal>
    </section>
    <aside class="theme-baseline semi-always-light" aria-label="固定基线对照">
      <span>固定 Semi · 浅色对照</span>
      <Button theme="solid" data-testid="theme-baseline-primary">默认主色</Button>
    </aside>
  </div>
</template>

<style scoped>
.theme-playground {
  min-width: 0;
}
.theme-controls,
.theme-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.theme-controls label,
.theme-modal-controls label {
  display: grid;
  gap: 6px;
  min-width: 0;
  font-size: 13px;
  color: var(--semi-color-text-1);
}
.theme-controls select,
.theme-modal-controls select {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid var(--semi-color-border);
  border-radius: 6px;
  color: var(--semi-color-text-0);
  background: var(--semi-color-bg-0);
  font: inherit;
}
.theme-controls .theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}
.theme-hint {
  margin: 12px 0;
  color: var(--semi-color-text-2);
  font-size: 13px;
}
.theme-preview,
.theme-local {
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--semi-color-border);
  border-radius: 12px;
  color: var(--semi-color-text-0);
  background: var(--semi-color-bg-0);
}
.theme-preview :deep(.semi-typography) {
  margin: 0;
}
.theme-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.theme-scale {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 3px;
}
.theme-swatch {
  display: grid;
  gap: 4px;
  text-align: center;
  font: 11px/16px sans-serif;
}
.theme-swatch span {
  height: 26px;
  border: 1px solid var(--semi-color-border);
  border-radius: 3px;
}
.theme-local {
  gap: 12px;
  padding: 16px;
}
.theme-local .semi-button {
  justify-self: start;
}
.theme-modal-controls {
  display: grid;
  gap: 16px;
}
.theme-baseline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--semi-color-border);
  border-radius: 8px;
  color: var(--semi-color-text-1);
  background: var(--semi-color-bg-0);
  font: 13px/20px sans-serif;
}
@media (max-width: 600px) {
  .theme-controls,
  .theme-fields {
    grid-template-columns: minmax(0, 1fr);
  }
  .theme-preview {
    padding: 14px;
  }
}
</style>
