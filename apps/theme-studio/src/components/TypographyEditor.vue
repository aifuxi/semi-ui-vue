<script setup lang="ts">
import { InputNumber, Select } from '@aifuxi/semi-ui-vue';
import { baselineFont, type TypographySettings } from '../studio';
import { dieluUiFont } from '../dielu-foreground-preset';

/** 编辑公开排版变量；迭鹿预设字体随本应用部署，其他字体由本机提供。 */
defineProps<{ value: TypographySettings; label: string }>();
/** 排版编辑只发出修改字段，由会话所有者统一应用。 */
const emit = defineEmits<{ change: [value: Partial<TypographySettings>] }>();
/** 本机回退和已本地打包的迭鹿字体都不请求外部字体 CDN。 */
const fonts = [
  { label: 'Semi 默认字体栈', value: baselineFont },
  { label: '迭鹿 / Space Grotesk', value: dieluUiFont },
  { label: '宋体 / Serif', value: 'Georgia, "Songti SC", serif' },
  { label: '等宽 / Monospace', value: 'Menlo, Consolas, monospace' },
];
/** InputNumber 清空时保留上次有效主题；编辑完成后的有效数值才进入 CSS。 */
function updateNumber(key: keyof Omit<TypographySettings, 'family'>, value: number | string): void {
  if (typeof value === 'number' && Number.isFinite(value)) emit('change', { [key]: value });
}
/** 字体选择只来自固定选项，不加载任意外部字体。 */
function updateFamily(value: unknown): void {
  if (typeof value === 'string') emit('change', { family: value });
}
</script>

<template>
  <div class="typography-editor">
    <label
      ><span :id="`${label}-font-label`">{{ label }}字体</span
      ><Select
        :value="value.family"
        :aria-labelledby="`${label}-font-label`"
        :option-list="fonts"
        :motion="false"
        @change="updateFamily"
    /></label>
    <!-- 编辑范围用于保持预览可操作，单位均为 px；正文和标题的行高独立。 -->
    <div class="field-grid">
      <label
        >正文字号<InputNumber
          :value="value.size"
          :aria-label="`${label}正文字号`"
          :min="10"
          :max="32"
          @change="updateNumber('size', $event)"
      /></label>
      <label
        >正文行高<InputNumber
          :value="value.lineHeight"
          :aria-label="`${label}正文行高`"
          :min="12"
          :max="64"
          @change="updateNumber('lineHeight', $event)"
      /></label>
      <label
        >常规字重<InputNumber
          :value="value.weight"
          :aria-label="`${label}常规字重`"
          :min="100"
          :max="900"
          :step="100"
          @change="updateNumber('weight', $event)"
      /></label>
      <label
        >强调字重<InputNumber
          :value="value.strong"
          :aria-label="`${label}强调字重`"
          :min="100"
          :max="900"
          :step="100"
          @change="updateNumber('strong', $event)"
      /></label>
      <label
        >标题字号<InputNumber
          :value="value.titleSize"
          :aria-label="`${label}标题字号`"
          :min="12"
          :max="48"
          @change="updateNumber('titleSize', $event)"
      /></label>
      <label
        >标题行高<InputNumber
          :value="value.titleLineHeight"
          :aria-label="`${label}标题行高`"
          :min="16"
          :max="72"
          @change="updateNumber('titleLineHeight', $event)"
      /></label>
    </div>
    <p class="field-help">字号、行高为 px。控件高度继续使用组件尺寸 API。</p>
  </div>
</template>
