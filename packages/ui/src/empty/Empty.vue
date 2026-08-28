<script setup lang="ts">
import {
  Comment,
  Text,
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useSlots,
  type VNode,
  type VNodeChild,
} from 'vue';

import { Title } from '../typography';

import EmptyNodeRenderer from './EmptyNodeRenderer';
import type { EmptyProps, EmptySlots, EmptySvgNode } from './types';

defineOptions({ name: 'Empty', inheritAttrs: false });
const props = withDefaults(defineProps<EmptyProps>(), {
  layout: 'vertical',
});
defineSlots<EmptySlots>();
const attrs = useAttrs();
const slots = useSlots();

const themeMode = shallowRef<string | null>(null);
let observedBody: HTMLElement | null = null;
let themeObserver: MutationObserver | null = null;

function hasTruthyContent(content: VNodeChild | EmptySvgNode): boolean {
  // React's render branches test the ReactNode value itself. Arrays, including
  // empty arrays, are objects and therefore select the wrapper/image branch.
  if (Array.isArray(content)) return true;
  if (
    content === null ||
    content === undefined ||
    content === false ||
    content === '' ||
    content === 0
  )
    return false;
  if (typeof content !== 'object') return Boolean(content);
  const vnode = content as VNode;
  if (vnode.type === Comment) return false;
  if (vnode.type === Text) return hasTruthyContent(vnode.children as VNodeChild);
  return true;
}

function isSvgNode(content: VNodeChild | EmptySvgNode): content is EmptySvgNode {
  return (
    typeof content === 'object' && content !== null && !Array.isArray(content) && 'id' in content
  );
}

const lightImage = computed<EmptyProps['image']>(() => slots.image?.() ?? props.image);
const darkImage = computed<EmptyProps['darkModeImage']>(
  () => slots.darkModeImage?.() ?? props.darkModeImage,
);
const selectedImage = computed(() =>
  themeMode.value === 'dark' && hasTruthyContent(darkImage.value)
    ? darkImage.value
    : lightImage.value,
);
const isStringImage = computed(() => typeof selectedImage.value === 'string');
const svgImage = computed(() => (isSvgNode(selectedImage.value) ? selectedImage.value : undefined));
const customImage = computed<VNodeChild>(() =>
  isStringImage.value || svgImage.value ? undefined : (selectedImage.value as VNodeChild),
);
const hasImageNode = computed(
  () => isStringImage.value || Boolean(svgImage.value) || hasTruthyContent(customImage.value),
);

const titleContent = computed(() => slots.title?.() ?? props.title);
const descriptionContent = computed(() => slots.description?.() ?? props.description);
const footerContent = computed(() => slots.default?.());
const hasTitle = computed(() => hasTruthyContent(titleContent.value));
const hasDescription = computed(() => hasTruthyContent(descriptionContent.value));
const hasFooter = computed(() => hasTruthyContent(footerContent.value));
const imageAlt = computed(() =>
  typeof descriptionContent.value === 'string' ? descriptionContent.value : 'empty',
);

function updateThemeMode(): void {
  if (!observedBody) return;
  const nextMode = observedBody.getAttribute('theme-mode');
  if (nextMode !== themeMode.value) themeMode.value = nextMode;
}

onMounted(() => {
  if (!hasTruthyContent(darkImage.value)) return;
  observedBody = window.document.body;
  updateThemeMode();
  themeObserver = new MutationObserver((mutations) => {
    if (
      mutations.some(
        (mutation) => mutation.type === 'attributes' && mutation.attributeName === 'theme-mode',
      )
    ) {
      updateThemeMode();
    }
  });
  themeObserver.observe(observedBody, { attributes: true, childList: false, subtree: false });
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
  themeObserver = null;
  observedBody = null;
});
</script>

<template>
  <div
    v-bind="attrs"
    class="semi-empty"
    :class="[props.class, props.className, `semi-empty-${props.layout}`]"
    :style="props.style"
  >
    <div class="semi-empty-image" :style="props.imageStyle" x-semi-prop="image,darkModeImage">
      <img v-if="isStringImage" :alt="imageAlt" :src="selectedImage as string" />
      <svg v-else-if="svgImage" aria-hidden="true">
        <use :xlink:href="`#${svgImage.id}`" />
      </svg>
      <EmptyNodeRenderer v-else :content="customImage" />
    </div>
    <div class="semi-empty-content">
      <Title
        v-if="hasTitle"
        class="semi-empty-title"
        :heading="hasImageNode ? 4 : 6"
        :style="hasImageNode ? undefined : { fontWeight: 400 }"
        x-semi-prop="title"
      >
        <EmptyNodeRenderer :content="titleContent" />
      </Title>
      <div v-if="hasDescription" class="semi-empty-description" x-semi-prop="description">
        <EmptyNodeRenderer :content="descriptionContent" />
      </div>
      <div v-if="hasFooter" class="semi-empty-footer" x-semi-prop="children">
        <EmptyNodeRenderer :content="footerContent" />
      </div>
    </div>
  </div>
</template>
