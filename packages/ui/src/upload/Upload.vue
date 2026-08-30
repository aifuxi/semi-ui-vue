<script setup lang="ts">
import {
  UploadFoundation,
  type UploadAdapter,
  type UploadFoundationError,
  type UploadFoundationFileItem,
} from '@workspace/foundation-integration';
import { IconPlus, IconUpload } from '@workspace/icons';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Cropper from '../cropper/Cropper.vue';
import type { CropperMethods } from '../cropper';
import Modal from '../modal/Modal.vue';
import UploadFileCard from './UploadFileCard.vue';
import UploadNodeRenderer from './UploadNodeRenderer';
import type {
  UploadAfterResult,
  UploadBeforeResult,
  UploadChangePayload,
  UploadCustomFile,
  UploadEmits,
  UploadExposed,
  UploadFileItem,
  UploadLocale,
  UploadProps,
  UploadRenderFileItemProps,
  UploadRenderFileListTitleProps,
  UploadSlots,
} from './types';

const ZH_CN_UPLOAD_LOCALE: Readonly<UploadLocale> = Object.freeze({
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
});
const EN_US_UPLOAD_LOCALE: Readonly<UploadLocale> = Object.freeze({
  mainText: 'Click to Upload File or Drag File to here',
  illegalTips: 'This type of file is not supported',
  legalTips: 'Release and start uploading',
  retry: 'Retry',
  replace: 'Replace File',
  clear: 'Clear',
  selectedFiles: 'Selected Files',
  illegalSize: 'Illegal file size',
  fail: 'Upload fail',
  cropTitle: 'Crop Image',
  cropOk: 'OK',
  cropCancel: 'Cancel',
});

defineOptions({ name: 'Upload', inheritAttrs: false });
const props = withDefaults(defineProps<UploadProps>(), {
  addOnPasting: false,
  beforeClear: () => true,
  beforeRemove: () => true,
  defaultFileList: () => [],
  directory: false,
  disabled: false,
  draggable: false,
  hotSpotLocation: 'end',
  listType: 'list',
  multiple: false,
  promptPosition: 'right',
  showClear: true,
  showPicInfo: false,
  showReplace: false,
  showRetry: true,
  showTooltip: true,
  showUploadList: true,
  uploadTrigger: 'auto',
  withCredentials: false,
});
const emit = defineEmits<UploadEmits>();
defineSlots<UploadSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const inputRef = useTemplateRef<HTMLInputElement>('inputRef');
const replaceInputRef = useTemplateRef<HTMLInputElement>('replaceInputRef');
const cropperRef = useTemplateRef<CropperMethods>('cropperRef');

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveDefaultTrue(name: 'showClear' | 'showRetry' | 'showTooltip' | 'showUploadList') {
  return hasRawProp(name) ? props[name] !== false : true;
}

const showClear = computed(() => resolveDefaultTrue('showClear'));
const showRetry = computed(() => resolveDefaultTrue('showRetry'));
const showTooltip = computed(() =>
  hasRawProp('showTooltip') ? props.showTooltip !== false && props.showTooltip : true,
);
const showUploadList = computed(() => resolveDefaultTrue('showUploadList'));
const fileListControlled = computed(() => hasRawProp('fileList'));
const modelControlled = computed(() => hasRawProp('modelValue'));
const controlled = computed(() => fileListControlled.value || modelControlled.value);
const incomingFileList = computed(() =>
  modelControlled.value
    ? (props.modelValue ?? [])
    : fileListControlled.value
      ? (props.fileList ?? [])
      : undefined,
);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);
const locale = computed<UploadLocale>(() => {
  const fallback = config.value.locale.code === 'en-US' ? EN_US_UPLOAD_LOCALE : ZH_CN_UPLOAD_LOCALE;
  return {
    ...fallback,
    ...(config.value.locale.Upload as Partial<UploadLocale> | undefined),
  };
});

interface UploadState {
  croppedFiles: File[];
  dragAreaStatus: 'default' | 'legal' | 'illegal';
  fileList: UploadFileItem[];
  inputKey: number;
  isReplaceOperation: boolean;
  localUrls: string[];
  nonImageFiles: File[];
  pendingImageFiles: File[];
  replaceIdx: number;
  replaceInputKey: number;
}

