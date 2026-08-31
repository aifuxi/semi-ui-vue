<script setup lang="ts">
import {
  AIChatInputFoundation,
  getAIChatInputAttachmentType,
  getAIChatInputContentType,
  getAIChatInputSkillSlotString,
  isAIChatInputImageType,
  type AIChatInputAdapter,
} from '@workspace/foundation-integration';
import {
  IconArrowUp,
  IconClose,
  IconCode,
  IconCrossStroked,
  IconExcel,
  IconFile,
  IconMusic,
  IconPaperclip,
  IconPdf,
  IconSendMsgStroked,
  IconStop,
  IconTemplateStroked,
  IconVideo,
  IconWord,
} from '@aifuxi/semi-icons-vue';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  useTemplateRef,
  watch,
  type Component,
  type CSSProperties,
  type VNodeChild,
} from 'vue';
import type { Content as TiptapContent, Editor } from '@tiptap/core';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import Popover from '../popover/Popover.vue';
import Progress from '../progress/Progress.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import Upload from '../upload/Upload.vue';
import type { UploadChangePayload, UploadExposed, UploadProps } from '../upload';
import AIChatInputConfigure from './AIChatInputConfigure.vue';
import AIChatInputConfigureButton from './AIChatInputConfigureButton.vue';
import AIChatInputEditor from './AIChatInputEditor.vue';
import AIChatInputNodeRenderer from './AIChatInputNodeRenderer';
import AIChatInputScroller from './AIChatInputScroller.vue';
import type {
  AIChatInputContent,
  AIChatInputEmits,
  AIChatInputExposed,
  AIChatInputLocale,
  AIChatInputProps,
  AIChatInputSlots,
  Attachment,
  LeftMenuChangeProps,
  Reference,
  RenderSkillItemProps,
  RenderSuggestionItemProps,
  RenderTopSlotProps,
  RenderUploadButtonProps,
  Skill,
  Suggestion,
} from './types';

interface EditorExposed {
  setContent(content: TiptapContent): void;
  focus(pos?: Parameters<Editor['commands']['focus']>[0]): void;
  getEditor(): Editor | undefined;
}
interface ConfigureExposed {
  getConfigureValue(): LeftMenuChangeProps;
}
interface RuntimeState {
  templateVisible: boolean;
  skillVisible: boolean;
  suggestionVisible: boolean;
  attachments: Attachment[];
  skill?: Skill;
  popupWidth?: number | string;
  activeSkillIndex: number;
  activeSuggestionIndex: number;
  popupKey: number;
  content?: unknown;
  richTextInit: boolean;
}

defineOptions({ name: 'AIChatInput', inheritAttrs: false });
const props = withDefaults(defineProps<AIChatInputProps>(), {
  clearContentOnGenerating: true,
  dropdownMatchTriggerWidth: true,
  generating: false,
  keepSkillAfterSend: false,
  round: true,
  sendHotKey: 'enter',
  showPlaceholderWhenSkillOnly: false,
  showReference: true,
  showTemplateButton: false,
  showUploadButton: true,
  showUploadFile: true,
  topSlotPosition: 'top',
});
const emit = defineEmits<AIChatInputEmits>();
defineSlots<AIChatInputSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const rootRef = useTemplateRef<HTMLDivElement>('root');
const popupRef = useTemplateRef<HTMLDivElement>('popup');
const editorRef = useTemplateRef<EditorExposed>('editor');
const uploadRef = useTemplateRef<UploadExposed>('upload');
const configureRef = useTemplateRef<ConfigureExposed>('configure');
const editor = shallowRef<Editor>();
const transformedContent = shallowRef<AIChatInputContent[]>([]);
const popupId = `semi-aiChatInput-${useId()}`;
const cache = new Map<unknown, unknown>();
let clickOutsideHandler: ((event: MouseEvent) => void) | undefined;

