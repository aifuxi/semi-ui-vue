<script setup lang="ts">
import { AvatarFoundation } from '@workspace/foundation-integration';
import {
  Comment,
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  Text,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type CSSProperties,
  type VNode,
  type VNodeChild,
} from 'vue';

import AvatarNodeRenderer from './AvatarNodeRenderer';
import TopSlotSvg from './TopSlotSvg.vue';
import {
  AVATAR_SIZES,
  type AvatarBottomSlot,
  type AvatarEmits,
  type AvatarProps,
  type AvatarSlots,
  type AvatarState,
  type AvatarTopSlot,
} from './types';

defineOptions({ name: 'Avatar', inheritAttrs: false });
const props = withDefaults(defineProps<AvatarProps>(), {
  border: false,
  color: 'grey',
  contentMotion: false,
  gap: 3,
  shape: 'circle',
  size: 'medium',
});
const emit = defineEmits<AvatarEmits>();
defineSlots<AvatarSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const root = useTemplateRef<HTMLSpanElement>('root');
const state = reactive<AvatarState>({
  isImgExist: true,
  focusVisible: false,
  scale: 1,
  showHoverMask: false,
});
let mounted = false;
let imageProbe: HTMLImageElement | null = null;
let pendingImageErrorEvent: Event | undefined;

function meaningfulNodes(nodes: VNode[] | undefined): VNode[] {
  return (nodes ?? []).filter(
    (node) =>
      node.type !== Comment && !(node.type === Text && String(node.children ?? '').trim() === ''),
  );
}

const defaultNodes = computed(() => meaningfulNodes(slots.default?.()));
const stringContent = computed<string | undefined>(() => {
  if (defaultNodes.value.length !== 1 || defaultNodes.value[0]?.type !== Text) return undefined;
  return String(defaultNodes.value[0].children ?? '');
});
const clickable = computed(() => {
  const rawProps = instance?.vnode.props;
  return Boolean(rawProps && Object.prototype.hasOwnProperty.call(rawProps, 'onClick'));
});
const isImage = computed(() => Boolean(props.src && state.isImgExist));
const shouldWrap = computed(() => Boolean(props.bottomSlot || props.topSlot || props.border));
const isPresetSize = computed(() =>
  AVATAR_SIZES.includes(props.size as (typeof AVATAR_SIZES)[number]),
);
const customSizeStyle = computed<CSSProperties>(() =>
  isPresetSize.value ? {} : { width: props.size, height: props.size },
);
const rootStyle = computed(() =>
  shouldWrap.value ? {} : [customSizeStyle.value, props.style, attrs.style],
);
const wrapperStyle = computed(() => [customSizeStyle.value, props.style, attrs.style]);
const rootClasses = computed(() => [
  attrs.class,
  props.class,
  props.className,
  'semi-avatar',
  `semi-avatar-${props.shape}`,
  `semi-avatar-${props.size}`,
  !isImage.value ? `semi-avatar-${props.color}` : undefined,
  isImage.value ? 'semi-avatar-img' : undefined,
  state.focusVisible ? 'semi-avatar-focus' : undefined,
  props.contentMotion ? 'semi-avatar-animated' : undefined,
]);
const passthroughAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const finalAlt = computed(() => {
  const base = props.alt ?? stringContent.value;
  return clickable.value ? `clickable Avatar: ${base}` : base;
});
const hoverMaskNode = computed<VNodeChild | undefined>(() => {
  const nodes = meaningfulNodes(slots.hoverMask?.());
  return nodes.length ? nodes : props.hoverMask;
});
const imageAttrs = computed<Record<string, unknown>>(() => {
  const configured = (props.imgAttr ?? {}) as Record<string, unknown>;
  const basicAttrs: Record<string, unknown> = {
    alt: finalAlt.value,
    src: props.src,
    srcset: props.srcSet,
    onError: handleImageError,
    ...configured,
    class: clickable.value ? 'semi-avatar-no-focus-visible' : undefined,
  };
  if (!clickable.value) return basicAttrs;
  return {
    ...basicAttrs,
    tabindex: 0,
    onKeydown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
});
const borderStyle = computed<CSSProperties>(() =>
  typeof props.border === 'object' && props.border.color ? { borderColor: props.border.color } : {},
);
const borderMotion = computed(() => typeof props.border === 'object' && props.border.motion);
const topSlotSupported = computed(
  () =>
    Boolean(props.topSlot) &&
    props.shape === 'circle' &&
    ['extra-small', 'small', 'default', 'medium', 'large', 'extra-large'].includes(props.size),
);
const bottomSlotSupported = computed(
  () =>
    Boolean(props.bottomSlot) &&
    ['extra-small', 'small', 'default', 'medium', 'large', 'extra-large'].includes(props.size),
);

function runtimeProps() {
  return {
    children: stringContent.value,
    gap: props.gap,
    onError: () => props.onError?.(pendingImageErrorEvent as Event),
  };
}

const cache = new Map<string, unknown>();
const adapter = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key: string) => runtimeProps()[key as keyof ReturnType<typeof runtimeProps>],
  getProps: runtimeProps,
  getState: (key: string) => state[key as keyof AvatarState],
  getStates: () => state,
  setState: (nextState: Partial<AvatarState>, callback?: () => void) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key: string) => cache.get(key),
  getCaches: () => cache,
  setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
  stopPropagation: (event?: { stopPropagation?: () => void }) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyImgState: (isImgExist: boolean) => {
    state.isImgExist = isImgExist;
  },
  notifyEnter: (event: MouseEvent) => {
    state.showHoverMask = Boolean(hoverMaskNode.value);
    void nextTick(() => emit('mouseenter', event));
  },
  notifyLeave: (event: MouseEvent) => {
    state.showHoverMask = false;
    void nextTick(() => emit('mouseleave', event));
  },
  setFocusVisible: (focusVisible: boolean) => {
    state.focusVisible = focusVisible;
  },
  setScale: (scale: number) => {
    if (state.scale !== scale) state.scale = scale;
  },
  getAvatarNode: () => root.value,
};
const foundation = markRaw(new AvatarFoundation(adapter));