const state = shallowReactive<UploadState>({
  croppedFiles: [],
  dragAreaStatus: 'default',
  fileList: [...(incomingFileList.value ?? props.defaultFileList)],
  inputKey: 0,
  isReplaceOperation: false,
  localUrls: [],
  nonImageFiles: [],
  pendingImageFiles: [],
  replaceIdx: -1,
  replaceInputKey: 0,
});
const visibleFileList = computed(() =>
  controlled.value ? [...(incomingFileList.value ?? [])] : state.fileList,
);
watch(incomingFileList, (fileList) => {
  if (controlled.value) state.fileList = [...(fileList ?? [])];
});

type FoundationProps = UploadProps & {
  addOnPasting: boolean;
  beforeClear: NonNullable<UploadProps['beforeClear']>;
  beforeRemove: NonNullable<UploadProps['beforeRemove']>;
  disabled: boolean;
  fileList: UploadFileItem[];
  listType: NonNullable<UploadProps['listType']>;
  multiple: boolean;
  showClear: boolean;
  showRetry: boolean;
  showUploadList: boolean;
  uploadTrigger: NonNullable<UploadProps['uploadTrigger']>;
  withCredentials: boolean;
};

function getFoundationProps(): FoundationProps {
  return {
    ...props,
    addOnPasting: props.addOnPasting,
    beforeClear: props.beforeClear,
    beforeRemove: props.beforeRemove,
    disabled: props.disabled,
    fileList: state.fileList,
    listType: props.listType,
    multiple: props.multiple,
    showClear: showClear.value,
    showRetry: showRetry.value,
    showUploadList: showUploadList.value,
    uploadTrigger: props.uploadTrigger,
    withCredentials: props.withCredentials,
  } as unknown as FoundationProps;
}

const cache = new Map<unknown, unknown>();
const pastingHandler = shallowRef<((event: KeyboardEvent | ClipboardEvent) => void) | null>(null);
const pasteEventHandler = shallowRef<((event: ClipboardEvent) => void) | null>(null);

function cloneFileList(fileList: UploadFoundationFileItem[]): UploadFileItem[] {
  return fileList.map((item) => ({ ...item })) as UploadFileItem[];
}

