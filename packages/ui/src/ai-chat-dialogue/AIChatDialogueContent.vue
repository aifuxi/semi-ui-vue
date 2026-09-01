<script setup lang="ts">
import {
  IconAlertCircle,
  IconCode,
  IconExcel,
  IconFile,
  IconPdf,
  IconSendMsgStroked,
  IconVideo,
  IconWord,
  IconWrench,
} from '@aifuxi/semi-icons-vue';
import { computed, h, type VNodeChild } from 'vue';

import { Image } from '../image';
import { MarkdownRender } from '../markdown-render';
import AIChatDialogueAnnotation from './AIChatDialogueAnnotation.vue';
import AIChatDialogueCode from './AIChatDialogueCode';
import AIChatDialogueNodeRenderer from './AIChatDialogueNodeRenderer';
import AIChatDialogueReasoning from './AIChatDialogueReasoning.vue';
import AIChatDialogueReference from './AIChatDialogueReference.vue';
import { AI_CHAT_DIALOGUE_ITEM_TYPE, AI_CHAT_DIALOGUE_STATUS } from './constants';
import type {
  Annotation,
  ContentItem,
  CustomToolCall,
  DialogueContentItemRendererMap,
  FunctionToolCall,
  InputFile,
  InputImage,
  InputMessage,
  InputText,
  MarkdownRenderProps,
  Message,
  Metadata,
  OutputMessage,
  OutputText,
  Reasoning,
  Reference,
  Refusal,
  RenderContentProps,
} from './types';

const props = defineProps<{
  message: Message;
  roleInfo?: Metadata | undefined;
  mode: 'bubble' | 'noBubble' | 'userBubble';
  escapeHtml: boolean;
  editing?: boolean | undefined;
  showReference?: boolean | undefined;
  disabledFileItemClick?: boolean | undefined;
  markdownRenderProps?: MarkdownRenderProps | undefined;
  messageEditRender?: ((properties: unknown) => VNodeChild) | undefined;
  renderDialogueContentItem?: DialogueContentItemRendererMap | undefined;
  customRenderFunc?: ((properties: RenderContentProps) => VNodeChild) | undefined;
  locale?:
    | {
        loading?: string;
        annotationText?: string;
        reasoning?: { completed?: string; thinking?: string };
      }
    | undefined;
}>();
const emit = defineEmits<{
  fileClick: [file: InputFile];
  imageClick: [image: InputImage];
  annotationClick: [annotation: Annotation[]];
  referenceClick: [reference: Reference];
}>();

