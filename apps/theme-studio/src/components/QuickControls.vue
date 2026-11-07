<script setup lang="ts">
import { InputNumber, Select, Switch } from '@aifuxi/semi-ui-vue';
import type { ThemeSettings } from '../studio';

/** 在 Modal 中直接更新源主题，验证默认 Portal 打开时的动态同步。 */
defineProps<{ theme: ThemeSettings }>();
/** 默认弹层中的编辑交回源主题所有者。 */
const emit = defineEmits<{ change: [value: Partial<ThemeSettings>] }>();
/** 快速切换只提供合法品牌；任意 HEX 在主编辑区输入。 */
const brands = [
  { label: '算法蓝', value: '#0077fa' },
  { label: '紫罗兰', value: '#7c3aed' },
  { label: '橙色', value: '#e8590c' },
  { label: '青绿色', value: '#00a696' },
];
/** 数值清空不写入无效 CSS，其余排版字段保持原值。 */
function updateSize(value: number | string, theme: ThemeSettings): void {
  if (typeof value === 'number' && Number.isFinite(value))
    emit('change', { typography: { ...theme.typography, size: value } });
}
</script>

<template>
  <div class="quick-controls">
    <label
      >深色模式<Switch
        :checked="theme.mode === 'dark'"
        aria-label="弹窗深色模式"
        @change="emit('change', { mode: $event ? 'dark' : 'light' })"
    /></label>
    <label
      ><span id="popup-brand-label">弹窗品牌预设</span
      ><Select
        :value="theme.fixed ? undefined : theme.brand"
        aria-labelledby="popup-brand-label"
        :option-list="brands"
        :motion="false"
        placeholder="选择品牌"
        @change="emit('change', { brand: String($event), fixed: false })"
    /></label>
    <label
      >正文字号<InputNumber
        :value="theme.typography.size"
        aria-label="弹窗正文字号"
        :min="10"
        :max="32"
        @change="updateSize($event, theme)"
    /></label>
  </div>
</template>
