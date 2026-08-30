<script setup lang="ts">
import {
  getUploadFileSize,
  UploadFileCardFoundation,
  type UploadFileCardAdapter,
} from '@workspace/foundation-integration';
import {
  IconAlertCircle,
  IconClear,
  IconClose,
  IconFile,
  IconRefresh,
} from '@aifuxi/semi-icons-vue';
import { computed, markRaw, shallowReactive, type CSSProperties } from 'vue';

import Button from '../button/Button.vue';
import Progress from '../progress/Progress.vue';
import Spin from '../spin/Spin.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import Text from '../typography/Text.vue';
import UploadNodeRenderer from './UploadNodeRenderer';
import type { UploadFileCardProps, UploadLocale, UploadRenderFileItemProps } from './types';

defineOptions({ name: 'UploadFileCard', inheritAttrs: false });
const props = defineProps<UploadFileCardProps>();

const locale = computed<UploadLocale>(
  () =>
    props._locale ?? {
      mainText: '点击上传文件或拖拽文件到这里',
      illegalTips: '不支持此类型文件',
      legalTips: '松手开始上传',
      retry: '重试',
      replace: '替换文件',
      clear: '清空',
      selectedFiles: '已选择文件',
      illegalSize: '文件尺寸不合法',
      fail: '上传失败',
      cropTitle: '裁切图片',
      cropOk: '确定',
      cropCancel: '取消',
    },
);

interface FileCardState {
  fallbackPreview: boolean;
}
const state = shallowReactive<FileCardState>({ fallbackPreview: false });
const renderProps = computed<UploadFileCardProps>(() => ({
  ...(props as unknown as UploadFileCardProps),
  disabled: props.disabled ?? false,
  index: props.index ?? 0,
  listType: props.listType ?? 'list',
  name: props.name ?? '',
  onRemove: props.onRemove ?? (() => undefined),
  onReplace: props.onReplace ?? (() => undefined),
  onRetry: props.onRetry ?? (() => undefined),
  showPicInfo: props.showPicInfo ?? false,
  size: props.size ?? '',
  status: props.status ?? 'wait',
  uid: props.uid ?? '',
}));
const renderCallbackProps = computed<UploadRenderFileItemProps>(() => ({
  ...renderProps.value,
  key: props.uid ?? '',
}));
const adapter: UploadFileCardAdapter<UploadFileCardProps, FileCardState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => props[key as keyof UploadFileCardProps],
  getProps: () => renderProps.value,
  getState: (key) => state[key as keyof FileCardState],
  getStates: () => state,
  setState: (next, callback) => {
    Object.assign(state, next);
    callback?.();
  },
  getCache: () => undefined,
  getCaches: () => undefined,
  setCache: () => undefined,
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  updateFallbackPreview: (fallback) => {
    state.fallbackPreview = fallback;
  },
};
const foundation = markRaw(new UploadFileCardFoundation(adapter));

const isPicture = computed(() => props.listType === 'picture');
const showProgress = computed(
  () => props.status === 'uploading' && props.percent !== 100 && props.percent !== undefined,
);
const showRetry = computed(() => props.status === 'uploadFail' && (props.showRetry ?? true));
const showReplace = computed(() => props.status === 'success' && props.showReplace);
const showPreview = computed(() => props.status === 'success' && !props.showReplace);
const fileSize = computed(() =>
  typeof props.size === 'number' ? getUploadFileSize(props.size) : props.size,
);
const listClasses = computed(() => [
  'semi-upload-file-card',
  ['validateFail', 'uploadFail'].includes(props.status) ? 'semi-upload-file-card-fail' : null,
  typeof props.onPreviewClick === 'function' ? 'semi-upload-file-card-show-pointer' : null,
  props.className,
]);
const pictureClasses = computed(() => [
  'semi-upload-picture-file-card',
  state.fallbackPreview ? 'semi-upload-picture-file-card-preview-fallback' : null,
  props.disabled ? 'semi-upload-picture-file-card-disabled' : null,
  typeof props.onPreviewClick === 'function' ? 'semi-upload-picture-file-card-show-pointer' : null,
  props.status === 'uploadFail' ? 'semi-upload-picture-file-card-error' : null,
  showProgress.value ? 'semi-upload-picture-file-card-uploading' : null,
  typeof props.renderThumbnail === 'function' && props.picHeight && props.picWidth
    ? 'semi-upload-picture-file-card-custom-thumbnail'
    : null,
  props.className,
]);
const itemStyle = computed(() => [
  props.style,
  isPicture.value
    ? ({ height: props.picHeight, width: props.picWidth } satisfies CSSProperties)
    : undefined,
]);
const imageStyle = computed<CSSProperties>(() => ({
  height: props.picHeight,
  width: props.picWidth,
}));
const resolvedValidateMessage = computed(() => {
  if (props.validateMessage) return props.validateMessage;
  if (props.status === 'uploadFail') return locale.value.fail;
  if (props._sizeInvalid) return locale.value.illegalSize;
  return undefined;
});

