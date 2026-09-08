<script setup lang="ts">
import { computed, markRaw, ref, useTemplateRef, onBeforeUnmount } from 'vue';
import type { AIChatInputExposed, AIChatInputContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { ReferSlot } from './ReferSlot';
import { referenceData, actionData } from './extensionData';
import ReferenceItems from './ReferenceItems.vue';
const input = useTemplateRef<AIChatInputExposed>('input');
const references = ref(referenceData);
const extensions = markRaw([ReferSlot]);
const sent = ref<MessageContent>();
const open = ref(false),
  level = ref<string>(),
  query = ref(''),
  active = ref(0);
let from = 0;
const position = ref({ left: '0px', top: '0px' });
interface Option {
  name: string;
  key?: string;
  type?: string;
  path?: string;
}
const options = computed<Option[]>(() => {
  const source = level.value
    ? actionData[level.value as keyof typeof actionData]
    : Object.keys(actionData).map((name) => ({ name }));
  return source.filter((i) => i.name.toLowerCase().includes(query.value.toLowerCase()));
});
const transformer = markRaw(
  new Map([
    [
      'referSlot',
      (obj: unknown) => {
        const a = (obj as { attrs: Record<string, string> }).attrs;
        return {
          type: a.type,
          value: a.value,
          uniqueKey: a.uniqueKey,
          ...JSON.parse(a.info ?? '{}'),
        };
      },
    ],
  ]),
);
function close() {
  open.value = false;
  level.value = undefined;
  const editor = input.value?.getEditor();
  editor?.commands.setAllowHotKeySendForSemiAIChatInput(true);
}
function update() {
  const editor = input.value?.getEditor();
  if (!editor) return;
  const pos = editor.state.selection.from;
  const text = editor.state.doc.textBetween(Math.max(0, pos - 100), pos, '\n', '\ufffc');
  const match = text.match(/@([^@\n]*)$/);
  if (!match) {
    close();
    return;
  }
  from = pos - match[0].length;
  query.value = match[1] ?? '';
  active.value = 0;
  open.value = true;
  editor.commands.setAllowHotKeySendForSemiAIChatInput(false);
  const rect = editor.view.coordsAtPos(pos);
  position.value = { left: rect.left + 'px', top: rect.bottom + 'px' };
}
function select(option: Option) {
  if (!level.value) {
    level.value = option.name;
    query.value = '';
    active.value = 0;
    return;
  }
  const editor = input.value?.getEditor();
  if (!editor) return;
  editor
    .chain()
    .focus()
    .insertContentAt(
      { from, to: editor.state.selection.from },
      {
        type: 'referSlot',
        attrs: {
          type: option.type,
          value: option.name,
          info: JSON.stringify({ path: option.path }),
          uniqueKey: option.key,
        },
      },
    )
    .run();
  close();
}
function keydown(event: KeyboardEvent) {
  if (!open.value) return;
  if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.key === 'Escape') {
    if (level.value) {
      level.value = undefined;
      query.value = '';
      active.value = 0;
    } else close();
  } else if (event.key === 'Enter') {
    const option = options.value[active.value];
    if (option) select(option);
  } else
    active.value =
      (active.value + (event.key === 'ArrowDown' ? 1 : -1) + options.value.length) %
      Math.max(1, options.value.length);
}
function contentItems(items: AIChatInputContent[]) {
  return items.filter((i) => i.type !== 'text');
}
onBeforeUnmount(close);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div @keydown.capture="keydown">
      <AIChatInput
        ref="input"
        :extensions="extensions"
        :transformer="transformer"
        :references="references"
        :show-upload-file="false"
        :show-reference="false"
        :upload-props="uploadProps"
        placeholder="Type @ to trigger"
        style="margin: 12px"
        @content-change="update"
        @message-send="sent = $event"
        ><template #top="{ content, attachments, handleUploadFileDelete }"
          ><ReferenceItems
            :items="contentItems(content)"
            @remove="input?.deleteContent(contentItems(content)[$event]!)" /><ReferenceItems
            :items="references"
            @remove="references.splice($event, 1)" /><ReferenceItems
            :items="attachments"
            @remove="handleUploadFileDelete(attachments[$event]!)" /></template
      ></AIChatInput>
    </div>
    <Teleport to="body"
      ><div v-if="open" class="mention-panel" role="listbox" :style="position" @mousedown.prevent>
        <div class="mention-level">{{ level ?? 'Select reference' }}</div>
        <button
          v-for="(option, index) in options"
          :key="option.name"
          role="option"
          :aria-selected="active === index"
          :class="{ active: active === index }"
          @click="select(option)"
          @mouseenter="active = index"
        >
          {{ option.name }}
        </button>
      </div></Teleport
    >
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
<style scoped>
.mention-panel {
  position: fixed;
  z-index: 2000;
  min-width: 220px;
  padding: 8px;
  border: 1px solid var(--semi-color-border);
  border-radius: 8px;
  background: var(--semi-color-bg-0);
  color: var(--semi-color-text-0);
  box-shadow: var(--semi-shadow-elevated);
}
.mention-panel button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.mention-panel button.active {
  background: var(--semi-color-fill-0);
}
.mention-level {
  font-size: 12px;
  padding: 4px;
}
</style>
