<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, shallowRef } from 'vue';
import {
  AIChatDialogue,
  chatInputToMessage,
  type Message,
  type Annotation,
  type Reference as DialogueReference,
  type DialogueContentItemRendererMap,
} from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import {
  AIChatInput,
  type MessageContent,
  type Reference,
} from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconClose, IconWord } from '@aifuxi/semi-icons-vue';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { defaultMessages } from './messages';
import { uploadProps } from './mockUpload';
import ConfigurationControls from './ConfigurationControls.vue';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/button.css';
const messages = ref<Message[]>(structuredClone(defaultMessages));
const generating = ref(false);
const references = ref<Reference[]>([]);
const sideBarVisible = ref(false);
const sideBarContent = shallowRef<
  { type: 'annotation'; value: Annotation[] } | { type: 'resource'; value: { name?: string } }
>();
const annotations = computed(() =>
  sideBarContent.value?.type === 'annotation'
    ? (sideBarContent.value.value as Array<{ title?: string; logo?: string; detail?: string }>)
    : [],
);
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: new Map([
    ['PM', { name: 'Product Manager', avatar: '/demos/two.svg' }],
    ['UI', { name: 'Designer', avatar: '/demos/one.svg' }],
    ['FE', { name: 'Front-end programmer', avatar: '/demos/two.svg' }],
  ]),
};
let sequence = 0;
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(action: () => void, delay: number) {
  const timer = setTimeout(() => {
    timers.delete(timer);
    action();
  }, delay);
  timers.add(timer);
}
onBeforeUnmount(() => timers.forEach(clearTimeout));
function send(content: MessageContent) {
  generating.value = true;
  messages.value = [
    ...messages.value,
    { ...chatInputToMessage(content), id: `message-${++sequence}` },
  ];
  references.value = [];
  later(() => {
    generating.value = false;
  }, 100);
  later(() => {
    messages.value = [
      ...messages.value,
      {
        id: `message-${++sequence}`,
        role: 'assistant',
        name: 'FE',
        content: 'This is a mock reply message.',
      },
    ];
  }, 1000);
}
function editSend(content: MessageContent) {
  const index = messages.value.findIndex((message) => message.editing);
  if (index < 0) return;
  messages.value = [
    ...messages.value.slice(0, index),
    { ...chatInputToMessage(content), id: `message-${++sequence}` },
  ];
}
function addReference(item: DialogueReference) {
  references.value = [
    ...references.value,
    { ...item, type: item.type ?? 'text', id: `reference-${++sequence}` },
  ];
}
function removeReference(item: Reference) {
  references.value = references.value.filter((reference) => reference.id !== item.id);
}
function removeEditingReference(item: Reference) {
  messages.value = messages.value.map((message) =>
    message.editing
      ? {
          ...message,
          references: message.references?.filter((reference) => reference.id !== item.id),
        }
      : message,
  );
}
function showContent(content: NonNullable<typeof sideBarContent.value>) {
  // 相同资料再次点击收起，不同资料点击切换并打开。
  sideBarVisible.value =
    JSON.stringify(sideBarContent.value) === JSON.stringify(content) ? !sideBarVisible.value : true;
  sideBarContent.value = content;
}
const customRender: DialogueContentItemRendererMap = {
  resource: (item) => {
    const resource = item as { name?: string };
    return h(
      'div',
      {
        role: 'button',
        tabindex: 0,
        style: {
          display: 'flex',
          gap: '8px',
          backgroundColor: 'var(--semi-color-fill-0)',
          padding: '12px 16px',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '12px',
          cursor: 'pointer',
        },
        onClick: () => showContent({ type: 'resource', value: resource }),
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showContent({ type: 'resource', value: resource });
          }
        },
      },
      [h(IconWord, { style: { color: 'var(--semi-color-primary)' } }), resource.name],
    );
  },
};
const editingContent = (value: unknown) => value as MessageContent;
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="display: flex; column-gap: 10px">
      <div
        style="
          display: flex;
          flex-direction: column;
          height: calc(100vh - 32px);
          overflow: hidden;
          flex-grow: 1;
          min-width: 0;
        "
      >
        <AIChatDialogue
          v-model:chats="messages"
          :role-config="roleConfig"
          show-reference
          align="leftRight"
          mode="bubble"
          :render-dialogue-content-item="customRender"
          style="flex: 1; overflow: auto"
          @reference-click="addReference"
          @annotation-click="showContent({ type: 'annotation', value: $event })"
        >
          <template #message-edit="{ value }"
            ><AIChatInput
              :generating="false"
              :references="editingContent(value).references"
              :upload-props="{ ...uploadProps, defaultFileList: editingContent(value).attachments }"
              :default-content="String(editingContent(value).inputContents?.[0]?.text ?? '')"
              style="margin: 12px 0; max-height: 300px; flex-shrink: 0"
              @message-send="editSend"
              @reference-delete="removeEditingReference"
              ><template #configure><ConfigurationControls /></template></AIChatInput
          ></template>
        </AIChatDialogue>
        <AIChatInput
          placeholder="Enter content or upload content"
          default-content='I am a <input-slot placeholder="[Profession]">programmer</input-slot>，Please help me implement<input-slot placeholder="[Requirement Description]">a chat application in a Multi-Agent scenario</input-slot>'
          :generating="generating"
          :references="references"
          :upload-props="uploadProps"
          style="margin: 12px; min-height: 150px; max-height: 300px; flex-shrink: 0"
          @message-send="send"
          @stop-generate="generating = false"
          @reference-delete="removeReference"
          ><template #configure><ConfigurationControls /></template
        ></AIChatInput>
      </div>
      <div
        v-if="sideBarVisible"
        class="ai-component-sidebar"
        style="
          flex-shrink: 0;
          width: 300px;
          height: calc(100vh - 32px);
          border-radius: 12px;
          border: 1px solid var(--semi-color-border);
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            color: var(--semi-color-text-0);
          "
        >
          <div style="font-size: 16px; line-height: 22px; font-weight: 600">
            {{ sideBarContent?.type === 'annotation' ? 'References' : 'Artifact list' }}
          </div>
          <Button
            theme="borderless"
            type="tertiary"
            aria-label="Close sidebar"
            style="padding: 0; width: 24px; height: 24px"
            @click="sideBarVisible = false"
            ><template #icon><IconClose /></template
          ></Button>
        </div>
        <div style="display: flex; flex-direction: column; row-gap: 12px; padding: 12px">
          <template v-if="sideBarContent?.type === 'annotation'"
            ><div
              v-for="(item, index) in annotations"
              :key="index"
              style="display: flex; flex-direction: column; row-gap: 8px"
            >
              <span style="display: flex; align-items: center; column-gap: 4px"
                ><img
                  :src="item.logo"
                  alt=""
                  style="width: 20px; height: 20px; border-radius: 50%"
                /><span
                  style="
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 600;
                    color: var(--semi-color-text-0);
                  "
                  >{{ item.title }}</span
                ></span
              ><Typography.Paragraph
                :ellipsis="{ rows: 3 }"
                style="font-size: 12px; line-height: 16px; color: var(--semi-color-text-1)"
                >{{ item.detail }}</Typography.Paragraph
              >
            </div></template
          >
          <div
            v-else-if="sideBarContent?.type === 'resource'"
            style="display: flex; gap: 12px; align-items: center"
          >
            <IconWord style="color: var(--semi-color-primary)" size="extra-large" />{{
              sideBarContent.value.name
            }}
          </div>
        </div>
      </div>
    </div></ConfigProvider
  >
</template>
