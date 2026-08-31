<script setup lang="ts">
import {
  IconAlignCenter,
  IconAlignJustify,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconCheckCircleStroked,
  IconCode,
  IconDeleteStroked,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHn,
  IconImage,
  IconItalic,
  IconLink,
  IconList,
  IconMinus,
  IconOrderedList,
  IconQuote,
  IconRedo,
  IconStrikeThrough,
  IconText,
  IconUndo,
} from '@aifuxi/semi-icons-vue';
import type { Editor } from '@tiptap/core';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { Button } from '../button';
import { Divider } from '../divider';
import { Dropdown, DropdownItem, DropdownMenu } from '../dropdown';
import { Input } from '../input';
import { LocaleConsumer } from '../locale';
import { Toast } from '../toast';
import type { SidebarLocale } from './types';

const props = defineProps<{ editor: Editor }>();
const revision = ref(0);
const linkVisible = ref(false);
const linkInput = ref('');
const linkSelection = ref<{ from: number; to: number }>();
const headingLevels = [1, 2, 3, 4, 5, 6] as const;
const headingIcons = [IconH1, IconH2, IconH3, IconH4, IconH5, IconH6] as const;

const editorState = computed(() => {
  void revision.value;
  const { from, to } = props.editor.state.selection;
  return {
    canImage: props.editor.can().insertContent({ type: 'imageUpload' }),
    canItalic: props.editor.can().chain().toggleItalic().run(),
    canStrike: props.editor.can().chain().toggleStrike().run(),
    canCode: props.editor.can().chain().toggleCode().run(),
    canLink: from !== to || props.editor.isFocused,
    canRedo: props.editor.can().chain().redo().run(),
    canUndo: props.editor.can().chain().undo().run(),
    isBlockquote: props.editor.isActive('blockquote'),
    isBold: props.editor.isActive('bold'),
    isBulletList: props.editor.isActive('bulletList'),
    isCode: props.editor.isActive('code'),
    isCodeBlock: props.editor.isActive('codeBlock'),
    isHeading: props.editor.isActive('heading'),
    isImage: props.editor.isActive('imageUpload'),
    isItalic: props.editor.isActive('italic'),
    isLink: props.editor.isActive('link'),
    isOrderedList: props.editor.isActive('orderedList'),
    isParagraph: props.editor.isActive('paragraph'),
    isStrike: props.editor.isActive('strike'),
  };
});

function refresh(): void {
  revision.value += 1;
}

function handleLinkVisibleChange(visible: boolean): void {
  linkVisible.value = visible;
  if (visible) {
    const { from, to } = props.editor.state.selection;
    linkSelection.value = { from, to };
    if (from !== to) props.editor.chain().focus().setMark('selectionMark').run();
    linkInput.value = String(props.editor.getAttributes('link').href ?? '');
  } else {
    props.editor.chain().focus().unsetMark('selectionMark').run();
    linkSelection.value = undefined;
  }
}

function confirmLink(locale: SidebarLocale | undefined): void {
  const href = linkInput.value.trim();
  if (!href) return;
  const { from, to } = linkSelection.value ?? props.editor.state.selection;
  const chain = props.editor.chain().focus().setTextSelection({ from, to });
  if (from !== to) chain.extendMarkRange('link').setLink({ href }).unsetMark('selectionMark').run();
  else {
    chain
      .insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] })
      .unsetMark('selectionMark')
      .run();
  }
  Toast.success({ content: locale?.linkAddSuccess ?? 'Link added' });
  linkVisible.value = false;
  linkSelection.value = undefined;
}

function removeLink(locale: SidebarLocale | undefined): void {
  props.editor.chain().focus().unsetLink().unsetMark('selectionMark').run();
  Toast.success({ content: locale?.linkRemoveSuccess ?? 'Link removed' });
  linkVisible.value = false;
  linkSelection.value = undefined;
}

function handleLinkKeydown(event: KeyboardEvent, locale: SidebarLocale | undefined): void {
  if (event.key === 'Enter') confirmLink(locale);
}

function insertImage(): void {
  if (!editorState.value.canImage) return;
  props.editor.chain().focus().insertContent({ type: 'imageUpload' }).run();
}

onMounted(() => {
  props.editor.on('transaction', refresh);
  props.editor.on('selectionUpdate', refresh);
});
onBeforeUnmount(() => {
  props.editor.off('transaction', refresh);
  props.editor.off('selectionUpdate', refresh);
});
</script>