const state = shallowReactive<RuntimeState>({
  templateVisible: false,
  skillVisible: false,
  suggestionVisible: false,
  attachments: [...((props.uploadProps?.defaultFileList as Attachment[] | undefined) ?? [])],
  activeSkillIndex: 0,
  activeSuggestionIndex: 0,
  popupKey: 1,
  richTextInit: false,
});

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveDefaultTrue(
  name:
    | 'clearContentOnGenerating'
    | 'dropdownMatchTriggerWidth'
    | 'round'
    | 'showReference'
    | 'showUploadButton'
    | 'showUploadFile',
): boolean {
  if (hasRawProp(name)) return props[name] !== false;
  const globalValue = semiGlobal.config.overrideDefaultProps?.AIChatInput?.[name];
  return globalValue === undefined ? true : globalValue !== false;
}

const runtimeClearContentOnGenerating = computed(() =>
  resolveDefaultTrue('clearContentOnGenerating'),
);
const runtimeDropdownMatchTriggerWidth = computed(() =>
  resolveDefaultTrue('dropdownMatchTriggerWidth'),
);
const runtimeRound = computed(() => resolveDefaultTrue('round'));
const runtimeShowReference = computed(() => resolveDefaultTrue('showReference'));
const runtimeShowUploadButton = computed(() => resolveDefaultTrue('showUploadButton'));
const runtimeShowUploadFile = computed(() => resolveDefaultTrue('showUploadFile'));
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);
const locale = computed<AIChatInputLocale>(() => {
  const fallback =
    config.value.locale.code === 'en-US'
      ? { template: 'Template', configure: 'Configure', selected: 'Selected ${count} items' }
      : { template: '模板', configure: '配置', selected: '已选 ${count} 个' };
  return {
    ...fallback,
    ...(config.value.locale.AIChatInput as Partial<AIChatInputLocale> | undefined),
  };
});
const panelVisible = computed(
  () => state.templateVisible || state.skillVisible || state.suggestionVisible,
);
const rootClass = computed(() => ['semi-aiChatInput', props.class, props.className, attrs.class]);
const rootStyle = computed(() => [props.style, attrs.style]);
const popoverClass = computed(() => ({
  'semi-aiChatInput-popover-suggestion': state.suggestionVisible,
  'semi-aiChatInput-popover-skill': state.skillVisible,
  'semi-aiChatInput-popover-template': state.templateVisible,
}));
const popupContainerBindings = computed(() => {
  const getPopupContainer = props.popoverProps?.getPopupContainer ?? config.value.getPopupContainer;
  return getPopupContainer ? { getPopupContainer } : {};
});

function foundationProps() {
  const style =
    props.style && typeof props.style === 'object' && !Array.isArray(props.style)
      ? (props.style as CSSProperties)
      : undefined;
  return {
    canSend: hasRawProp('canSend') ? props.canSend : undefined,
    clearContentOnGenerating: runtimeClearContentOnGenerating.value,
    dropdownMatchTriggerWidth: runtimeDropdownMatchTriggerWidth.value,
    generating: props.generating,
    references: props.references,
    sendHotKey: props.sendHotKey,
    skillHotKey: props.skillHotKey,
    skills: props.skills,
    style,
    suggestions: props.suggestions,
    transformer: props.transformer,
    uploadProps: props.uploadProps ?? {},
  };
}

function unregisterClickOutside(): void {
  if (!clickOutsideHandler || typeof document === 'undefined') return;
  document.removeEventListener('mousedown', clickOutsideHandler, false);
  clickOutsideHandler = undefined;
}

