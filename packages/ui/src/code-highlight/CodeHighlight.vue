<script setup lang="ts">
import {
  CodeHighlightFoundation,
  type CodeHighlightAdapter,
  type CodeHighlightFoundationProps,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useTemplateRef,
  watch,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import type { CodeHighlightProps } from './types';

defineOptions({ name: 'CodeHighlight', inheritAttrs: false });
const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, required: true },
  lineNumber: { type: Boolean, default: undefined },
  defaultTheme: { type: Boolean, default: undefined },
  class: { type: null as unknown as PropType<CodeHighlightProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<CodeHighlightProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<CodeHighlightProps['style']>, default: undefined },
});
const attrs = useAttrs();
const instance = getCurrentInstance();
const codeElement = useTemplateRef<HTMLElement>('code');

function hasRawProp(name: 'defaultTheme' | 'lineNumber'): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function resolveBoolean(name: 'defaultTheme' | 'lineNumber'): boolean {
  if (hasRawProp(name) && props[name] !== undefined) return props[name];
  const globalValue = semiGlobal.config.overrideDefaultProps?.CodeHighlight?.[name];
  return typeof globalValue === 'boolean' ? globalValue : true;
}

const runtimeDefaultTheme = computed(() => resolveBoolean('defaultTheme'));
const runtimeLineNumber = computed(() => resolveBoolean('lineNumber'));
const rootClasses = computed(() => [
  'semi-codeHighlight',
  'semi-light-scrollbar',
  { 'semi-codeHighlight-defaultTheme': runtimeDefaultTheme.value },
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

const foundationProps = computed<CodeHighlightFoundationProps>(() => ({
  code: props.code,
  language: props.language,
  lineNumber: runtimeLineNumber.value,
}));
const adapter: CodeHighlightAdapter = {
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
};
const foundation = markRaw(new CodeHighlightFoundation(adapter));

function highlight(): void {
  if (codeElement.value) foundation.highlightCode(codeElement.value, props.language);
}

onMounted(highlight);
watch(() => props.code, highlight, { flush: 'post' });
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div v-bind="dataAttrs" :class="rootClasses" :style="rootStyle">
    <pre><code ref="code">{{ props.code }}</code></pre>
  </div>
</template>