const contentClass = computed(() => {
  const isUser = props.message.role === 'user';
  const bubble = props.mode === 'bubble' || (props.mode === 'userBubble' && isUser);
  return [
    'semi-ai-chat-dialogue-content',
    bubble
      ? `semi-ai-chat-dialogue-content-${props.mode}`
      : 'semi-ai-chat-dialogue-content-no-bubble',
    isUser ? 'semi-ai-chat-dialogue-content-user' : undefined,
    props.message.status === AI_CHAT_DIALOGUE_STATUS.failed && bubble
      ? 'semi-ai-chat-dialogue-content-error'
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');
});

function escapeMarkdownHtml(raw: string): string {
  return props.escapeHtml && props.message.role === 'user'
    ? raw.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    : raw;
}

function markdown(text: string, key: string): VNodeChild {
  if (!text) return undefined;
  const children: VNodeChild[] = [
    h(MarkdownRender, {
      ...(props.markdownRenderProps ?? {}),
      key: `${key}-markdown`,
      format: 'md',
      raw: escapeMarkdownHtml(text),
      components: {
        code: AIChatDialogueCode,
        ...(props.markdownRenderProps?.components ?? {}),
      },
    }),
  ];
  if (props.message.role === 'user' && props.showReference) {
    children.push(
      h(
        'button',
        {
          type: 'button',
          class: 'semi-ai-chat-dialogue-content-icon-reference',
          'aria-label': 'reference message',
          onClick: () => emit('referenceClick', { type: 'text', content: text }),
        },
        [h(IconSendMsgStroked)],
      ),
    );
  }
  return h('div', { key, class: contentClass.value }, children);
}

const documentTypes = new Set(['doc', 'docx', 'txt', 'word']);
const imageTypes = new Set(['jpeg', 'jpg', 'png', 'gif']);
const excelTypes = new Set(['excel', 'xlsx', 'xls']);
const codeTypes = new Set(['json', 'js', 'ts', 'jsx', 'tsx']);
const videoTypes = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv']);

function fileIcon(file: InputFile): VNodeChild {
  const type =
    file.filename?.split('.').pop()?.toLowerCase() ??
    file.fileInstance?.type?.split('/').pop() ??
    '';
  let kind = 'default';
  let icon = h(IconFile, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  if (documentTypes.has(type)) {
    kind = 'word';
    icon = h(IconWord, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  } else if (imageTypes.has(type)) {
    kind = 'image';
    icon = h('div', {
      class: 'semi-ai-chat-dialogue-content-file-icon',
      style: { backgroundImage: `url(${file.file_url ?? ''})` },
    });
  } else if (type === 'pdf') {
    kind = 'pdf';
    icon = h(IconPdf, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  } else if (excelTypes.has(type)) {
    kind = 'excel';
    icon = h(IconExcel, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  } else if (codeTypes.has(type)) {
    kind = 'code';
    icon = h(IconCode, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  } else if (videoTypes.has(type)) {
    kind = 'video';
    icon = h(IconVideo, { size: 'extra-large', class: 'semi-ai-chat-dialogue-content-file-icon' });
  }
  return h(
    'div',
    {
      class: [
        'semi-ai-chat-dialogue-content-file-icon-wrapper',
        `semi-ai-chat-dialogue-content-file-icon-${kind}`,
      ],
    },
    [icon],
  );
}

function fileNode(file: InputFile, key: string, last: boolean): VNodeChild {
  const type =
    file.filename?.split('.').pop()?.toLowerCase() ??
    file.fileInstance?.type?.split('/').pop() ??
    '';
  return h(
    'a',
    {
      key,
      href: file.file_url,
      target: '_blank',
      rel: 'noreferrer',
      class: [
        'semi-ai-chat-dialogue-content-file',
        last ? 'semi-ai-chat-dialogue-content-file-last' : undefined,
      ],
      onClick: (event: MouseEvent) => {
        emit('fileClick', file);
        if (props.disabledFileItemClick) event.preventDefault();
      },
    },
    [
      fileIcon(file),
      h('div', { class: 'semi-ai-chat-dialogue-content-file-info' }, [
        h(
          'span',
          {
            class: [
              'semi-ai-chat-dialogue-content-file-title',
              props.message.role === 'user' && props.showReference
                ? 'semi-ai-chat-dialogue-content-file-title-ellipsis'
                : undefined,
            ],
          },
          file.filename,
        ),
        h('span', { class: 'semi-ai-chat-dialogue-content-file-metadata' }, [
          h('span', { class: 'semi-ai-chat-dialogue-content-file-type' }, type),
          ` ${file.size ?? ''}`,
        ]),
      ]),
      props.message.role === 'user' && props.showReference
        ? h(
            'button',
            {
              type: 'button',
              class: 'semi-ai-chat-dialogue-content-icon-reference',
              'aria-label': 'reference file',
              onClick: (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                emit('referenceClick', {
                  ...(file.filename ? { name: file.filename } : {}),
                  ...(file.file_url ? { url: file.file_url } : {}),
                });
              },
            },
            [h(IconSendMsgStroked)],
          )
        : undefined,
    ],
  );
}

function customRenderer(type: string, item: unknown): VNodeChild {
  const candidate = props.renderDialogueContentItem?.[type];
  if (typeof candidate === 'function') return candidate(item, props.message);
  if (candidate && typeof candidate === 'object') {
    const name = (item as FunctionToolCall | CustomToolCall).name;
    if (name && typeof candidate[name] === 'function') return candidate[name](item, props.message);
  }
  return undefined;
}

function renderMessage(item: InputMessage | OutputMessage, index: number): VNodeChild {
  if (typeof item.content === 'string') return markdown(item.content, `message-${index}`);
  const inner = item.content ?? [];
  const imageCount = inner.filter(
    (part) => part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.inputImage,
  ).length;
  return inner.map((part, innerIndex) => {
    const custom = customRenderer(part.type ?? '', part);
    if (custom)
      return h('div', { class: 'semi-ai-chat-dialogue-content-custom-renderer' }, [custom]);
    if (
      part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.inputText ||
      part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.outputText ||
      part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.refusal
    ) {
      const output = part as OutputText;
      const annotations = output.annotations?.filter(
        (annotation) =>
          annotation.type !== 'file_citation' && annotation.type !== 'container_file_citation',
      );
      return h('div', { key: `text-${index}-${innerIndex}` }, [
        annotations?.length
          ? h(AIChatDialogueAnnotation as never, {
              annotation: annotations,
              maxCount: 15,
              ...(props.locale?.annotationText
                ? { annotationText: props.locale.annotationText }
                : {}),
              onClick: (value: Annotation[]) => emit('annotationClick', value),
            })
          : undefined,
        markdown((part as InputText | OutputText).text ?? '', `text-${index}-${innerIndex}`),
        markdown((part as Refusal).refusal ?? '', `refusal-${index}-${innerIndex}`),
      ]);
    }
    if (part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.inputImage) {
      const image = part as InputImage;
      return h(Image as never, {
        key: `image-${index}-${innerIndex}`,
        class: [
          'semi-ai-chat-dialogue-content-img',
          imageCount > 1 ? 'semi-ai-chat-dialogue-content-img-list' : undefined,
          innerIndex === inner.length - 1 ? 'semi-ai-chat-dialogue-content-img-last' : undefined,
        ],
        src: image.image_url,
        onClick: () => emit('imageClick', image),
      });
    }
    if (part.type === AI_CHAT_DIALOGUE_ITEM_TYPE.inputFile)
      return fileNode(
        part as InputFile,
        `file-${index}-${innerIndex}`,
        innerIndex === inner.length - 1,
      );
    return undefined;
  });
}

function renderItem(item: ContentItem, index: number): VNodeChild {
  const type = item.type ?? AI_CHAT_DIALOGUE_ITEM_TYPE.message;
  const custom = customRenderer(type, item);
  if (custom)
    return h(
      'div',
      { key: `custom-${index}`, class: 'semi-ai-chat-dialogue-content-custom-renderer' },
      [custom],
    );
  if (type === AI_CHAT_DIALOGUE_ITEM_TYPE.message)
    return renderMessage(item as InputMessage | OutputMessage, index);
  if (type === AI_CHAT_DIALOGUE_ITEM_TYPE.reasoning) {
    const reasoning = item as Reasoning;
    return h(AIChatDialogueReasoning as never, {
      key: `reasoning-${index}`,
      status: reasoning.status,
      summary: reasoning.summary,
      content: reasoning.content,
      markdownRenderProps: props.markdownRenderProps,
      completedText: props.locale?.reasoning?.completed,
      thinkingText: props.locale?.reasoning?.thinking,
    });
  }
  if (
    type === AI_CHAT_DIALOGUE_ITEM_TYPE.functionCall ||
    type === AI_CHAT_DIALOGUE_ITEM_TYPE.customToolCall ||
    type === AI_CHAT_DIALOGUE_ITEM_TYPE.mcpCall
  ) {
    const tool = item as FunctionToolCall | CustomToolCall;
    return h('div', { key: `tool-${index}`, class: 'semi-ai-chat-dialogue-content-tool-call' }, [
      h(IconWrench),
      `${tool.name ?? ''} ${'arguments' in tool ? (tool.arguments ?? '') : ((tool as CustomToolCall).input ?? '')}`,
    ]);
  }
  return undefined;
}

function editPayload(message: Message): unknown {
  const content = typeof message.content === 'string' ? message.content : '';
  return { content, attachment: [] };
}

const defaultNode = computed<VNodeChild>(() => {
  if (props.editing) return props.messageEditRender?.(editPayload(props.message));
  const content = props.message.content;
  const textContent = typeof content === 'string' ? content : props.message.output_text;
  let realContent: VNodeChild;
  if (textContent) {
    const defaultRenderer = props.renderDialogueContentItem?.default;
    realContent =
      typeof defaultRenderer === 'function'
        ? h('div', { class: 'semi-ai-chat-dialogue-content-custom-renderer' }, [
            defaultRenderer(textContent, props.message),
          ])
        : markdown(textContent, 'message-text');
  } else if (Array.isArray(content)) {
    realContent = content.map(renderItem);
  }
  return h('div', { class: 'semi-ai-chat-dialogue-content-wrapper' }, [
    props.message.status === AI_CHAT_DIALOGUE_STATUS.failed ||
    props.message.status === AI_CHAT_DIALOGUE_STATUS.cancelled
      ? h('div', { class: 'semi-ai-chat-dialogue-content-failed' }, [h(IconAlertCircle)])
      : undefined,
    h('div', { class: 'semi-ai-chat-dialogue-content-inner' }, [realContent]),
  ]);
});

const output = computed<VNodeChild>(() =>
  props.customRenderFunc
    ? props.customRenderFunc({
        message: props.message,
        role: props.roleInfo,
        defaultContent: defaultNode.value,
        className: contentClass.value,
      })
    : undefined,
);
const loading = computed(
  () =>
    [
      AI_CHAT_DIALOGUE_STATUS.queued,
      AI_CHAT_DIALOGUE_STATUS.inProgress,
      AI_CHAT_DIALOGUE_STATUS.incomplete,
    ].includes(props.message.status as never) &&
    !(Array.isArray(props.message.content)
      ? props.message.content.length
      : props.message.content) &&
    !props.message.output_text,
);
</script>

<template>
  <AIChatDialogueNodeRenderer v-if="props.customRenderFunc" :content="output" />
  <div
    v-else
    :class="[
      'semi-ai-chat-dialogue-content',
      { 'semi-ai-chat-dialogue-content-editing': props.editing },
    ]"
  >
    <AIChatDialogueReference
      v-if="props.message.references?.length && !props.editing"
      :references="props.message.references"
    />
    <AIChatDialogueNodeRenderer :content="defaultNode" />
    <span v-if="loading" class="semi-ai-chat-dialogue-content-loading">
      <span class="semi-ai-chat-dialogue-content-loading-item" />
      <span class="semi-ai-chat-dialogue-content-loading-item" />
      <span class="semi-ai-chat-dialogue-content-loading-item" />
      <span class="semi-ai-chat-dialogue-content-loading-text">
        {{ props.locale?.loading ?? '请稍候...' }}
      </span>
    </span>
  </div>
</template>