function handleClick(event: MouseEvent | KeyboardEvent): void {
  if (clickable.value) emit('click', event);
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    handleClick(event);
    event.preventDefault();
    event.stopPropagation();
  } else if (event.key === 'Escape') {
    (event.target as HTMLElement | null)?.blur();
  }
}

function handleFocus(event: FocusEvent): void {
  foundation.handleFocusVisible(event);
}

function handleBlur(): void {
  foundation.handleBlur();
}

function handleImageError(event: Event): void {
  const configured = props.imgAttr?.onError;
  if (typeof configured === 'function') {
    configured(event);
    return;
  }
  pendingImageErrorEvent = event;
  foundation.handleImgLoadError();
  pendingImageErrorEvent = undefined;
}

function handleMouseEnter(event: MouseEvent): void {
  foundation.handleEnter(event);
}

function handleMouseLeave(event: MouseEvent): void {
  foundation.handleLeave(event);
}

function measureText(): void {
  if (!mounted || stringContent.value === undefined) return;
  void nextTick(() => foundation.changeScale());
}

function probeSource(source: string | undefined): void {
  if (!mounted || !source || typeof Image === 'undefined') return;
  imageProbe = new Image(0, 0);
  imageProbe.onload = () => {
    if (imageProbe) state.isImgExist = true;
  };
  imageProbe.onerror = imageProbe.onabort = () => {
    if (imageProbe) state.isImgExist = false;
  };
  imageProbe.src = source;
}

watch([() => props.gap, () => props.size], measureText);
watch(
  () => props.src,
  (source, previous) => {
    if (source !== previous) probeSource(source);
  },
);

onMounted(() => {
  mounted = true;
  foundation.init();
});
onUpdated(measureText);
onBeforeUnmount(() => {
  mounted = false;
  if (imageProbe) {
    imageProbe.onload = null;
    imageProbe.onerror = null;
    imageProbe.onabort = null;
    imageProbe = null;
  }
  foundation.destroy();
});

function bottomSlotConfig(): AvatarBottomSlot {
  return props.bottomSlot ?? {};
}

function topSlotConfig(): AvatarTopSlot {
  return props.topSlot ?? {};
}
</script>