const adapter: UploadAdapter<FoundationProps, UploadState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof UploadState],
  getStates: () => state,
  setState: (next, callback) => {
    Object.assign(state, next);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyFileSelect: (files) => emit('fileChange', files),
  notifyError: (error, file, fileList, xhr) =>
    emit(
      'error',
      error as UploadFoundationError,
      file as UploadCustomFile,
      cloneFileList(fileList),
      xhr,
    ),
  notifySuccess: (body, file, fileList) =>
    emit('success', body, file as UploadCustomFile, cloneFileList(fileList)),
  notifyProgress: (percent, file, fileList) =>
    emit('progress', percent, file as UploadCustomFile, cloneFileList(fileList)),
  notifyRemove: (file, fileList, fileItem) =>
    emit('remove', file as UploadCustomFile, cloneFileList(fileList), {
      ...fileItem,
    } as UploadFileItem),
  notifySizeError: (file, fileList) =>
    emit('sizeError', file as UploadCustomFile, cloneFileList(fileList)),
  notifyExceed: (files) => emit('exceed', files),
  updateFileList: (fileList, callback) => {
    state.fileList = cloneFileList(fileList);
    callback?.();
  },
  notifyBeforeUpload: ({ file, fileList }) =>
    (props.beforeUpload?.({
      file: { ...file } as UploadFileItem,
      fileList: cloneFileList(fileList),
    }) ?? true) as boolean | UploadBeforeResult | Promise<UploadBeforeResult>,
  notifyAfterUpload: ({ response, file, fileList }) =>
    (props.afterUpload?.({
      response,
      file: { ...file } as UploadFileItem,
      fileList: cloneFileList(fileList),
    }) ?? {}) as UploadAfterResult,
  resetInput: () => {
    state.inputKey += 1;
  },
  resetReplaceInput: () => {
    state.replaceInputKey += 1;
  },
  updateDragAreaStatus: (status) => {
    state.dragAreaStatus = status as UploadState['dragAreaStatus'];
  },
  notifyBeforeRemove: (file, fileList) =>
    props.beforeRemove({ ...file } as UploadFileItem, cloneFileList(fileList)),
  notifyBeforeClear: (fileList) => props.beforeClear(cloneFileList(fileList)),
  notifyChange: ({ currentFile, fileList }) => {
    const payload: UploadChangePayload = {
      fileList: cloneFileList(fileList),
      ...(currentFile !== undefined
        ? { currentFile: currentFile ? ({ ...currentFile } as UploadFileItem) : currentFile }
        : {}),
    };
    emit('change', payload);
    emit('update:fileList', payload.fileList);
    emit('update:modelValue', payload.fileList);
  },
  updateLocalUrls: (urls) => {
    state.localUrls = [...urls];
  },
  notifyClear: () => emit('clear'),
  notifyPreviewClick: (file) => emit('previewClick', { ...file } as UploadFileItem),
  notifyDrop: (event, files, fileList) => emit('drop', event, files, cloneFileList(fileList)),
  notifyAcceptInvalid: (files) => emit('acceptInvalid', files),
  registerPastingHandler: (callback) => {
    if (typeof document === 'undefined' || !callback) return;
    const wrapped = (event: KeyboardEvent | ClipboardEvent) => {
      if (props.crop && event.type === 'keydown' && 'code' in event) {
        const combineKey = adapter.isMac() ? event.metaKey : event.ctrlKey;
        if (combineKey && event.code === 'KeyV' && 'clipboard' in navigator) {
          void readClipboardImagesForCrop();
          return;
        }
      }
      callback(event);
    };
    document.body.addEventListener('keydown', wrapped);
    pastingHandler.value = wrapped;
  },
  unRegisterPastingHandler: () => {
    if (typeof document !== 'undefined' && pastingHandler.value) {
      document.body.removeEventListener('keydown', pastingHandler.value);
    }
    pastingHandler.value = null;
  },
  registerPasteEventHandler: (callback) => {
    if (typeof document === 'undefined' || !callback) return;
    const wrapped = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.items ?? [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => Boolean(file));
      if (props.crop && files.some(isImageFile)) {
        event.preventDefault();
        void handleCropFiles(files);
        return;
      }
      callback(event);
    };
    document.body.addEventListener('paste', wrapped);
    pasteEventHandler.value = wrapped;
  },
  unRegisterPasteEventHandler: () => {
    if (typeof document !== 'undefined' && pasteEventHandler.value) {
      document.body.removeEventListener('paste', pasteEventHandler.value);
    }
    pasteEventHandler.value = null;
  },
  isMac: () => typeof navigator !== 'undefined' && /MAC/i.test(navigator.platform),
  notifyPastingError: (error) => emit('pastingError', error),
};
const foundation = markRaw(new UploadFoundation<FoundationProps, UploadState>(adapter));
onMounted(() => foundation.init());
onBeforeUnmount(() => {
  foundation.destroy();
  if (cropSource.value) URL.revokeObjectURL(cropSource.value);
});

const rootClasses = computed(() => [
  'semi-upload',
  props.listType === 'picture' ? 'semi-upload-picture' : null,
  props.disabled ? 'semi-upload-disabled' : null,
  props.validateStatus ? `semi-upload-${props.validateStatus}` : null,
  config.value.direction === 'rtl' ? 'semi-rtl' : null,
  props.className,
  props.class,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) =>
        !['class', 'style'].includes(name) &&
        (name.startsWith('data-') || name.startsWith('aria-')),
    ),
  ),
);
const directoryAttrs = computed(() =>
  props.directory ? { directory: 'directory', webkitdirectory: 'webkitdirectory' } : {},
);
const showPictureAdd = computed(() =>
  props.limit === undefined ? true : props.limit > visibleFileList.value.length,
);
const showListTitle = computed(() => props.limit !== 1 && visibleFileList.value.length > 0);
const pictureAddClasses = computed(() => [
  'semi-upload-add',
  'semi-upload-picture-add',
  props.disabled ? 'semi-upload-picture-add-disabled' : null,
  props.draggable && state.dragAreaStatus === 'legal' ? 'semi-upload-drag-area-legal' : null,
  props.draggable && state.dragAreaStatus === 'illegal' ? 'semi-upload-drag-area-illegal' : null,
]);
const dragAreaClasses = computed(() => [
  'semi-upload-drag-area',
  state.dragAreaStatus === 'legal' ? 'semi-upload-drag-area-legal' : null,
  state.dragAreaStatus === 'illegal' ? 'semi-upload-drag-area-illegal' : null,
  slots.default ? 'semi-upload-drag-area-custom' : null,
]);

