<script setup lang="ts">
import { ImagePreviewFooterFoundation } from '@workspace/foundation-integration';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconMinus,
  IconPlus,
  IconRealSizeStroked,
  IconRotate,
  IconWindowAdaptionStroked,
} from '@aifuxi/semi-icons-vue';
import throttle from 'lodash/throttle.js';
import {
  computed,
  h,
  markRaw,
  onBeforeUnmount,
  useSlots,
  useTemplateRef,
  type Component,
  type VNodeChild,
} from 'vue';

import Divider from '../divider/Divider.vue';
import Slider from '../slider/Slider.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import ImageNodeRenderer from './ImageNodeRenderer';
import type { ImageLocale, ImagePreviewMenuProps, ImageRatioType } from './types';

interface FooterProps {
  adaptiveTip?: string | undefined;
  className?: string | undefined;
  curPage: number;
  disableDownload: boolean;
  disabledNext: boolean;
  disabledPrev: boolean;
  downloadTip?: string | undefined;
  locale: ImageLocale;
  max: number;
  min: number;
  nextTip?: string | undefined;
  onAdjustRatio: (type: ImageRatioType) => void;
  onDownload: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRotate: (direction: string) => void;
  onZoom: (zoom: number) => void;
  originTip?: string | undefined;
  prevTip?: string | undefined;
  ratio: ImageRatioType;
  renderPreviewMenu?: ((props: ImagePreviewMenuProps) => VNodeChild) | undefined;
  rotateTip?: string | undefined;
  showTooltip: boolean;
  step: number;
  totalNum: number;
  zIndex: number;
  zoom: number;
  zoomInTip?: string | undefined;
  zoomOutTip?: string | undefined;
}

const props = defineProps<FooterProps>();
const slots = useSlots();
const root = useTemplateRef<HTMLElement>('root');
const cache = new Map<unknown, unknown>();
const runtimeProps = () => ({
  ...props,
  onAdjustRatio: props.onAdjustRatio,
  onRotate: props.onRotate,
  onZoomIn: props.onZoom,
  onZoomOut: props.onZoom,
});
const foundation = markRaw(
  new ImagePreviewFooterFoundation({
    getContext: () => undefined,
    getContexts: () => ({}),
    getProp: (key: keyof ReturnType<typeof runtimeProps>) => runtimeProps()[key],
    getProps: runtimeProps,
    getState: () => undefined,
    getStates: () => ({}),
    setState: (_state: Record<string, never>, callback?: () => void) => callback?.(),
    getCache: (key: string) => cache.get(key),
    getCaches: () => cache,
    setCache: (key: unknown, value: unknown) => cache.set(key, value),
    stopPropagation: (event?: { stopPropagation?: () => void }) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
  }),
);

const handleSlideChange = throttle((value: number): void => {
  foundation.handleValueChange(value);
}, 50);

function action(
  component: Component,
  options: {
    className?: string;
    disabled?: boolean;
    gap?: boolean;
    key: string;
    onClick?: () => void;
    tip: string;
  },
): VNodeChild {
  const icon = h(component, {
    class: [
      options.className,
      options.disabled ? 'semi-image-preview-footer-disabled' : undefined,
      options.gap && !props.showTooltip ? 'semi-image-preview-footer-gap' : undefined,
    ],
    key: options.key,
    onClick: options.disabled ? undefined : options.onClick,
    size: 'large',
  });
  if (!props.showTooltip) {
    return icon;
  }
  return h(
    Tooltip,
    { content: options.tip, key: `tooltip-${options.key}`, zIndex: props.zIndex + 1 },
    {
      default: () =>
        h(
          'span',
          {
            class: [
              'semi-image-tooltip-children-wrapper',
              options.gap ? 'semi-image-preview-footer-gap' : undefined,
            ],
          },
          [icon],
        ),
    },
  );
}

