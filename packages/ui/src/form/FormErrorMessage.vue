<script setup lang="ts">
import { IconAlertCircle, IconAlertTriangle } from '@aifuxi/semi-icons-vue';
import { computed, isVNode, type PropType } from 'vue';

import FormNodeRenderer from './FormNodeRenderer';
import type { FormErrorMessageProps } from './types';

defineOptions({ name: 'FormErrorMessage' });

// 错误与帮助文案是 ReactNode/VNode 数据，必须原样保留；Boolean 运行时类型会把空字符串转换为 true。
const props = defineProps({
  className: {
    type: null as unknown as PropType<FormErrorMessageProps['className']>,
    default: undefined,
  },
  error: { type: null as unknown as PropType<FormErrorMessageProps['error']>, default: undefined },
  errorMessageId: { type: String, default: undefined },
  helpText: {
    type: null as unknown as PropType<FormErrorMessageProps['helpText']>,
    default: undefined,
  },
  helpTextId: { type: String, default: undefined },
  isInInputGroup: { type: Boolean, default: undefined },
  showValidateIcon: { type: Boolean, default: undefined },
  style: { type: Object as PropType<FormErrorMessageProps['style']>, default: undefined },
  validateStatus: {
    type: String as PropType<FormErrorMessageProps['validateStatus']>,
    default: undefined,
  },
});
// 外层错误状态沿用 React truthiness，与是否有可渲染内容分别判断。
const hasError = computed(() => Boolean(props.error));
// 有错误时优先使用错误值，只有无错误时才采用帮助文案。
const displayValue = computed(() => (hasError.value ? props.error : props.helpText));
// 隐藏文本错误和无有效内容的错误数组不产生占位，避免空图标误报。
const shouldRender = computed(() => {
  if (props.error === '' && props.validateStatus === 'error') return false;
  if (Array.isArray(props.error) && !props.error.some(Boolean) && !props.helpText) return false;
  return Boolean(props.error) || Boolean(props.helpText);
});
// 与上游 generatorText 保持一致：数组过滤空项，布尔和数字只保留外层错误状态，不生成文本。
const text = computed(() => {
  // 错误优先于帮助文案，避免 truthy 布尔错误退回显示帮助状态。
  const value = displayValue.value;
  if (Array.isArray(value)) {
    // 保留 React 的数组错误合并格式，空数组不生成可渲染文本。
    const entries = value.filter(Boolean);
    return entries.length ? entries.join(', ') : undefined;
  }
  if (typeof value === 'string') return value;
  return undefined;
});
// 可访问性关联始终跟随当前显示的错误或帮助内容。
const contentId = computed(() => (hasError.value ? props.errorMessageId : props.helpTextId));
</script>

<template>
  <div
    v-if="shouldRender"
    :class="[
      hasError ? 'semi-form-field-error-message' : undefined,
      props.helpText ? 'semi-form-field-help-text' : undefined,
      props.className,
    ]"
    :style="props.style"
  >
    <!-- 上游依据可渲染内容决定图标；显式 true 或数字错误不能凭空产生红色图标。 -->
    <template v-if="props.showValidateIcon && (text !== undefined || isVNode(displayValue))">
      <IconAlertCircle
        v-if="props.isInInputGroup || props.validateStatus === 'error'"
        class="semi-form-field-validate-status-icon"
      />
      <IconAlertTriangle
        v-else-if="props.validateStatus === 'warning'"
        class="semi-form-field-validate-status-icon"
      />
    </template>
    <span v-if="text !== undefined" :id="contentId">{{ text }}</span>
    <FormNodeRenderer v-else-if="isVNode(displayValue)" :content="displayValue" />
  </div>
</template>