function openFileDialog(): void {
  if (props.disabled || !inputRef.value) return;
  inputRef.value.click();
  emit('openFileDialog');
}

function handleInputChange(event: Event): void {
  const files = (event.target as HTMLInputElement).files;
  if (files?.length) foundation.handleChange(files);
}

function handleReplaceInputChange(event: Event): void {
  const files = (event.target as HTMLInputElement).files;
  if (!files?.length) return;
  const fileList = Array.from(files);
  if (props.crop && fileList.some(isImageFile)) {
    void handleCropFiles(fileList, true);
    return;
  }
  foundation.handleReplaceChange(files);
}

function remove(file: UploadFileItem): void {
  foundation.handleRemove(file as UploadFoundationFileItem);
}

function clear(): void {
  foundation.handleClear();
}

function replace(index: number): void {
  if (props.disabled) return;
  state.replaceIdx = index;
  nextTick(() => replaceInputRef.value?.click());
}

function insert(files: UploadCustomFile[], index?: number): void {
  foundation.insertFileToList(files, index);
}

function upload(): void {
  foundation.manualUpload();
}

function handleDrop(event: DragEvent): void {
  const files = Array.from(event.dataTransfer?.files ?? []);
  if (props.crop && !props.disabled && !props.directory && files.some(isImageFile)) {
    event.preventDefault();
    event.stopPropagation();
    state.dragAreaStatus = 'default';
    emit('drop', event, files, [...state.fileList]);
    void handleCropFiles(files);
    return;
  }
  foundation.handleDrop(event);
}

function handleDragOver(event: DragEvent): void {
  foundation.handleDragOver(event);
}

function handleDragLeave(event: DragEvent): void {
  foundation.handleDragLeave(event);
}

function handleDragEnter(event: DragEvent): void {
  foundation.handleDragEnter(event);
}

function fileCardProps(file: UploadFileItem, index: number): UploadRenderFileItemProps {
  const validateMessage =
    file.validateMessage ??
    (file.status === 'uploadFail'
      ? locale.value.fail
      : file._sizeInvalid
        ? locale.value.illegalSize
        : undefined);
  const output = {
    ...file,
    index,
    key: file.uid || `${file.name}${index}`,
    listType: props.listType,
    disabled: props.disabled,
    onRemove: () => remove(file),
    onRetry: () => {
      emit('retry', file);
      foundation.retry(file as UploadFoundationFileItem);
    },
    onReplace: () => replace(index),
    ...(props.renderFileOperation ? { renderFileOperation: props.renderFileOperation } : {}),
    ...(props.renderPicClose ? { renderPicClose: props.renderPicClose } : {}),
    ...(props.renderPicInfo ? { renderPicInfo: props.renderPicInfo } : {}),
    ...(props.renderPicPreviewIcon ? { renderPicPreviewIcon: props.renderPicPreviewIcon } : {}),
    ...(props.renderThumbnail ? { renderThumbnail: props.renderThumbnail } : {}),
    ...(props.previewFile ? { previewFile: props.previewFile } : {}),
    ...(props.itemStyle ? { style: props.itemStyle } : {}),
    ...(hasRawProp('onPreviewClick')
      ? { onPreviewClick: () => foundation.handlePreviewClick(file as UploadFoundationFileItem) }
      : {}),
    showPicInfo: props.showPicInfo,
    showReplace: file.showReplace ?? props.showReplace,
    showRetry: file.showRetry ?? showRetry.value,
    showTooltip: showTooltip.value,
  } as UploadRenderFileItemProps;
  if (props.picHeight !== undefined) output.picHeight = props.picHeight;
  if (props.picWidth !== undefined) output.picWidth = props.picWidth;
  if (validateMessage !== undefined) output.validateMessage = validateMessage;
  return output;
}

function renderFileItem(file: UploadFileItem, index: number): VNodeChild | undefined {
  const cardProps = fileCardProps(file, index);
  return slots.fileItem?.(cardProps) ?? props.renderFileItem?.(cardProps);
}

const fileRenderEntries = computed(() =>
  visibleFileList.value.map((file, index) => ({
    file,
    cardProps: fileCardProps(file, index),
    content: renderFileItem(file, index),
  })),
);