<template>
  <div class="semi-sidebar-file-menu-bar">
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :disabled="!editorState.canUndo"
      @click="props.editor.chain().focus().undo().run()"
      ><template #icon><IconUndo /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :disabled="!editorState.canRedo"
      @click="props.editor.chain().focus().redo().run()"
      ><template #icon><IconRedo /></template
    ></Button>
    <Divider layout="vertical" />
    <Dropdown>
      <template #content>
        <DropdownMenu>
          <DropdownItem
            v-for="(level, index) in headingLevels"
            :key="level"
            :class="{
              'semi-sidebar-file-menu-bar-dropdown-item-active': props.editor.isActive('heading', {
                level,
              }),
            }"
            @click="props.editor.chain().focus().toggleHeading({ level }).run()"
          >
            <component :is="headingIcons[index]" />
          </DropdownItem>
        </DropdownMenu>
      </template>
      <span>
        <Button
          theme="borderless"
          type="tertiary"
          class="semi-sidebar-file-menu-bar-btn"
          :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isHeading }"
          ><template #icon><IconHn /></template
        ></Button>
      </span>
    </Dropdown>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isParagraph }"
      @click="props.editor.chain().focus().setParagraph().run()"
      ><template #icon><IconText /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isBulletList }"
      @click="props.editor.chain().focus().toggleBulletList().run()"
      ><template #icon><IconList /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isOrderedList }"
      @click="props.editor.chain().focus().toggleOrderedList().run()"
      ><template #icon><IconOrderedList /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isBlockquote }"
      @click="props.editor.chain().focus().setBlockquote().run()"
      ><template #icon><IconQuote /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn semi-sidebar-file-menu-bar-btn-codeblock"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isCodeBlock }"
      @click="props.editor.chain().focus().toggleCodeBlock().run()"
      >CB</Button
    >
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      @click="props.editor.chain().focus().setHorizontalRule().run()"
      ><template #icon><IconMinus /></template
    ></Button>
    <Divider layout="vertical" />
    <Button
      v-for="alignment in ['left', 'center', 'right', 'justify'] as const"
      :key="alignment"
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{
        'semi-sidebar-file-menu-bar-btn-active': props.editor.isActive({ textAlign: alignment }),
      }"
      @click="props.editor.chain().focus().setTextAlign(alignment).run()"
    >
      <template #icon>
        <IconAlignLeft v-if="alignment === 'left'" />
        <IconAlignCenter v-else-if="alignment === 'center'" />
        <IconAlignRight v-else-if="alignment === 'right'" />
        <IconAlignJustify v-else />
      </template>
    </Button>
    <Divider layout="vertical" />
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isBold }"
      @click="props.editor.chain().focus().toggleBold().run()"
      ><template #icon><IconBold /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isItalic }"
      :disabled="!editorState.canItalic"
      @click="props.editor.chain().focus().toggleItalic().run()"
      ><template #icon><IconItalic /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isStrike }"
      :disabled="!editorState.canStrike"
      @click="props.editor.chain().focus().toggleStrike().run()"
      ><template #icon><IconStrikeThrough /></template
    ></Button>
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isCode }"
      :disabled="!editorState.canCode"
      @click="props.editor.chain().focus().toggleCode().run()"
      ><template #icon><IconCode /></template
    ></Button>
    <LocaleConsumer v-slot="{ localeData }" component-name="Sidebar">
      <Dropdown trigger="click" :visible="linkVisible" @visible-change="handleLinkVisibleChange">
        <template #content>
          <div class="semi-sidebar-file-menu-bar-link-dropdown">
            <Input
              size="small"
              class="semi-sidebar-file-menu-bar-link-input"
              :value="linkInput"
              :placeholder="(localeData as SidebarLocale | undefined)?.enterLinkAddress ?? 'URL'"
              @update:value="linkInput = $event"
              @keydown="handleLinkKeydown($event, localeData as SidebarLocale | undefined)"
            />
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              :disabled="!linkInput.trim()"
              @click="confirmLink(localeData as SidebarLocale | undefined)"
              ><template #icon><IconCheckCircleStroked /></template
            ></Button>
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              :disabled="!editorState.isLink"
              @click="removeLink(localeData as SidebarLocale | undefined)"
              ><template #icon><IconDeleteStroked /></template
            ></Button>
          </div>
        </template>
        <span>
          <Button
            theme="borderless"
            type="tertiary"
            class="semi-sidebar-file-menu-bar-btn"
            :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isLink }"
            :disabled="!editorState.canLink"
            ><template #icon><IconLink /></template
          ></Button>
        </span>
      </Dropdown>
    </LocaleConsumer>
    <Divider layout="vertical" />
    <Button
      theme="borderless"
      type="tertiary"
      class="semi-sidebar-file-menu-bar-btn"
      :class="{ 'semi-sidebar-file-menu-bar-btn-active': editorState.isImage }"
      :disabled="!editorState.canImage"
      @click="insertImage"
      ><template #icon><IconImage /></template
    ></Button>
  </div>
</template>
