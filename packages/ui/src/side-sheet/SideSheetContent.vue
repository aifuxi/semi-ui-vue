<script setup lang="ts">
import { computed, type HTMLAttributes, type StyleValue, type VNodeChild } from 'vue';
import { IconClose } from '@aifuxi/semi-icons-vue';

import { Button } from '../button';
import SideSheetNodeRenderer from './SideSheetNodeRenderer';
import type { SideSheetCancelEvent, SideSheetPlacement, SideSheetSize } from './types';

interface Props {
  ariaLabel?: string | undefined;
  body: VNodeChild;
  bodyStyle?: StyleValue | undefined;
  class?: HTMLAttributes['class'];
  closable: boolean;
  closeIcon: VNodeChild;
  customContainer: boolean;
  dataAttrs: Record<string, unknown>;
  dialogClass?: HTMLAttributes['class'];
  footer: VNodeChild;
  headerStyle?: StyleValue | undefined;
  height: number | string;
  hidden: boolean;
  mask: boolean;
  maskClass?: HTMLAttributes['class'];
  maskClosable: boolean;
  maskStyle?: StyleValue | undefined;
  outerStyle?: StyleValue | undefined;
  placement: SideSheetPlacement;
  rtl: boolean;
  size: SideSheetSize;
  title: VNodeChild;
  width?: number | string | undefined;
  wrapperWidth?: number | string | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  animationEnd: [event: AnimationEvent];
  close: [event: SideSheetCancelEvent];
}>();

const hasTitle = computed(() => Boolean(props.title));
const hasFooter = computed(() => Boolean(props.footer));
const hasCustomCloseIcon = computed(() => Boolean(props.closeIcon));
const rootClasses = computed(() => [
  'semi-sidesheet',
  props.class,
  `semi-sidesheet-${props.placement}`,
  {
    'semi-sidesheet-popup': props.customContainer,
    'semi-sidesheet-horizontal': props.placement === 'top' || props.placement === 'bottom',
    'semi-sidesheet-rtl': props.rtl,
    'semi-sidesheet-hidden': props.hidden,
    'semi-sidesheet-fixed': !props.mask,
    [`semi-sidesheet-size-${props.size}`]: !props.mask,
  },
]);
const rootStyle = computed<StyleValue>(() =>
  !props.mask && props.wrapperWidth !== undefined ? { width: props.wrapperWidth } : undefined,
);
const dialogClasses = computed(() => [
  'semi-sidesheet-inner',
  'semi-sidesheet-inner-wrap',
  `semi-sidesheet-size-${props.size}`,
  props.dialogClass,
]);
const dialogStyle = computed<StyleValue>(() => [
  props.outerStyle,
  props.width === undefined ? undefined : { width: props.mask ? props.width : '100%' },
  { height: props.height },
]);

function handleMaskClick(event: MouseEvent): void {
  if (props.maskClosable && event.target === event.currentTarget) emit('close', event);
}
</script>

<template>
  <div v-bind="props.dataAttrs" :class="rootClasses" :style="rootStyle">
    <div
      v-if="props.mask"
      aria-hidden="true"
      class="semi-sidesheet-mask"
      :class="props.maskClass"
      :style="props.maskStyle"
      @animationend="emit('animationEnd', $event)"
      @click="handleMaskClick"
    />
    <div
      role="dialog"
      :aria-label="props.ariaLabel"
      tabindex="-1"
      :class="dialogClasses"
      :style="dialogStyle"
      @animationend="emit('animationEnd', $event)"
    >
      <div class="semi-sidesheet-content">
        <div class="semi-sidesheet-header" role="heading" aria-level="1" :style="props.headerStyle">
          <div v-if="hasTitle" class="semi-sidesheet-title" x-semi-prop="title">
            <SideSheetNodeRenderer :content="props.title" />
          </div>
          <Button
            v-if="props.closable"
            class="semi-sidesheet-close"
            type="tertiary"
            theme="borderless"
            size="small"
            @click="emit('close', $event)"
          >
            <template #icon>
              <SideSheetNodeRenderer v-if="hasCustomCloseIcon" :content="props.closeIcon" />
              <IconClose v-else />
            </template>
          </Button>
        </div>
        <div class="semi-sidesheet-body" :style="props.bodyStyle" x-semi-prop="children">
          <SideSheetNodeRenderer :content="props.body" />
        </div>
        <div v-if="hasFooter" class="semi-sidesheet-footer" x-semi-prop="footer">
          <SideSheetNodeRenderer :content="props.footer" />
        </div>
      </div>
    </div>
  </div>
</template>