function fileListTitleProps(): UploadRenderFileListTitleProps {
  return {
    fileList: [...visibleFileList.value],
    onClear: clear,
    clearText: locale.value.clear,
  };
}

function renderFileListTitle(): VNodeChild | undefined {
  const titleProps = fileListTitleProps();
  return (
    slots.fileListTitle?.(titleProps) ??
    (typeof props.fileListTitle === 'function' ? props.fileListTitle(titleProps) : undefined)
  );
}

const renderedFileListTitle = computed(() => renderFileListTitle());

const cropVisible = shallowRef(false);
const cropFile = shallowRef<File | null>(null);
const cropSource = shallowRef('');

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

function dispatchCroppedFiles(files: File[], isReplaceOperation: boolean): void {
  if (isReplaceOperation) foundation.handleReplaceChange(files);
  else foundation.handleChange(files);
}

async function shouldCropFile(file: File, files: File[]): Promise<boolean> {
  if (!props.beforeCrop) return true;
  try {
    return (await props.beforeCrop(file, files)) !== false;
  } catch (error) {
    const resolved = error instanceof Error ? error : new Error(String(error));
    props.onCropError?.(resolved);
    emit('cropError', resolved);
    return false;
  }
}

async function handleCropFiles(files: File[], isReplaceOperation = false): Promise<void> {
  const imageFiles = files.filter(isImageFile);
  const nonImageFiles = files.filter((file) => !isImageFile(file));
  const first = imageFiles[0];
  if (!props.crop || !first) {
    dispatchCroppedFiles(files, isReplaceOperation);
    return;
  }
  if (!(await shouldCropFile(first, files))) {
    dispatchCroppedFiles(files, isReplaceOperation);
    return;
  }
  const queue = isReplaceOperation ? [first] : imageFiles;
  const [current, ...pending] = queue;
  if (!current) return;
  cropFile.value = current;
  cropSource.value = URL.createObjectURL(current);
  state.pendingImageFiles = pending;
  state.nonImageFiles = isReplaceOperation ? [] : nonImageFiles;
  state.croppedFiles = [];
  state.isReplaceOperation = isReplaceOperation;
  cropVisible.value = true;
}

async function confirmCrop(): Promise<void> {
  if (!cropFile.value || !cropperRef.value) return;
  try {
    const canvas = cropperRef.value.getCropperCanvas();
    const config = typeof props.crop === 'object' ? props.crop : {};
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error('Failed to create blob'))),
        cropFile.value?.type || 'image/png',
        config.quality ?? 0.92,
      ),
    );
    const file = new File([blob], cropFile.value.name, {
      type: cropFile.value.type,
      lastModified: cropFile.value.lastModified,
    });
    const croppedFiles = [...state.croppedFiles, file];
    const next = state.pendingImageFiles[0];
    if (next) {
      if (cropSource.value) URL.revokeObjectURL(cropSource.value);
      cropFile.value = next;
      cropSource.value = URL.createObjectURL(next);
      state.pendingImageFiles = state.pendingImageFiles.slice(1);
      state.croppedFiles = croppedFiles;
      return;
    }
    const completedFiles = [...croppedFiles, ...state.nonImageFiles];
    const isReplaceOperation = state.isReplaceOperation;
    closeCrop();
    dispatchCroppedFiles(completedFiles, isReplaceOperation);
  } catch (error) {
    const resolved = error instanceof Error ? error : new Error(String(error));
    props.onCropError?.(resolved);
    emit('cropError', resolved);
  }
}

function closeCrop(): void {
  if (cropSource.value) URL.revokeObjectURL(cropSource.value);
  cropVisible.value = false;
  cropFile.value = null;
  cropSource.value = '';
  state.pendingImageFiles = [];
  state.nonImageFiles = [];
  state.croppedFiles = [];
  state.isReplaceOperation = false;
  state.inputKey += 1;
  state.replaceInputKey += 1;
}

async function handleInputWithCrop(event: Event): Promise<void> {
  const files = Array.from((event.target as HTMLInputElement).files ?? []);
  if (!files.length) return;
  await handleCropFiles(files);
}

