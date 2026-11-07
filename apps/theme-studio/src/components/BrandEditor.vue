<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, ColorPicker, Input, Select, type ColorValue } from '@aifuxi/semi-ui-vue';
import { createColorTheme } from '@aifuxi/semi-theme-default/colors';
import type { ThemeSettings } from '../studio';

/** 直接修改指定边界；文字输入在有效时才提交为主题。 */
const props = withDefaults(
  defineProps<{ theme: ThemeSettings; label: string; allowFixed?: boolean }>(),
  { allowFixed: true },
);
/** 有效编辑通过事件交给会话所有者应用，子面板不直接修改 props。 */
const emit = defineEmits<{ change: [value: Partial<ThemeSettings>] }>();
/** 草稿保留非法或尚未输入完整的 HEX，不静默修改颜色。 */
const draft = ref(props.theme.brand);
/** 错误只属于当前输入，不清空上一次有效主题。 */
const error = ref('');
/** 固定方案与真实品牌预设；不将算法蓝标记为 Semi 默认色。 */
const presets = [
  { label: '固定 Semi 基线', value: 'fixed' },
  { label: '算法蓝', value: '#0077fa' },
  { label: '紫罗兰', value: '#7c3aed' },
  { label: '橙色', value: '#e8590c' },
  { label: '青绿色', value: '#00a696' },
];
/** 选择器始终保留任意自定义色，避免和真实主题不一致。 */
const options = computed(() =>
  (presets.some(
    /** 已有预设无需再添加同色选项。 */
    (preset) => preset.value === props.theme.brand,
  )
    ? presets
    : [...presets, { label: `自定义 ${props.theme.brand}`, value: props.theme.brand }]
  ).filter(
    /** 嵌套局部主题只能自定义或关闭继承，不将祖先品牌载体误标为固定基线。 */
    (preset) => props.allowFixed || preset.value !== 'fixed',
  ),
);
/** ColorPicker 的公开静态方法提供完整受控颜色对象。 */
const pickerValue = computed(() => ColorPicker.colorStringToValue(props.theme.brand));
// 复原或其他面板切换品牌时同步草稿及反馈。
watch(
  /** 监听父级的合法品牌变更。 */
  () => props.theme.brand,
  syncDraft,
);
/** 将外部合法颜色同步到输入草稿。 */
function syncDraft(value: string): void {
  draft.value = value;
  error.value = '';
}
/** 在公开生成器边界校验输入；灰色、alpha 和非法 HEX 都明确反馈。 */
function apply(value: string): void {
  draft.value = value;
  try {
    /** 仅使用返回的规范化 HEX，不对无效颜色做隐式回退。 */
    const theme = createColorTheme({ brand: value });
    emit('change', { brand: theme.brand, fixed: false });
    error.value = '';
  } catch (cause) {
    if (!(cause instanceof TypeError || cause instanceof RangeError)) throw cause;
    error.value =
      cause instanceof RangeError
        ? '品牌色需要非零饱和度，请选择有色相的颜色。'
        : '请输入不透明的 #RGB 或 #RRGGBB。';
  }
}
/** 预设固定方案直接撤回颜色覆盖，其他选项通过同一校验入口提交。 */
function choose(value: unknown): void {
  if (value === 'fixed') {
    emit('change', { fixed: true });
    syncDraft(props.theme.brand);
  } else if (typeof value === 'string') apply(value);
}
/** 关闭 alpha 的颜色选择器仍通过公共边界校验无色相输入。 */
function pick(value: ColorValue): void {
  apply(value.hex);
}
</script>

<template>
  <div class="brand-editor">
    <label :id="`${label}-preset-label`" :for="`${label}-preset`">{{ label }}方案</label>
    <Select
      :id="`${label}-preset`"
      :aria-labelledby="`${label}-preset-label`"
      :value="theme.fixed ? 'fixed' : theme.brand"
      :option-list="options"
      :motion="false"
      @change="choose"
    />
    <label :for="`${label}-hex`">品牌 HEX</label>
    <div class="brand-input-row">
      <ColorPicker
        :value="pickerValue"
        :alpha="false"
        :eye-dropper="false"
        use-popover
        :popover-props="{ trigger: 'click', position: 'bottomLeft', showArrow: false }"
        @change="pick"
      >
        <Button :aria-label="`${label}颜色选择器`" class="color-trigger"
          ><span :style="{ background: theme.brand }"
        /></Button>
      </ColorPicker>
      <Input
        :id="`${label}-hex`"
        :aria-label="`${label}品牌 HEX`"
        :value="draft"
        :validate-status="error ? 'error' : 'default'"
        :aria-describedby="error ? `${label}-error` : undefined"
        @change="apply"
      />
    </div>
    <p v-if="error" :id="`${label}-error`" class="field-error" role="alert">{{ error }}</p>
    <p v-else class="field-help">
      {{
        theme.fixed ? '使用固定 Semi v2.102.0 默认色盘。' : 'primary、link 与 focus 随品牌更新。'
      }}
    </p>
  </div>
</template>
