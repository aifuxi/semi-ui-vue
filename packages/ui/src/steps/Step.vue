<script setup lang="ts">
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconChevronRight,
  IconTickCircle,
} from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue';

import StepsNodeRenderer from './StepsNodeRenderer';
import { stepsContextKey } from './steps-context';
import type { InternalStepProps, StepEmits, StepSlots, StepsStatus } from './types';

defineOptions({ name: 'Step', inheritAttrs: false });
const props = withDefaults(defineProps<InternalStepProps>(), {
  active: false,
  done: false,
  size: '',
  status: 'wait',
});
const emit = defineEmits<StepEmits>();
defineSlots<StepSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const context = inject(stepsContextKey, { type: computed(() => 'fill' as const) });

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

const prefixCls = 'semi-steps-item';
const titleContent = computed<VNodeChild>(() => slots.title?.() ?? props.title);
const descriptionContent = computed<VNodeChild>(() => slots.description?.() ?? props.description);
const hasIcon = computed(() => Boolean(slots.icon) || hasRawProp('icon'));
const iconContent = computed<VNodeChild>(() => slots.icon?.() ?? props.icon);
const customIconVisible = computed(() => {
  if (!hasIcon.value) return false;
  if (slots.icon) return (slots.icon() ?? []).length > 0;
  return context.type.value === 'basic' ? isVNode(props.icon) : Boolean(props.icon);
});
const clickable = computed(() => Boolean(props.onStepChange || instance?.vnode.props?.onClick));
const status = computed<StepsStatus>(() => props.status);
const rootClasses = computed(() => {
  if (context.type.value === 'nav') {
    return [
      prefixCls,
      props.active ? `${prefixCls}-active` : undefined,
      props.class,
      props.className,
      attrs.class,
    ];
  }
  if (context.type.value === 'basic') {
    return [
      prefixCls,
      `${prefixCls}-${status.value}`,
      props.active ? `${prefixCls}-active` : undefined,
      props.done ? `${prefixCls}-done` : undefined,
      clickable.value ? `${prefixCls}-hover` : undefined,
      clickable.value ? `${prefixCls}-clickable` : undefined,
      clickable.value ? `${prefixCls}-${status.value}-hover` : undefined,
      props.class,
      props.className,
      attrs.class,
    ];
  }
  return [
    prefixCls,
    `${prefixCls}-${status.value}`,
    clickable.value ? `${prefixCls}-${status.value}-hover` : undefined,
    clickable.value ? `${prefixCls}-${status.value}-active` : undefined,
    clickable.value ? `${prefixCls}-clickable` : undefined,
    props.class,
    props.className,
    attrs.class,
  ];
});
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const ariaLabel = computed(() => props.ariaLabel ?? (attrs['aria-label'] as string | undefined));
const defaultIconKind = computed<'error' | 'finish' | 'warning' | 'number' | undefined>(() => {
  if (hasIcon.value) return undefined;
  if (status.value === 'error') return 'error';
  if (status.value === 'finish') return 'finish';
  if (status.value === 'warning') return 'warning';
  if (status.value === 'wait' || status.value === 'process') return 'number';
  return undefined;
});
const iconSize = computed(() =>
  context.type.value === 'basic' && props.size === 'small' ? 'large' : 'extra-large',
);

function handleClick(event: MouseEvent): void {
  emit('click', event);
  props.onStepChange?.();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Enter') return;
  emit('keyDown', event);
  props.onStepChange?.();
}
</script>

<template>
  <div
    v-bind="dataAttrs"
    :aria-current="'step'"
    :aria-label="ariaLabel"
    :class="rootClasses"
    :role="role"
    :style="[style, attrs.style]"
    tabindex="0"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <template v-if="context.type.value === 'fill'">
      <div
        v-if="customIconVisible || defaultIconKind"
        :class="[
          `${prefixCls}-left`,
          hasIcon ? `${prefixCls}-icon` : `${prefixCls}-plain`,
          status === 'process' && !hasIcon ? `${prefixCls}-icon-process` : undefined,
          clickable ? `${prefixCls}-hover` : undefined,
        ]"
      >
        <StepsNodeRenderer v-if="hasIcon" :content="iconContent" />
        <IconAlertCircle v-else-if="defaultIconKind === 'error'" size="extra-large" />
        <IconTickCircle v-else-if="defaultIconKind === 'finish'" size="extra-large" />
        <IconAlertTriangle v-else-if="defaultIconKind === 'warning'" size="extra-large" />
        <template v-else>{{ stepNumber }}</template>
      </div>
      <div :class="`${prefixCls}-content`">
        <div
          :class="`${prefixCls}-title`"
          :title="typeof titleContent === 'string' ? titleContent : undefined"
        >
          <span :class="`${prefixCls}-title-text`"
            ><StepsNodeRenderer :content="titleContent"
          /></span>
        </div>
        <div
          :class="`${prefixCls}-description`"
          :title="typeof descriptionContent === 'string' ? descriptionContent : undefined"
        >
          <StepsNodeRenderer :content="descriptionContent" />
        </div>
      </div>
    </template>

    <div v-else-if="context.type.value === 'basic'" :class="`${prefixCls}-container`">
      <div :class="`${prefixCls}-left`">
        <span
          v-if="customIconVisible || defaultIconKind"
          :class="[
            `${prefixCls}-icon`,
            hasIcon ? `${prefixCls}-custom-icon` : undefined,
            status === 'process' && !hasIcon ? `${prefixCls}-icon-process` : undefined,
          ]"
        >
          <StepsNodeRenderer v-if="hasIcon" :content="iconContent" />
          <IconAlertCircle v-else-if="defaultIconKind === 'error'" :size="iconSize" />
          <IconTickCircle v-else-if="defaultIconKind === 'finish'" :size="iconSize" />
          <IconAlertTriangle v-else-if="defaultIconKind === 'warning'" :size="iconSize" />
          <span v-else :class="`${prefixCls}-number-icon`">{{ stepNumber }}</span>
        </span>
      </div>
      <div :class="`${prefixCls}-content`">
        <div :class="`${prefixCls}-title`">
          <div
            :class="[
              `${prefixCls}-title-text`,
              !titleContent ? `${prefixCls}-title-text-empty` : undefined,
            ]"
          >
            <StepsNodeRenderer :content="titleContent" />
          </div>
        </div>
        <div v-if="descriptionContent" :class="`${prefixCls}-description`">
          <StepsNodeRenderer :content="descriptionContent" />
        </div>
      </div>
    </div>

    <div v-else :class="`${prefixCls}-container`">
      <div :class="`${prefixCls}-content`">
        <div :class="`${prefixCls}-title`"><StepsNodeRenderer :content="titleContent" /></div>
      </div>
      <div v-if="index !== total! - 1" :class="`${prefixCls}-icon`">
        <IconChevronRight size="small" />
      </div>
    </div>
  </div>
</template>