async function readClipboardImagesForCrop(): Promise<void> {
  try {
    const permission = await navigator.permissions.query({
      name: 'clipboard-read' as Parameters<typeof navigator.permissions.query>[0]['name'],
    });
    if (permission.state !== 'granted' && permission.state !== 'prompt') {
      emit('pastingError', permission);
      return;
    }
    const clipboardItems = await navigator.clipboard.read();
    const files: File[] = [];
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types.filter((itemType) => itemType.startsWith('image/'))) {
        const blob = await clipboardItem.getType(type);
        const format = type.split('/')[1] ?? 'png';
        files.push(new File([await blob.arrayBuffer()], `paste.${format}`, { type }));
      }
    }
    if (files.length) await handleCropFiles(files);
  } catch (error) {
    emit('pastingError', error instanceof Error ? error : new Error(String(error)));
  }
}

defineExpose<UploadExposed>({ insert, upload, openFileDialog, clear, remove });
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    :x-prompt-pos="props.promptPosition"
  >
    <input
      :key="state.inputKey"
      ref="inputRef"
      v-bind="directoryAttrs"
      :capture="props.capture || undefined"
      :multiple="props.multiple"
      :accept="props.accept"
      type="file"
      autocomplete="off"
      tabindex="-1"
      class="semi-upload-hidden-input"
      @change="props.crop ? handleInputWithCrop($event) : handleInputChange($event)"
    />
    <input
      :key="state.replaceInputKey"
      ref="replaceInputRef"
      :accept="props.accept"
      type="file"
      autocomplete="off"
      tabindex="-1"
      class="semi-upload-hidden-input-replace"
      @change="handleReplaceInputChange"
    />

    <template v-if="props.listType !== 'picture'">
      <div
        v-if="props.draggable"
        role="button"
        tabindex="0"
        :aria-disabled="props.disabled"
        :class="dragAreaClasses"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @dragenter="handleDragEnter"
        @click="openFileDialog"
      >
        <slot v-if="slots.default" />
        <template v-else>
          <div class="semi-upload-drag-area-icon" x-semi-prop="dragIcon">
            <slot name="dragIcon">
              <UploadNodeRenderer v-if="props.dragIcon" :content="props.dragIcon" />
              <IconUpload v-else size="extra-large" />
            </slot>
          </div>
          <div class="semi-upload-drag-area-text">
            <div class="semi-upload-drag-area-main-text" x-semi-prop="dragMainText">
              <slot name="dragMainText">
                <UploadNodeRenderer v-if="props.dragMainText" :content="props.dragMainText" />
                <template v-else>{{ locale.mainText }}</template>
              </slot>
            </div>
            <div class="semi-upload-drag-area-sub-text" x-semi-prop="dragSubText">
              <slot name="dragSubText">
                <UploadNodeRenderer v-if="props.dragSubText" :content="props.dragSubText" />
              </slot>
            </div>
            <div class="semi-upload-drag-area-tips">
              <span
                v-if="state.dragAreaStatus === 'legal'"
                class="semi-upload-drag-area-tips-legal"
              >
                {{ locale.legalTips }}
              </span>
              <span
                v-if="state.dragAreaStatus === 'illegal'"
                class="semi-upload-drag-area-tips-illegal"
              >
                {{ locale.illegalTips }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <div
        v-else
        role="button"
        tabindex="0"
        :aria-disabled="props.disabled"
        class="semi-upload-add"
        @click="openFileDialog"
      >
        <slot />
      </div>
    </template>

    <div v-if="slots.prompt || props.prompt" class="semi-upload-prompt" x-semi-prop="prompt">
      <slot name="prompt"><UploadNodeRenderer :content="props.prompt" /></slot>
    </div>
    <div
      v-if="props.validateMessage"
      class="semi-upload-validate-message"
      x-semi-prop="validateMessage"
    >
      <UploadNodeRenderer :content="props.validateMessage" />
    </div>

    <template v-if="props.listType === 'picture'">
      <div
        v-if="showUploadList && visibleFileList.length"
        class="semi-upload-file-list semi-upload-picture-file-list"
      >
        <div class="semi-upload-file-list-main" role="list" aria-label="picture list">
          <div
            v-if="showPictureAdd && props.hotSpotLocation === 'start'"
            role="button"
            :class="pictureAddClasses"
            :style="{ height: props.picHeight, width: props.picWidth }"
            x-semi-prop="children"
            @click="openFileDialog"
            @drop="props.draggable ? handleDrop($event) : undefined"
            @dragover="props.draggable ? handleDragOver($event) : undefined"
            @dragleave="props.draggable ? handleDragLeave($event) : undefined"
            @dragenter="props.draggable ? handleDragEnter($event) : undefined"
          >
            <slot><IconPlus /></slot>
          </div>
          <template v-for="entry in fileRenderEntries" :key="entry.cardProps.key">
            <UploadNodeRenderer v-if="entry.content !== undefined" :content="entry.content" />
            <UploadFileCard v-else v-bind="entry.cardProps" :_locale="locale" />
          </template>
          <div
            v-if="showPictureAdd && props.hotSpotLocation === 'end'"
            role="button"
            :class="pictureAddClasses"
            :style="{ height: props.picHeight, width: props.picWidth }"
            x-semi-prop="children"
            @click="openFileDialog"
            @drop="props.draggable ? handleDrop($event) : undefined"
            @dragover="props.draggable ? handleDragOver($event) : undefined"
            @dragleave="props.draggable ? handleDragLeave($event) : undefined"
            @dragenter="props.draggable ? handleDragEnter($event) : undefined"
          >
            <slot><IconPlus /></slot>
          </div>
        </div>
      </div>
      <div
        v-else-if="showPictureAdd"
        role="button"
        :class="pictureAddClasses"
        :style="{ height: props.picHeight, width: props.picWidth }"
        x-semi-prop="children"
        @click="openFileDialog"
        @drop="props.draggable ? handleDrop($event) : undefined"
        @dragover="props.draggable ? handleDragOver($event) : undefined"
        @dragleave="props.draggable ? handleDragLeave($event) : undefined"
        @dragenter="props.draggable ? handleDragEnter($event) : undefined"
      >
        <slot><IconPlus /></slot>
      </div>
    </template>

    <div
      v-else-if="props.listType === 'list' && showUploadList && visibleFileList.length"
      class="semi-upload-file-list"
    >
      <div v-if="showListTitle" class="semi-upload-file-list-title">
        <UploadNodeRenderer
          v-if="renderedFileListTitle !== undefined"
          :content="renderedFileListTitle"
        />
        <template v-else>
          <span class="semi-upload-file-list-title-choosen">
            <UploadNodeRenderer
              v-if="props.fileListTitle && typeof props.fileListTitle !== 'function'"
              :content="props.fileListTitle"
            />
            <template v-else>{{ locale.selectedFiles }}</template>
          </span>
          <span
            v-if="showClear && !props.disabled"
            role="button"
            tabindex="0"
            class="semi-upload-file-list-title-clear"
            @click="clear"
          >
            {{ locale.clear }}
          </span>
        </template>
      </div>
      <div class="semi-upload-file-list-main" role="list" aria-label="file list">
        <template v-for="entry in fileRenderEntries" :key="entry.cardProps.key">
          <UploadNodeRenderer v-if="entry.content !== undefined" :content="entry.content" />
          <UploadFileCard v-else v-bind="entry.cardProps" :_locale="locale" />
        </template>
      </div>
    </div>

    <Modal
      v-if="props.crop"
      v-bind="props.cropModalProps"
      :visible="cropVisible"
      :title="
        typeof props.crop === 'object' && props.crop.modalTitle
          ? props.crop.modalTitle
          : locale.cropTitle
      "
      :ok-text="
        typeof props.crop === 'object' && props.crop.modalOkText
          ? props.crop.modalOkText
          : locale.cropOk
      "
      :cancel-text="
        typeof props.crop === 'object' && props.crop.modalCancelText
          ? props.crop.modalCancelText
          : locale.cropCancel
      "
      :on-ok="confirmCrop"
      :on-cancel="closeCrop"
    >
      <Cropper
        v-if="cropSource"
        ref="cropperRef"
        :src="cropSource"
        :shape="typeof props.crop === 'object' ? (props.crop.shape ?? 'rect') : 'rect'"
        :aspect-ratio="typeof props.crop === 'object' ? props.crop.aspectRatio : undefined"
        :min-zoom="typeof props.crop === 'object' ? props.crop.minZoom : undefined"
        :max-zoom="typeof props.crop === 'object' ? props.crop.maxZoom : undefined"
        :zoom-step="typeof props.crop === 'object' ? props.crop.zoomStep : undefined"
        :fill="typeof props.crop === 'object' ? props.crop.fill : undefined"
        :style="{ width: '100%', height: '100%' }"
      />
    </Modal>
  </div>
</template>
