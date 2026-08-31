<script setup lang="ts">
import { IconClose, IconCopyStroked } from '@aifuxi/semi-icons-vue';
import { computed, getCurrentInstance, onBeforeUnmount, useSlots, useTemplateRef } from 'vue';

import { Button } from '../button';
import { semiGlobal } from '../config-provider';
import { LocaleConsumer } from '../locale';
import { ToastFactory } from '../toast';
import SidebarCodeItem from './SidebarCodeItem.vue';
import SidebarContainer from './SidebarContainer.vue';
import SidebarFileItem from './SidebarFileItem.vue';
import SidebarNodeRenderer from './SidebarNodeRenderer';
import SidebarOptions from './SidebarOptions.vue';
import type {
  SidebarContainerExposed,
  SidebarEmits,
  SidebarLocale,
  SidebarMode,
  SidebarProps,
  SidebarSlots,
} from './types';

defineOptions({ name: 'Sidebar', inheritAttrs: false });
const props = defineProps<SidebarProps>();
const emit = defineEmits<SidebarEmits>();
defineSlots<SidebarSlots>();
const slots = useSlots();
const instance = getCurrentInstance();
const containerComponent = useTemplateRef<SidebarContainerExposed>('containerComponent');
const toast = ToastFactory.create({
  getPopupContainer: () => containerComponent.value?.getContainerElement() ?? document.body,
});

function hasRawProp(key: keyof SidebarProps): boolean {
  const raw = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

function resolved<Key extends keyof SidebarProps>(
  key: Key,
  fallback: NonNullable<SidebarProps[Key]>,
): NonNullable<SidebarProps[Key]> {
  const explicitValue = props[key];
  if (hasRawProp(key) && props[key] !== undefined) {
    return explicitValue as NonNullable<SidebarProps[Key]>;
  }
  const configured = semiGlobal.config.overrideDefaultProps?.Sidebar?.[key];
  return (configured === undefined ? fallback : configured) as NonNullable<SidebarProps[Key]>;
}

const mode = computed<SidebarMode>(() => resolved('mode', 'main'));
const fileEditable = computed(() => resolved('fileEditable', true));
const mainContent = computed(
  () =>
    slots['main-content']?.({ activeKey: props.activeKey }) ??
    props.renderMainContent?.(props.activeKey),
);
const detailContent = computed(
  () => slots['detail-content']?.({ mode: mode.value }) ?? props.renderDetailContent?.(mode.value),
);
const detailHeader = computed(
  () =>
    slots['detail-header']?.({ mode: mode.value, detailContent: props.detailContent }) ??
    props.renderDetailHeader?.(mode.value, props.detailContent),
);
const containerBindings = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    Object.entries({
      title: mode.value === 'main' ? props.title : undefined,
      visible: props.visible,
      motion: props.motion,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      resizable: props.resizable,
      defaultSize: props.defaultSize,
      showClose: props.showClose,
      closeOnEsc: props.closeOnEsc,
      style: props.style,
      containerRef: props.containerRef,
    }).filter(([, value]) => value !== undefined),
  ),
);
const optionsBindings = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    Object.entries({
      activeKey: props.activeKey,
      options: props.options,
      renderOptionItem: props.renderOptionItem,
    }).filter(([, value]) => value !== undefined),
  ),
);
const codeDetailBindings = computed<Record<string, unknown>>(() => {
  const detail = (props.detailContent ?? {}) as Record<string, unknown>;
  const rest = Object.fromEntries(Object.entries(detail).filter(([key]) => key !== 'key'));
  return {
    ...rest,
    jsonViewerProps: {
      ...((detail.jsonViewerProps as Record<string, unknown> | undefined) ?? {}),
      height: '100%',
    },
  };
});
const fileDetailBindings = computed<Record<string, unknown>>(() => ({
  ...Object.fromEntries(
    Object.entries((props.detailContent ?? {}) as Record<string, unknown>).filter(
      ([key]) => key !== 'key',
    ),
  ),
  ...(props.imgUploadProps === undefined ? {} : { imgUploadProps: props.imgUploadProps }),
  editable: fileEditable.value,
}));

function handleCancel(event: MouseEvent | KeyboardEvent): void {
  emit('cancel', event);
}
function handleVisibleChange(visible: boolean): void {
  emit('after-visible-change', visible);
}
function handleOptionChange(event: MouseEvent, activeKey: string): void {
  emit('active-option-change', event, activeKey);
}
function handleBack(event: MouseEvent): void {
  emit('back-ward', event, 'main');
}
function writeToClipboard(content: string): boolean {
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  let result: boolean;
  try {
    result = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    result = false;
  }
  textarea.remove();
  if (result) return true;
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(content);
    return true;
  }
  return false;
}
function handleCopy(event: MouseEvent, locale: SidebarLocale | undefined): void {
  const content = String((props.detailContent as { content?: unknown } | undefined)?.content ?? '');
  const result = writeToClipboard(content);
  if (result) toast.success({ content: locale?.copySuccess ?? 'Copied' });
  emit('detail-content-copy', event, content, result);
}
function handleFileContentChange(content: string): void {
  emit('file-content-change', content);
}

onBeforeUnmount(() => toast.destroyAll());
</script>

<template>
  <LocaleConsumer v-slot="{ localeData }" component-name="Sidebar">
    <SidebarContainer
      v-bind="containerBindings"
      ref="containerComponent"
      :class="[
        props.class,
        props.className,
        mode === 'main' ? 'semi-sidebar-main' : 'semi-sidebar-detail',
      ]"
      @cancel="handleCancel"
      @after-visible-change="handleVisibleChange"
    >
      <template v-if="mode === 'main' && $slots.title" #title><slot name="title" /></template>
      <template #header>
        <template v-if="mode !== 'main'">
          <SidebarNodeRenderer v-if="detailHeader" :content="detailHeader" />
          <div v-else class="semi-sidebar-detail-header">
            <span class="semi-sidebar-detail-header-left">
              <Button theme="borderless" type="tertiary" aria-label="back" @click="handleBack"
                ><template #icon><IconClose /></template
              ></Button>
              <span class="semi-sidebar-detail-header-title">
                {{ (props.detailContent as { name?: string } | undefined)?.name }}
              </span>
            </span>
            <span class="semi-sidebar-detail-header-right">
              <Button
                theme="borderless"
                type="tertiary"
                aria-label="copy"
                @click="handleCopy($event, localeData as SidebarLocale | undefined)"
                ><template #icon><IconCopyStroked /></template
              ></Button>
            </span>
          </div>
        </template>
      </template>

      <div v-if="mode === 'main'" class="semi-sidebar-main-content-wrapper">
        <SidebarOptions v-bind="optionsBindings" @change="handleOptionChange">
          <template v-if="$slots.option" #option="slotProps"
            ><slot name="option" v-bind="slotProps"
          /></template>
        </SidebarOptions>
        <div class="semi-sidebar-main-content"><SidebarNodeRenderer :content="mainContent" /></div>
      </div>
      <SidebarNodeRenderer v-else-if="detailContent" :content="detailContent" />
      <SidebarCodeItem v-else-if="mode === 'code'" v-bind="codeDetailBindings" />
      <SidebarFileItem
        v-else-if="mode === 'file'"
        v-bind="fileDetailBindings"
        @content-change="handleFileContentChange"
      />
    </SidebarContainer>
  </LocaleConsumer>
</template>