<template>
  <span
    v-if="shouldWrap"
    class="semi-avatar-wrapper"
    :style="wrapperStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      v-if="props.border"
      :style="[{ position: 'relative' }, customSizeStyle, props.style, attrs.style]"
    >
      <span v-bind="passthroughAttrs" ref="root" :class="rootClasses" :style="{}" role="listitem">
        <img v-if="isImage" v-bind="imageAttrs" />
        <span
          v-else-if="stringContent !== undefined"
          class="semi-avatar-content"
          :style="{ transform: `scale(${state.scale})` }"
        >
          <span
            class="semi-avatar-label"
            :class="clickable ? 'semi-avatar-no-focus-visible' : undefined"
            role="img"
            :aria-label="finalAlt"
            :tabindex="clickable ? 0 : undefined"
            x-semi-prop="children"
            @keydown="handleKeyDown"
            @focus="handleFocus"
            @blur="foundation.handleBlur()"
            >{{ stringContent }}</span
          >
        </span>
        <slot v-else />
        <div v-if="state.showHoverMask" class="semi-avatar-hover" x-semi-prop="hoverContent">
          <slot name="hoverMask"><AvatarNodeRenderer :node="hoverMaskNode" /></slot>
        </div>
      </span>
      <span
        :style="borderStyle"
        :class="[
          'semi-avatar-additionalBorder',
          `semi-avatar-additionalBorder-${props.size}`,
          `semi-avatar-${props.shape}`,
        ]"
      />
      <span
        v-if="borderMotion"
        :style="borderStyle"
        :class="[
          'semi-avatar-additionalBorder',
          `semi-avatar-additionalBorder-${props.size}`,
          `semi-avatar-${props.shape}`,
          'semi-avatar-additionalBorder-animated',
        ]"
      />
    </div>
    <span
      v-else
      v-bind="passthroughAttrs"
      ref="root"
      :class="rootClasses"
      :style="{}"
      role="listitem"
    >
      <img v-if="isImage" v-bind="imageAttrs" />
      <span
        v-else-if="stringContent !== undefined"
        class="semi-avatar-content"
        :style="{ transform: `scale(${state.scale})` }"
      >
        <span
          class="semi-avatar-label"
          :class="clickable ? 'semi-avatar-no-focus-visible' : undefined"
          role="img"
          :aria-label="finalAlt"
          :tabindex="clickable ? 0 : undefined"
          x-semi-prop="children"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="foundation.handleBlur()"
          >{{ stringContent }}</span
        >
      </span>
      <slot v-else />
      <div v-if="state.showHoverMask" class="semi-avatar-hover" x-semi-prop="hoverContent">
        <slot name="hoverMask"><AvatarNodeRenderer :node="hoverMaskNode" /></slot>
      </div>
    </span>
    <template v-if="topSlotSupported">
      <slot name="topSlot" :config="topSlotConfig()">
        <component :is="props.topSlot.render" v-if="props.topSlot?.render" />
        <div
          v-else
          :style="props.topSlot?.style"
          :class="[
            'semi-avatar-top_slot-wrapper',
            props.topSlot?.className,
            props.contentMotion ? 'semi-avatar-animated' : undefined,
          ]"
        >
          <div :class="['semi-avatar-top_slot-bg', `semi-avatar-top_slot-bg-${props.size}`]">
            <div
              :class="['semi-avatar-top_slot-bg-svg', `semi-avatar-top_slot-bg-svg-${props.size}`]"
            >
              <TopSlotSvg
                :gradient-start="props.topSlot?.gradientStart ?? 'var(--semi-color-primary)'"
                :gradient-end="props.topSlot?.gradientEnd ?? 'var(--semi-color-primary)'"
              />
            </div>
          </div>
          <div class="semi-avatar-top_slot">
            <div
              :style="props.topSlot?.textColor ? { color: props.topSlot.textColor } : undefined"
              :class="[
                'semi-avatar-top_slot-content',
                `semi-avatar-top_slot-content-${props.size}`,
              ]"
            >
              <AvatarNodeRenderer :node="props.topSlot?.text" />
            </div>
          </div>
        </div>
      </slot>
    </template>
    <template v-if="bottomSlotSupported">
      <slot name="bottomSlot" :config="bottomSlotConfig()">
        <component :is="props.bottomSlot.render" v-if="props.bottomSlot?.render" />
        <div v-else class="semi-avatar-bottom_slot" :style="props.bottomSlot?.style">
          <span
            :style="{
              backgroundColor: props.bottomSlot?.bgColor,
              color: props.bottomSlot?.textColor,
            }"
            :class="[
              `semi-avatar-bottom_slot-shape_${props.bottomSlot?.shape}`,
              `semi-avatar-bottom_slot-shape_${props.bottomSlot?.shape}-${props.size}`,
              props.bottomSlot?.className,
            ]"
            ><AvatarNodeRenderer :node="props.bottomSlot?.text"
          /></span>
        </div>
      </slot>
    </template>
  </span>
  <span
    v-else
    v-bind="passthroughAttrs"
    ref="root"
    :class="rootClasses"
    :style="rootStyle"
    role="listitem"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img v-if="isImage" v-bind="imageAttrs" />
    <span
      v-else-if="stringContent !== undefined"
      class="semi-avatar-content"
      :style="{ transform: `scale(${state.scale})` }"
    >
      <span
        class="semi-avatar-label"
        :class="clickable ? 'semi-avatar-no-focus-visible' : undefined"
        role="img"
        :aria-label="finalAlt"
        :tabindex="clickable ? 0 : undefined"
        x-semi-prop="children"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="foundation.handleBlur()"
        >{{ stringContent }}</span
      >
    </span>
    <slot v-else />
    <div v-if="state.showHoverMask" class="semi-avatar-hover" x-semi-prop="hoverContent">
      <slot name="hoverMask"><AvatarNodeRenderer :node="hoverMaskNode" /></slot>
    </div>
  </span>
</template>