function stopAndRun(event: MouseEvent, handler: () => void): void {
  event.stopPropagation();
  handler();
}

function handleImageError(event: Event): void {
  foundation.handleImageError(event);
}
</script>

<template>
  <div
    v-if="isPicture"
    role="listitem"
    :class="pictureClasses"
    :style="itemStyle"
    @click="props.onPreviewClick?.()"
  >
    <UploadNodeRenderer
      v-if="props.renderThumbnail"
      :content="props.renderThumbnail(renderCallbackProps)"
    />
    <img
      v-else-if="!state.fallbackPreview"
      :src="props.url"
      :alt="props.name"
      :style="imageStyle"
      @error="handleImageError"
    />
    <IconFile v-else size="large" />

    <Progress
      v-if="showProgress"
      :percent="props.percent ?? 0"
      type="circle"
      size="small"
      orbit-stroke="#FFF"
      aria-label="uploading file progress"
    />

    <div
      v-if="showRetry"
      role="button"
      tabindex="0"
      class="semi-upload-picture-file-card-retry"
      @click="stopAndRun($event, props.onRetry)"
    >
      <IconRefresh class="semi-upload-picture-file-card-icon-retry" />
    </div>

    <Tooltip
      v-if="showReplace"
      trigger="hover"
      position="top"
      :content="locale.replace"
      :show-arrow="false"
      :spacing="4"
    >
      <div
        role="button"
        tabindex="0"
        class="semi-upload-picture-file-card-replace"
        @click="stopAndRun($event, props.onReplace)"
      >
        <svg
          class="semi-upload-picture-file-card-icon-replace"
          focusable="false"
          aria-hidden="true"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle cx="14" cy="14" r="14" fill="#16161A" fill-opacity="0.6" />
          <path
            d="M9 10.25V18.25L10.25 13.25H17.875V11.75C17.875 11.4739 17.6511 11.25 17.375 11.25H14L12.75 9.75H9.5C9.22386 9.75 9 9.97386 9 10.25Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 18.25L19 13.25H10.2031L9 18.25H18Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </Tooltip>

    <div v-if="showPreview" class="semi-upload-picture-file-card-preview">
      <UploadNodeRenderer
        v-if="props.renderPicPreviewIcon"
        :content="props.renderPicPreviewIcon(renderCallbackProps)"
      />
    </div>

    <UploadNodeRenderer
      v-if="props.showPicInfo && props.renderPicInfo"
      :content="props.renderPicInfo(renderCallbackProps)"
    />
    <div v-else-if="props.showPicInfo" class="semi-upload-picture-file-card-pic-info">
      {{ props.index + 1 }}
    </div>

    <UploadNodeRenderer
      v-if="!props.disabled && props.renderPicClose"
      :content="
        props.renderPicClose({
          className: 'semi-upload-picture-file-card-close',
          remove: (event) => stopAndRun(event, props.onRemove),
        })
      "
    />
    <div
      v-else-if="!props.disabled"
      role="button"
      tabindex="0"
      class="semi-upload-picture-file-card-close"
      @click="stopAndRun($event, props.onRemove)"
    >
      <IconClear class="semi-upload-picture-file-card-icon-close" />
    </div>

    <Tooltip
      v-if="resolvedValidateMessage"
      :content="resolvedValidateMessage"
      trigger="hover"
      position="bottom"
    >
      <span
        v-if="props.status === 'validating'"
        class="semi-upload-tooltip-children-wrapper semi-upload-picture-file-card-icon-loading"
      >
        <Spin size="small" />
      </span>
      <div v-else class="semi-upload-picture-file-card-icon-error">
        <svg
          focusable="false"
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="8" cy="8" r="6.66667" fill="white" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.3332 8.00008C15.3332 12.0502 12.0499 15.3334 7.99984 15.3334C3.94975 15.3334 0.666504 12.0502 0.666504 8.00008C0.666504 3.94999 3.94975 0.666748 7.99984 0.666748C12.0499 0.666748 15.3332 3.94999 15.3332 8.00008ZM8.99984 11.6667C8.99984 11.1145 8.55212 10.6667 7.99984 10.6667C7.44755 10.6667 6.99984 11.1145 6.99984 11.6667C6.99984 12.219 7.44755 12.6667 7.99984 12.6667ZM7.99984 3.33341C7.27573 3.33341 6.7003 3.94171 6.74046 4.66469L6.94437 8.33495C6.97549 8.89513 7.4388 9.33341 7.99984 9.33341C8.56087 9.33341 9.02419 8.89513 9.05531 8.33495L9.25921 4.66469C9.29938 3.94171 8.72394 3.33341 7.99984 3.33341Z"
            fill="#F93920"
          />
        </svg>
      </div>
    </Tooltip>
  </div>

  <div
    v-else-if="props.listType === 'list'"
    role="listitem"
    :class="listClasses"
    :style="props.style"
    @click="props.onPreviewClick?.()"
  >
    <div
      :class="[
        'semi-upload-file-card-preview',
        !props.preview || typeof props.previewFile === 'function' || state.fallbackPreview
          ? 'semi-upload-file-card-preview-placeholder'
          : null,
      ]"
    >
      <UploadNodeRenderer
        v-if="props.previewFile"
        :content="props.previewFile(renderCallbackProps)"
      />
      <img
        v-else-if="props.preview && !state.fallbackPreview"
        :src="props.url"
        :alt="props.name"
        @error="handleImageError"
      />
      <IconFile v-else size="large" />
    </div>

    <div class="semi-upload-file-card-info-main">
      <div class="semi-upload-file-card-info-main-text">
        <Text
          class="semi-upload-file-card-info-name"
          :ellipsis="{ showTooltip: props.showTooltip ?? true }"
        >
          {{ props.name }}
        </Text>
        <span>
          <span class="semi-upload-file-card-info-size">{{ fileSize }}</span>
          <Tooltip
            v-if="showReplace"
            trigger="hover"
            position="top"
            :show-arrow="false"
            :content="locale.replace"
          >
            <span class="semi-upload-tooltip-children-wrapper semi-upload-file-card-replace">
              <Button
                type="tertiary"
                theme="borderless"
                size="small"
                @click="stopAndRun($event, props.onReplace)"
              >
                <template #icon>
                  <svg
                    focusable="false"
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 17V7.58824C6 7.26336 6.26863 7 6.6 7H10.5L12 8.76471H16.05C16.3814 8.76471 16.65 9.02806 16.65 9.35294V11.1176H7.5L6 17ZM6 17L7.44375 11.1176H18L16.8 17L6 17Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
              </Button>
            </span>
          </Tooltip>
        </span>
      </div>

      <Progress
        v-if="showProgress"
        :percent="props.percent ?? 0"
        :style="{ width: '100%' }"
        aria-label="uploading file progress"
      />

      <div class="semi-upload-file-card-info-main-control">
        <span class="semi-upload-file-card-info-validate-message">
          <template v-if="typeof resolvedValidateMessage === 'string'">
            <Spin
              v-if="props.status === 'validating'"
              size="small"
              wrapper-class-name="semi-upload-file-card-icon-loading"
            />
            <IconAlertCircle v-else class="semi-upload-file-card-icon-error" />
            {{ resolvedValidateMessage }}
          </template>
          <UploadNodeRenderer
            v-else-if="resolvedValidateMessage"
            :content="resolvedValidateMessage"
          />
        </span>
        <span
          v-if="showRetry"
          role="button"
          tabindex="0"
          class="semi-upload-file-card-info-retry"
          @click="stopAndRun($event, props.onRetry)"
        >
          {{ locale.retry }}
        </span>
      </div>
    </div>

    <UploadNodeRenderer
      v-if="props.renderFileOperation"
      :content="props.renderFileOperation(renderCallbackProps)"
    />
    <Button
      v-else
      type="tertiary"
      theme="borderless"
      size="small"
      class="semi-upload-file-card-close"
      @click="stopAndRun($event, props.onRemove)"
    >
      <template #icon><IconClose /></template>
    </Button>
  </div>
</template>