const adapter: AIChatInputAdapter<ReturnType<typeof foundationProps>, RuntimeState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  reposPopover: () => {
    if (state.templateVisible) state.popupKey += 1;
  },
  setContent: (content) => editorRef.value?.setContent(content as TiptapContent),
  clearContent: () => editorRef.value?.setContent(''),
  clearAttachments: () => {
    state.attachments = [];
  },
  focusEditor: (pos) => editorRef.value?.focus(pos as Parameters<Editor['commands']['focus']>[0]),
  getTriggerWidth: () => rootRef.value?.getBoundingClientRect().width ?? 0,
  getEditor: () => editor.value,
  getPopupID: () => popupId,
  notifySkillChange: (skill) => emit('skillChange', skill as Skill | undefined),
  notifyContentChange: (result) => {
    transformedContent.value = result as AIChatInputContent[];
    emit('contentChange', transformedContent.value);
  },
  notifyConfigureChange: (value, changedValue) =>
    emit('configureChange', value as LeftMenuChangeProps, changedValue as LeftMenuChangeProps),
  manualUpload: (files) => uploadRef.value?.insert(files),
  notifyMessageSend: (message) => emit('messageSend', message as never),
  notifyStopGenerate: () => emit('stopGenerate'),
  getRichTextDiv: () =>
    rootRef.value?.querySelector<HTMLDivElement>('.semi-aiChatInput-editor-content') ?? null,
  registerClickOutsideHandler: (callback) => {
    unregisterClickOutside();
    if (typeof document === 'undefined') return;
    clickOutsideHandler = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.value?.contains(target) && !popupRef.value?.contains(target)) callback(event);
    };
    document.addEventListener('mousedown', clickOutsideHandler, false);
  },
  unregisterClickOutsideHandler: unregisterClickOutside,
  handleReferenceDelete: (reference) => emit('referenceDelete', reference as Reference),
  handleReferenceClick: (reference) => emit('referenceClick', reference as Reference),
  isSelectionText: (selection) => selection instanceof TextSelection,
  createSelection: (node, pos) => NodeSelection.create(node as never, pos),
  notifyFocus: (event) => emit('focus', event),
  notifyBlur: (event) => emit('blur', event),
  getConfigureValue: () => configureRef.value?.getConfigureValue() ?? {},
};
const foundation = markRaw(
  new AIChatInputFoundation<ReturnType<typeof foundationProps>, RuntimeState>(adapter),
);
const editorBindings = computed(() => ({
  ...(props.defaultContent === undefined ? {} : { defaultContent: props.defaultContent }),
  ...(props.placeholder === undefined ? {} : { placeholder: props.placeholder }),
  ...(props.extensions === undefined ? {} : { extensions: props.extensions }),
  ...(props.immediatelyRender === undefined ? {} : { immediatelyRender: props.immediatelyRender }),
  showPlaceholderWhenSkillOnly: props.showPlaceholderWhenSkillOnly,
  handleKeyDown: foundation.handRichTextArealKeyDown,
}));

function handleEditorCreate(instance: Editor): void {
  editor.value = markRaw(instance);
  foundation.handleCreate();
}

function handleEditorUpdate(instance: Editor): void {
  editor.value = markRaw(instance);
  foundation.handleContentChange(instance.getText());
}

function handlePaste(event: ClipboardEvent, files: File[]): void {
  emit('paste', event);
  if (files.length) foundation.handlePaste(files);
}

function changeTemplateVisible(visible: boolean): void {
  foundation.changeTemplateVisible(visible);
  emit('templateVisibleChange', visible);
}

function selectSuggestion(suggestion: Suggestion): void {
  const content =
    typeof suggestion === 'string'
      ? suggestion
      : Array.isArray(suggestion)
        ? suggestion.join('')
        : suggestion.content;
  foundation.handleSuggestionSelect(content);
  emit('suggestClick', suggestion);
  foundation.hideSuggestionPanel();
}

function setSuggestionActive(index: number): void {
  foundation.setActiveSuggestionIndex(index);
}
function selectSkill(skill: Skill): void {
  foundation.handleSkillSelect(skill);
}
function setSkillActive(index: number): void {
  foundation.setActiveSkillIndex(index);
}

function handleUploadChange(payload: UploadChangePayload): void {
  foundation.onUploadChange(payload);
  emit('uploadChange', payload);
}

function deleteReference(reference: Reference, event?: Event): void {
  event?.stopPropagation();
  foundation.handleReferenceDelete(reference);
}

function deleteUploadFile(attachment: Attachment): void {
  foundation.handleUploadFileDelete(attachment);
}