const menuItems = computed<VNodeChild[]>(() => {
  const disabledZoomIn = props.zoom === props.max;
  const disabledZoomOut = props.zoom === props.min;
  return [
    action(IconChevronLeft, {
      disabled: props.disabledPrev,
      key: 'chevron-left',
      onClick: props.onPrev,
      tip: props.prevTip ?? props.locale.prevTip,
    }),
    h('div', { class: 'semi-image-preview-footer-page', key: 'info' }, [
      `${props.curPage}/${props.totalNum}`,
    ]),
    action(IconChevronRight, {
      disabled: props.disabledNext,
      key: 'chevron-right',
      onClick: props.onNext,
      tip: props.nextTip ?? props.locale.nextTip,
    }),
    action(IconMinus, {
      disabled: disabledZoomOut,
      key: 'minus',
      onClick: () => foundation.changeSliderValue('minus'),
      tip: props.zoomOutTip ?? props.locale.zoomOutTip,
    }),
    h(Slider, {
      key: 'slider',
      max: props.max,
      min: props.min,
      onChange: (value: number | number[]) => {
        if (typeof value === 'number') handleSlideChange(value);
      },
      step: props.step,
      tipFormatter: (value: string | number | boolean | null) => `${String(value)}%`,
      tooltipVisible: props.showTooltip ? undefined : false,
      value: props.zoom,
    }),
    action(IconPlus, {
      disabled: disabledZoomIn,
      key: 'plus',
      onClick: () => foundation.changeSliderValue('plus'),
      tip: props.zoomInTip ?? props.locale.zoomInTip,
    }),
    action(props.ratio === 'adaptation' ? IconRealSizeStroked : IconWindowAdaptionStroked, {
      gap: true,
      key: 'ratio',
      onClick: () => foundation.handleRatioClick(),
      tip:
        props.ratio === 'adaptation'
          ? (props.originTip ?? props.locale.originTip)
          : (props.adaptiveTip ?? props.locale.adaptiveTip),
    }),
    action(IconRotate, {
      key: 'rotate',
      onClick: () => foundation.handleRotate('left'),
      tip: props.rotateTip ?? props.locale.rotateTip,
    }),
    action(IconDownload, {
      disabled: props.disableDownload,
      gap: true,
      key: 'download',
      onClick: props.onDownload,
      tip: props.downloadTip ?? props.locale.downloadTip,
    }),
  ];
});

const defaultMenu = computed<VNodeChild[]>(() => {
  const nodes = [...menuItems.value];
  nodes.splice(3, 0, h(Divider, { key: 'divider-first', layout: 'vertical' }));
  nodes.splice(8, 0, h(Divider, { key: 'divider-second', layout: 'vertical' }));
  return nodes;
});
const menuProps = computed<ImagePreviewMenuProps>(() => ({
  curPage: props.curPage,
  disableDownload: props.disableDownload,
  disabledNext: props.disabledNext,
  disabledPrev: props.disabledPrev,
  disabledZoomIn: props.zoom === props.max,
  disabledZoomOut: props.zoom === props.min,
  max: props.max,
  menuItems: menuItems.value,
  min: props.min,
  onDownload: props.onDownload,
  onNext: props.onNext,
  onPrev: props.onPrev,
  onRatioClick: () => foundation.handleRatioClick(),
  onRotateLeft: () => foundation.handleRotate('left'),
  onRotateRight: () => foundation.handleRotate('right'),
  onZoomIn: () => foundation.changeSliderValue('plus'),
  onZoomOut: () => foundation.changeSliderValue('minus'),
  ratio: props.ratio,
  step: props.step,
  totalNum: props.totalNum,
  zoom: props.zoom,
}));
const customMenu = computed(
  () => slots.previewMenu?.(menuProps.value) ?? props.renderPreviewMenu?.(menuProps.value),
);

onBeforeUnmount(() => {
  handleSlideChange.cancel();
  foundation.destroy();
});
defineExpose({ element: root });
</script>

<template>
  <section
    ref="root"
    :class="[
      'semi-image-preview-footer',
      'semi-image-preview-footer-wrapper',
      props.className,
      !customMenu ? 'semi-image-preview-footer-content' : undefined,
    ]"
  >
    <ImageNodeRenderer :content="customMenu || defaultMenu" />
  </section>
</template>
