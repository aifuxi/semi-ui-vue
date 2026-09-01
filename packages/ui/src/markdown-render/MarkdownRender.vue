<script setup lang="ts">
import {
  evaluateMarkdownRender,
  type MarkdownRenderContent,
  type MarkdownRenderEvaluationOptions,
  type MarkdownRenderPluginList as FoundationMarkdownRenderPluginList,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toRaw,
  useAttrs,
  watch,
  type Component,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import { markdownRenderDefaultComponents } from './components';
import { markdownRenderRuntime } from './runtime';
import type { MarkdownRenderProps } from './types';

defineOptions({ name: 'MarkdownRender', inheritAttrs: false });
const props = defineProps({
  raw: { type: String, required: true },
  class: { type: null as unknown as PropType<MarkdownRenderProps['class']>, default: undefined },
  className: { type: String, default: undefined },
  components: {
    type: Object as PropType<MarkdownRenderProps['components']>,
    default: undefined,
  },
  format: { type: String as PropType<MarkdownRenderProps['format']>, default: undefined },
  rehypePlugins: {
    type: Array as unknown as PropType<unknown[]>,
    default: undefined,
  },
  remarkGfm: { type: Boolean, default: undefined },
  remarkPlugins: {
    type: Array as unknown as PropType<unknown[]>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<MarkdownRenderProps['style']>, default: undefined },
});

const attrs = useAttrs();
const instance = getCurrentInstance();
const contentComponent = shallowRef<Component | null>(null);
const mounted = shallowRef(false);
let revision = 0;

function hasRawProp(name: 'format' | 'remarkGfm'): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

const runtimeFormat = computed(() => {
  if (hasRawProp('format') && props.format) return props.format;
  const globalValue = semiGlobal.config.overrideDefaultProps?.MarkdownRender?.format;
  return globalValue === 'md' || globalValue === 'mdx' ? globalValue : 'mdx';
});
const runtimeRemarkGfm = computed(() => {
  if (hasRawProp('remarkGfm') && props.remarkGfm !== undefined) return props.remarkGfm;
  const globalValue = semiGlobal.config.overrideDefaultProps?.MarkdownRender?.remarkGfm;
  return typeof globalValue === 'boolean' ? globalValue : true;
});
const evaluationOptions = computed<MarkdownRenderEvaluationOptions>(() => ({
  format: runtimeFormat.value,
  remarkGfm: runtimeRemarkGfm.value,
  ...(props.rehypePlugins
    ? { rehypePlugins: props.rehypePlugins as FoundationMarkdownRenderPluginList }
    : {}),
  ...(props.remarkPlugins
    ? { remarkPlugins: props.remarkPlugins as FoundationMarkdownRenderPluginList }
    : {}),
}));
const mergedComponents = computed(() => ({
  ...markdownRenderDefaultComponents,
  ...(props.components ? toRaw(props.components) : {}),
}));
const rootClasses = computed(() => [
  'semi-markdownRender',
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

async function evaluateContent(): Promise<void> {
  if (!mounted.value) return;
  const currentRevision = ++revision;
  const evaluated = await evaluateMarkdownRender(
    props.raw,
    markdownRenderRuntime,
    evaluationOptions.value,
  );
  if (currentRevision !== revision || !mounted.value) return;
  contentComponent.value = markRaw(evaluated as MarkdownRenderContent) as Component;
}

onMounted(() => {
  mounted.value = true;
  void evaluateContent();
});
watch(
  [
    () => props.raw,
    runtimeFormat,
    runtimeRemarkGfm,
    () => props.remarkPlugins,
    () => props.rehypePlugins,
  ],
  () => void evaluateContent(),
);
onBeforeUnmount(() => {
  mounted.value = false;
  revision += 1;
});
</script>

<template>
  <div v-bind="dataAttrs" :class="rootClasses" :style="rootStyle">
    <component :is="contentComponent" v-if="contentComponent" :components="mergedComponents" />
  </div>
</template>
