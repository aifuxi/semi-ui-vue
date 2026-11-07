<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  type HTMLAttributes,
  type StyleValue,
  type VNodeChild,
} from 'vue';
import { IconClose } from '@aifuxi/semi-icons-vue';

import { Button } from '../button';
import { Title } from '../typography';
import ModalContentRenderer from './ModalContentRenderer';
import ModalNodeRenderer from './ModalNodeRenderer';
import type { ModalSize } from './types';

export interface ModalInnerContentExposed {
  element: HTMLDivElement | null;
}

interface Props {
  body: VNodeChild;
  bodyStyle?: StyleValue | undefined;
  centered: boolean;
  closable: boolean;
  closeIcon: VNodeChild;
  contentClass: HTMLAttributes['class'];
  dialogId: string;
  footer: VNodeChild;
  fullScreen: boolean;
  header: VNodeChild;
  headerProvided: boolean;
  height?: string | number | undefined;
  icon: VNodeChild;
  modalRender?: ((dialog: VNodeChild) => VNodeChild) | undefined;
  outerStyle?: StyleValue | undefined;
  outerClass?: HTMLAttributes['class'];
  size: ModalSize;
  title: VNodeChild;
  width?: string | number | undefined;
}

/** 渲染层配置；dialogId 由父级 useId 提供，SSR 与客户端保持一致。 */
const props = defineProps<Props>();
/** 将内容层事件交回父级 Foundation，保持原关闭和动效路径。 */
const emit = defineEmits<{
  animationEnd: [event: AnimationEvent];
  close: [event: MouseEvent];
  mousedown: [event: MouseEvent];
}>();
/** 暴露实际 dialog 给父级管理焦点。 */
const dialogElement = useTemplateRef<HTMLDivElement>('dialog');
/** 仅 title 非空时渲染标准标题；自定义 header 仍优先。 */
const hasDefaultHeader = computed(() => props.title !== null && props.title !== undefined);
/** header 决定正文布局，不决定正文的可访问性关联是否存在。 */
const hasHeader = computed(() => props.headerProvided || hasDefaultHeader.value);
/** 使用实例 ID 派生名称引用，防止多弹窗解析到文档中的第一个标题。 */
const titleId = computed(() => `semi-modal-title-${props.dialogId}`);
/** 描述同样必须指向本实例正文，避免与标题发生同类碰撞。 */
const bodyId = computed(() => `semi-modal-body-${props.dialogId}`);

/** 数字尺寸按 CSS 像素转换，字符串保留调用方单位。 */
function cssSize(value: string | number | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

/** 全屏覆盖显式宽高，与原尺寸定位规则一致。 */
const outerStyle = computed<StyleValue>(() => [
  props.outerStyle,
  props.width === undefined ? undefined : { width: cssSize(props.width) },
  props.height === undefined ? undefined : { height: cssSize(props.height) },
  props.fullScreen ? { width: '100%', height: '100%', margin: 'unset' } : undefined,
]);
/** 保留固定基线的内容、全屏和显式高度 class。 */
const contentClasses = computed(() => [
  'semi-modal-content',
  props.contentClass,
  {
    'semi-modal-content-fullScreen': props.fullScreen,
    'semi-modal-content-height-set': props.height !== undefined,
  },
]);
/** 图标存在时启用固定基线正文缩进。 */
const bodyClasses = computed(() => [
  'semi-modal-body',
  { 'semi-modal-withIcon': props.icon !== null && props.icon !== undefined },
]);

defineExpose({ element: dialogElement });
</script>

<template>
  <div
    :id="props.dialogId"
    class="semi-modal"
    :class="[
      props.outerClass,
      `semi-modal-${props.size}`,
      { 'semi-modal-centered': props.centered },
    ]"
    :style="outerStyle"
    @mousedown="emit('mousedown', $event)"
  >
    <ModalContentRenderer :render="props.modalRender">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="!props.headerProvided && hasDefaultHeader ? titleId : undefined"
        :aria-describedby="bodyId"
        :class="contentClasses"
        @animationend="emit('animationEnd', $event)"
      >
        <ModalNodeRenderer v-if="props.headerProvided" :content="props.header" />
        <div v-else-if="hasDefaultHeader" class="semi-modal-header">
          <span
            v-if="props.icon !== null && props.icon !== undefined"
            class="semi-modal-icon-wrapper"
            x-semi-prop="icon"
          >
            <ModalNodeRenderer :content="props.icon" />
          </span>
          <Title :id="titleId" :heading="5" class="semi-modal-title" x-semi-prop="title">
            <ModalNodeRenderer :content="props.title" />
          </Title>
          <Button
            v-if="props.closable"
            aria-label="close"
            class="semi-modal-close"
            type="tertiary"
            theme="borderless"
            size="small"
            @click="emit('close', $event)"
          >
            <template #icon>
              <ModalNodeRenderer
                v-if="props.closeIcon !== null && props.closeIcon !== undefined"
                :content="props.closeIcon"
              />
              <IconClose v-else x-semi-prop="closeIcon" />
            </template>
          </Button>
        </div>

        <div
          v-if="hasHeader"
          :id="bodyId"
          :class="bodyClasses"
          :style="props.bodyStyle"
          x-semi-prop="children"
        >
          <ModalNodeRenderer :content="props.body" />
        </div>
        <div v-else class="semi-modal-body-wrapper">
          <span
            v-if="props.icon !== null && props.icon !== undefined"
            class="semi-modal-icon-wrapper"
            x-semi-prop="icon"
          >
            <ModalNodeRenderer :content="props.icon" />
          </span>
          <div :id="bodyId" :class="bodyClasses" :style="props.bodyStyle" x-semi-prop="children">
            <ModalNodeRenderer :content="props.body" />
          </div>
          <Button
            v-if="props.closable"
            aria-label="close"
            class="semi-modal-close"
            type="tertiary"
            theme="borderless"
            size="small"
            @click="emit('close', $event)"
          >
            <template #icon>
              <ModalNodeRenderer
                v-if="props.closeIcon !== null && props.closeIcon !== undefined"
                :content="props.closeIcon"
              />
              <IconClose v-else x-semi-prop="closeIcon" />
            </template>
          </Button>
        </div>

        <div
          v-if="props.footer !== null && props.footer !== undefined"
          class="semi-modal-footer"
          x-semi-prop="footer"
        >
          <ModalNodeRenderer :content="props.footer" />
        </div>
      </div>
    </ModalContentRenderer>
  </div>
</template>
