<script setup lang="ts">
import { BannerFoundation, type BannerAdapter } from '@workspace/foundation-integration';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconClose,
  IconInfoCircle,
  IconTickCircle,
} from '@workspace/icons';
import {
  Comment,
  Text,
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useSlots,
  type Component,
  type VNode,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import { Paragraph, Title } from '../typography';

import BannerNodeRenderer from './BannerNodeRenderer';
import type { BannerEmits, BannerProps, BannerSlots, BannerType } from './types';

defineOptions({ name: 'Banner', inheritAttrs: false });
const props = withDefaults(defineProps<BannerProps>(), {
  bordered: false,
  fullMode: true,
  type: 'info',
});
const emit = defineEmits<BannerEmits>();
defineSlots<BannerSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

interface BannerState {
  visible: boolean;
}

const state = shallowReactive<BannerState>({ visible: true });
const cache = new Map<string, unknown>();

function hasReactTruthyContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) {
    return true;
  }
  if (
    content === null ||
    content === undefined ||
    content === false ||
    content === '' ||
    content === 0
  ) {
    return false;
  }
  if (typeof content !== 'object') return Boolean(content);
  const vnode = content as VNode;
  if (vnode.type === Comment) return false;
  if (vnode.type === Text) return hasReactTruthyContent(vnode.children as VNodeChild);
  return true;
}

function hasSlotTruthyContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) {
    return content.length === 0 || content.some((node) => hasSlotTruthyContent(node));
  }
  return hasReactTruthyContent(content);
}

function hasRawProp(name: keyof BannerProps): boolean {
  const raw = instance?.vnode.props;
  const kebabName = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebabName)),
  );
}

function getFoundationProps(): BannerProps {
  return props;
}

const adapter: BannerAdapter<BannerProps, BannerState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => props[key as keyof BannerProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof BannerState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  setVisible: () => {
    state.visible = false;
  },
  notifyClose: (event) => emit('close', event),
};
const foundation = markRaw(new BannerFoundation<BannerProps, BannerState>(adapter));

const rootClasses = computed(() => [
  'semi-banner',
  `semi-banner-${props.type}`,
  props.fullMode ? 'semi-banner-full' : 'semi-banner-in-container',
  !props.fullMode && props.bordered ? 'semi-banner-bordered' : undefined,
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);

const titleContent = computed<VNodeChild>(() => slots.title?.() ?? props.title);
const descriptionContent = computed<VNodeChild>(() => slots.description?.() ?? props.description);
const extraContent = computed<VNodeChild>(() => slots.default?.());
const hasTitle = computed(() =>
  slots.title
    ? hasSlotTruthyContent(titleContent.value)
    : hasReactTruthyContent(titleContent.value),
);
const hasDescription = computed(() =>
  slots.description
    ? hasSlotTruthyContent(descriptionContent.value)
    : hasReactTruthyContent(descriptionContent.value),
);
const hasExtra = computed(() => hasSlotTruthyContent(extraContent.value));

const defaultIconComponents: Record<BannerType, Component> = {
  danger: IconAlertCircle,
  info: IconInfoCircle,
  success: IconTickCircle,
  warning: IconAlertTriangle,
};
const customIcon = computed<VNodeChild>(() =>
  slots.icon ? slots.icon() : hasRawProp('icon') ? props.icon : undefined,
);
const usesDefaultIcon = computed(() => !slots.icon && !hasRawProp('icon'));
const defaultIconComponent = computed(() => defaultIconComponents[props.type]);
const hasIcon = computed(
  () =>
    usesDefaultIcon.value ||
    (slots.icon ? hasSlotTruthyContent(customIcon.value) : hasReactTruthyContent(customIcon.value)),
);

const customCloseIcon = computed<VNodeChild>(() =>
  slots.closeIcon ? slots.closeIcon() : hasRawProp('closeIcon') ? props.closeIcon : undefined,
);
const hasCloseButton = computed(
  () => Boolean(slots.closeIcon) || !hasRawProp('closeIcon') || props.closeIcon !== null,
);
const usesDefaultCloseIcon = computed(() =>
  slots.closeIcon
    ? !hasSlotTruthyContent(customCloseIcon.value)
    : !hasReactTruthyContent(customCloseIcon.value),
);

function remove(event: MouseEvent): void {
  event.stopPropagation();
  foundation.removeBanner(event);
}

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div v-if="state.visible" v-bind="rootAttrs" :class="rootClasses" :style="rootStyle" role="alert">
    <div class="semi-banner-content-wrapper">
      <div class="semi-banner-content">
        <div v-if="hasIcon" class="semi-banner-icon" x-semi-prop="icon">
          <component
            :is="defaultIconComponent"
            v-if="usesDefaultIcon"
            :aria-label="props.type"
            size="large"
          />
          <BannerNodeRenderer v-else :content="customIcon" />
        </div>
        <div class="semi-banner-content-body">
          <Title
            v-if="hasTitle"
            class="semi-banner-title"
            component="div"
            :heading="5"
            x-semi-prop="title"
          >
            <BannerNodeRenderer :content="titleContent" />
          </Title>
          <Paragraph
            v-if="hasDescription"
            class="semi-banner-description"
            component="div"
            x-semi-prop="description"
          >
            <BannerNodeRenderer :content="descriptionContent" />
          </Paragraph>
        </div>
      </div>
      <Button
        v-if="hasCloseButton"
        aria-label="Close"
        class="semi-banner-close"
        size="small"
        theme="borderless"
        type="tertiary"
        @click="remove"
      >
        <template #icon>
          <IconClose v-if="usesDefaultCloseIcon" aria-hidden="true" x-semi-prop="closeIcon" />
          <BannerNodeRenderer v-else :content="customCloseIcon" />
        </template>
      </Button>
    </div>
    <div v-if="hasExtra" class="semi-banner-extra" x-semi-prop="children">
      <BannerNodeRenderer :content="extraContent" />
    </div>
  </div>
</template>