function setContent(content: TiptapContent): void {
  editorRef.value?.setContent(content);
}
function setContentWhileSaveTool(content: string): void {
  setContent(
    state.skill
      ? `<p>${getAIChatInputSkillSlotString(state.skill)}${content}</p>`
      : `<p>${content}</p>`,
  );
}
function focusEditor(pos?: Parameters<Editor['commands']['focus']>[0]): void {
  editorRef.value?.focus(pos);
}
function getEditor(): Editor | undefined {
  return editor.value;
}
function deleteContent(content: AIChatInputContent): void {
  foundation.handleDeleteContent(content);
}

defineExpose<AIChatInputExposed>({
  changeTemplateVisible,
  deleteContent,
  deleteUploadFile,
  focusEditor,
  getEditor,
  setContent,
  setContentWhileSaveTool,
});

function topSlotProps(): RenderTopSlotProps {
  return {
    references: props.references ?? [],
    attachments: state.attachments,
    content: transformedContent.value,
    handleUploadFileDelete: deleteUploadFile,
    handleReferenceDelete: deleteReference,
  };
}
function topNode(): VNodeChild {
  return slots.top?.(topSlotProps()) ?? props.renderTopSlot?.(topSlotProps());
}
function referenceNode(reference: Reference): VNodeChild {
  return slots.reference?.({ reference }) ?? props.renderReference?.(reference);
}
function suggestionNode(suggestion: Suggestion, index: number): VNodeChild {
  const className = [
    'semi-aiChatInput-suggestion-item',
    state.activeSuggestionIndex === index ? 'semi-aiChatInput-suggestion-item-active' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const renderProps: RenderSuggestionItemProps = {
    suggestion,
    className,
    onClick: () => selectSuggestion(suggestion),
    onMouseEnter: () => setSuggestionActive(index),
  };
  return slots.suggestion?.(renderProps) ?? props.renderSuggestionItem?.(renderProps);
}
function skillNode(skill: Skill, index: number): VNodeChild {
  const className = [
    'semi-aiChatInput-skill-item',
    state.activeSkillIndex === index ? 'semi-aiChatInput-skill-item-active' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const renderProps: RenderSkillItemProps = {
    skill,
    className,
    onClick: () => selectSkill(skill),
    onMouseEnter: () => setSkillActive(index),
  };
  return slots.skill?.(renderProps) ?? props.renderSkillItem?.(renderProps);
}
function templateNode(): VNodeChild {
  const renderProps = { skill: state.skill, onTemplateClick: setContent };
  return slots.template?.(renderProps) ?? props.renderTemplate?.(state.skill, setContent);
}

const defaultUploadNode = computed<VNodeChild>(() =>
  h(
    'button',
    {
      class: 'semi-aiChatInput-footer-action-button semi-aiChatInput-footer-action-upload',
      type: 'button',
      'aria-label': 'Upload',
      disabled: Boolean(props.uploadProps?.disabled),
      onClick: () => uploadRef.value?.openFileDialog(),
    },
    [h(IconPaperclip)],
  ),
);
const uploadRenderProps = computed<RenderUploadButtonProps>(() => ({
  defaultNode: defaultUploadNode.value,
  openFileDialog: () => uploadRef.value?.openFileDialog(),
  disabled: Boolean(props.uploadProps?.disabled),
  attachments: state.attachments,
}));
const customUploadNode = computed<VNodeChild>(
  () =>
    slots.uploadButton?.(uploadRenderProps.value) ??
    props.renderUploadButton?.(uploadRenderProps.value),
);
const uploadBindings = computed<UploadProps>(
  () =>
    ({
      action: props.uploadProps?.action ?? '',
      ...props.uploadProps,
      fileList: state.attachments,
      listType: 'none',
      showUploadList: false,
    }) as UploadProps,
);
const uploadMenuNode = computed<VNodeChild>(() => {
  const node = h(
    Upload,
    {
      ...uploadBindings.value,
      ref: uploadRef,
      onChange: handleUploadChange,
    },
    { default: () => customUploadNode.value || defaultUploadNode.value },
  );
  return props.uploadTipProps
    ? h(Tooltip, props.uploadTipProps, { default: () => h('span', [node]) })
    : node;
});
const canSend = computed(() => {
  // Foundation reads the opaque Tiptap editor; content is the reactive invalidation signal.
  void state.content;
  return foundation.canSend();
});
const sendButtonNode = computed<VNodeChild>(() =>
  h(
    'button',
    {
      class: [
        'semi-aiChatInput-footer-action-button',
        props.generating
          ? 'semi-aiChatInput-footer-action-stop'
          : 'semi-aiChatInput-footer-action-send',
        !props.generating && !canSend.value ? 'semi-aiChatInput-footer-action-send-disabled' : '',
      ],
      type: 'button',
      'aria-label': props.generating ? 'Stop' : 'Send',
      disabled: !props.generating && !canSend.value,
      onClick: props.generating ? foundation.handleStopGenerate : foundation.handleSend,
    },
    [h(props.generating ? IconStop : IconArrowUp)],
  ),
);
const customActionNode = computed<VNodeChild>(() => {
  const renderProps = {
    menuItem: [
      runtimeShowUploadButton.value ? uploadMenuNode.value : undefined,
      sendButtonNode.value,
    ].filter(Boolean) as VNodeChild[],
    className: 'semi-aiChatInput-footer-action',
  };
  return slots.action?.(renderProps) ?? props.renderActionArea?.(renderProps);
});

function fileIcon(type: string): Component | undefined {
  if (type === 'text') return undefined;
  return (
    {
      word: IconWord,
      file: IconFile,
      code: IconCode,
      excel: IconExcel,
      video: IconVideo,
      audio: IconMusic,
      pdf: IconPdf,
    }[type] ?? IconFile
  );
}
function typeInfo(item: Attachment | Reference): { raw: string; content: string; image: boolean } {
  const raw = getAIChatInputAttachmentType(item);
  return {
    raw,
    content: getAIChatInputContentType(raw),
    image: isAIChatInputImageType(item as never),
  };
}

watch(
  () => props.suggestions,
  (suggestions, previous) => {
    if (previous === undefined) return;
    if (suggestions?.length) foundation.showSuggestionPanel();
    else foundation.hideSuggestionPanel();
  },
  { deep: true },
);
watch(
  () => props.generating,
  (generating, previous) => {
    if (!generating || generating === previous || !runtimeClearContentOnGenerating.value) return;
    if (props.keepSkillAfterSend && state.skill) setContentWhileSaveTool('');
    else adapter.clearContent();
    adapter.clearAttachments();
  },
);
watch(
  () => props.uploadProps?.fileList,
  (fileList) => {
    if (fileList) state.attachments = [...(fileList as Attachment[])];
  },
  { deep: true },
);

onMounted(() => foundation.init());
onBeforeUnmount(() => {
  foundation.destroy();
  unregisterClickOutside();
  editor.value = undefined;
});
</script>

<template>
  <Popover
    v-bind="{ ...props.popoverProps, ...popupContainerBindings }"
    :position="
      props.popoverProps?.position ?? (config.direction === 'rtl' ? 'bottomRight' : 'bottomLeft')
    "
    :re-pos-key="state.popupKey"
    :class="[popoverClass, props.popoverProps?.class]"
    :visible="panelVisible"
    trigger="custom"
    :disable-arrow-key-down="true"
  >
    <template #content>
      <div ref="popup">
        <div
          v-if="state.templateVisible"
          :class="['semi-aiChatInput-template', props.templatesCls]"
          :style="[{ width: state.popupWidth, maxHeight: '500px' }, props.templatesStyle]"
        >
          <AIChatInputNodeRenderer :content="templateNode()" />
        </div>
        <div
          v-else-if="state.skillVisible"
          :id="`semi-aiChatInput-skill-${popupId}`"
          class="semi-aiChatInput-skill"
          role="listbox"
          :style="{ width: state.popupWidth, maxHeight: '270px' }"
        >
          <template
            v-for="(skill, index) in props.skills ?? []"
            :key="skill.value ?? skill.label ?? index"
          >
            <AIChatInputNodeRenderer
              v-if="skillNode(skill, index)"
              :content="skillNode(skill, index)"
            />
            <div
              v-else
              :class="[
                'semi-aiChatInput-skill-item',
                { 'semi-aiChatInput-skill-item-active': state.activeSkillIndex === index },
              ]"
              role="option"
              :aria-selected="state.activeSkillIndex === index"
              @click="selectSkill(skill)"
              @mouseenter="setSkillActive(index)"
            >
              <AIChatInputNodeRenderer :content="skill.icon" />
              <div class="semi-aiChatInput-skill-item-content">{{ skill.label }}</div>
            </div>
          </template>
        </div>
        <div
          v-else-if="state.suggestionVisible"
          :id="`semi-aiChatInput-suggestion-${popupId}`"
          class="semi-aiChatInput-suggestion"
          role="listbox"
          :style="{ width: state.popupWidth, maxHeight: '270px' }"
        >
          <template v-for="(suggestion, index) in props.suggestions ?? []" :key="index">
            <AIChatInputNodeRenderer
              v-if="suggestionNode(suggestion, index)"
              :content="suggestionNode(suggestion, index)"
            />
            <div
              v-else
              :class="[
                'semi-aiChatInput-suggestion-item',
                {
                  'semi-aiChatInput-suggestion-item-active': state.activeSuggestionIndex === index,
                },
              ]"
              role="option"
              :aria-selected="state.activeSuggestionIndex === index"
              @click="selectSuggestion(suggestion)"
              @mouseenter="setSuggestionActive(index)"
            >
              {{
                typeof suggestion === 'string'
                  ? suggestion
                  : Array.isArray(suggestion)
                    ? suggestion.join('')
                    : suggestion.content
              }}
            </div>
          </template>
        </div>
      </div>
    </template>

    <div
      ref="root"
      v-bind="attrs"
      :class="rootClass"
      :style="rootStyle"
      :dir="config.direction"
      :aria-controls="
        panelVisible
          ? state.skillVisible
            ? `semi-aiChatInput-skill-${popupId}`
            : state.suggestionVisible
              ? `semi-aiChatInput-suggestion-${popupId}`
              : undefined
          : undefined
      "
      :aria-expanded="panelVisible"
      @mousedown="foundation.handleContainerMouseDown"
      @click="foundation.handleContainerClick"
    >
      <AIChatInputNodeRenderer v-if="props.topSlotPosition === 'top'" :content="topNode()" />

      <div
        v-if="runtimeShowReference && (props.references?.length ?? 0) > 0"
        class="semi-aiChatInput-references"
      >
        <template v-for="reference in props.references" :key="reference.id">
          <AIChatInputNodeRenderer
            v-if="referenceNode(reference)"
            :content="referenceNode(reference)"
          />
          <div
            v-else
            class="semi-aiChatInput-reference"
            @click="foundation.handleReferenceClick(reference)"
          >
            <IconSendMsgStroked />
            <span class="semi-aiChatInput-reference-content">
              <img
                v-if="reference.type !== 'text' && typeInfo(reference).image"
                class="semi-aiChatInput-reference-img"
                :src="String(reference.url ?? '')"
                :alt="String(reference.name ?? '')"
              />
              <span
                v-else-if="reference.type !== 'text'"
                :class="[
                  'semi-aiChatInput-ref-icon',
                  `semi-aiChatInput-ref-icon-${typeInfo(reference).content}`,
                  'semi-aiChatInput-reference-icon',
                ]"
              >
                <component :is="fileIcon(typeInfo(reference).content)" size="small" />
              </span>
              <span class="semi-aiChatInput-reference-name">
                {{ reference.type === 'text' ? reference.content : reference.name }}
              </span>
            </span>
            <IconCrossStroked
              size="small"
              class="semi-aiChatInput-reference-delete"
              role="button"
              aria-label="Delete reference"
              @click="deleteReference(reference, $event)"
            />
          </div>
        </template>
      </div>

      <AIChatInputNodeRenderer v-if="props.topSlotPosition === 'middle'" :content="topNode()" />

      <AIChatInputScroller
        v-if="runtimeShowUploadFile && state.attachments.length > 0"
        :item-count="state.attachments.length"
      >
        <div
          v-for="attachment in state.attachments"
          :key="attachment.uid"
          class="semi-aiChatInput-attachment"
        >
          <img
            v-if="typeInfo(attachment).image"
            class="semi-aiChatInput-attachment-img"
            :src="attachment.url"
            :alt="attachment.name"
          />
          <span
            v-else
            :class="[
              'semi-aiChatInput-attachment-icon',
              'semi-aiChatInput-ref-icon',
              `semi-aiChatInput-ref-icon-${typeInfo(attachment).content}`,
            ]"
          >
            <component :is="fileIcon(typeInfo(attachment).content)" size="large" />
          </span>
          <div class="semi-aiChatInput-attachment-content">
            <div class="semi-aiChatInput-attachment-content-name">{{ attachment.name }}</div>
            <div class="semi-aiChatInput-attachment-content-size">
              {{ `${typeInfo(attachment).raw} ${attachment.size}` }}
            </div>
          </div>
          <Progress
            v-if="
              attachment.status === 'uploading' &&
              attachment.percent !== undefined &&
              attachment.percent !== 100
            "
            type="circle"
            :width="30"
            class="semi-aiChatInput-attachment-progress"
            :percent="attachment.percent"
            :show-info="false"
            aria-label="upload progress"
          />
          <IconClose
            class="semi-aiChatInput-attachment-delete"
            size="small"
            role="button"
            aria-label="Delete upload"
            @click="deleteUploadFile(attachment)"
          />
        </div>
      </AIChatInputScroller>

      <AIChatInputNodeRenderer v-if="props.topSlotPosition === 'bottom'" :content="topNode()" />

      <AIChatInputEditor
        ref="editor"
        v-bind="editorBindings"
        @create="handleEditorCreate"
        @update="handleEditorUpdate"
        @keydown="foundation.handleKeyDown"
        @paste="handlePaste"
        @focus="foundation.handleFocus"
        @blur="foundation.handleBlur"
      />

      <div :class="['semi-aiChatInput-footer', { 'semi-aiChatInput-footer-round': runtimeRound }]">
        <div class="semi-aiChatInput-footer-configure">
          <AIChatInputConfigure ref="configure" @change="foundation.onConfigureChange">
            <AIChatInputNodeRenderer
              :content="
                slots.configure?.({ className: 'semi-aiChatInput-footer-configure' }) ??
                props.renderConfigureArea?.('semi-aiChatInput-footer-configure')
              "
            />
            <AIChatInputConfigureButton
              v-if="props.showTemplateButton || state.skill?.hasTemplate"
              field="template"
              :icon="IconTemplateStroked"
              @click="changeTemplateVisible"
            >
              {{ locale.template }}
            </AIChatInputConfigureButton>
          </AIChatInputConfigure>
        </div>

        <AIChatInputNodeRenderer v-if="customActionNode" :content="customActionNode" />
        <div v-else class="semi-aiChatInput-footer-action">
          <template v-if="runtimeShowUploadButton">
            <Tooltip v-if="props.uploadTipProps" v-bind="props.uploadTipProps">
              <span>
                <Upload ref="upload" v-bind="uploadBindings" @change="handleUploadChange">
                  <AIChatInputNodeRenderer :content="customUploadNode || defaultUploadNode" />
                </Upload>
              </span>
            </Tooltip>
            <Upload v-else ref="upload" v-bind="uploadBindings" @change="handleUploadChange">
              <AIChatInputNodeRenderer :content="customUploadNode || defaultUploadNode" />
            </Upload>
          </template>
          <AIChatInputNodeRenderer :content="sendButtonNode" />
        </div>
      </div>
    </div>
  </Popover>
</template>
