<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  type HTMLAttributes,
  type StyleValue,
  type VNodeChild,
} from 'vue';
import { IconClose } from '@workspace/icons';

import { Button } from '../button';
import { Title } from '../typography';
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
  outerStyle?: StyleValue | undefined;
  outerClass?: HTMLAttributes['class'];
  size: ModalSize;
  title: VNodeChild;
  width?: string | number | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  animationEnd: [event: AnimationEvent];
  close: [event: MouseEvent];
  mousedown: [event: MouseEvent];
}>();
const dialogElement = useTemplateRef<HTMLDivElement>('dialog');
const hasDefaultHeader = computed(() => props.title !== null && props.title !== undefined);
const hasHeader = computed(() => props.headerProvided || hasDefaultHeader.value);
const outerStyle = computed<StyleValue>(() => [
  props.outerStyle,
  props.width === undefined ? undefined : { width: props.width },
  props.height === undefined ? undefined : { height: props.height },
  props.fullScreen ? { width: '100%', height: '100%', margin: 'unset' } : undefined,
]);
const contentClasses = computed(() => [
  'semi-modal-content',
  props.contentClass,
  {
    'semi-modal-content-fullScreen': props.fullScreen,
    'semi-modal-content-height-set': props.height !== undefined,
  },
]);
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
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="semi-modal-title"
      aria-describedby="semi-modal-body"
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
        <Title id="semi-modal-title" :heading="5" class="semi-modal-title" x-semi-prop="title">
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
        id="semi-modal-body"
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
        <div :class="bodyClasses" :style="props.bodyStyle" x-semi-prop="children">
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
  </div>
</template>
