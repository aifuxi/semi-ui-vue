import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AIChatInput from './AIChatInput.vue';
import type { AIChatInputExposed, Attachment, Skill } from './types';

beforeAll(() => {
  // JSDOM does not implement Range geometry. ProseMirror reads it when an
  // editor command focuses or scrolls the selection into view.
  if (!Range.prototype.getClientRects) {
    Object.defineProperty(Range.prototype, 'getClientRects', {
      configurable: true,
      value: () => [new DOMRect()],
    });
  }
  if (!Range.prototype.getBoundingClientRect) {
    Object.defineProperty(Range.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => new DOMRect(),
    });
  }
});

async function mountInput(props: Record<string, unknown> = {}) {
  const wrapper = mount(AIChatInput, {
    attachTo: document.body,
    props: { placeholder: 'Ask anything', ...props },
  });
  await flushPromises();
  await nextTick();
  return wrapper;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe('AIChatInput', () => {
  it('renders the Tiptap editor and default-true public areas', async () => {
    const attachment: Attachment = {
      uid: 'a-1',
      name: 'notes.txt',
      size: '2 KB',
      status: 'success',
    };
    const wrapper = await mountInput({
      references: [{ id: 'r-1', type: 'text', content: 'Reference' }],
      uploadProps: { action: '', defaultFileList: [attachment] },
    });

    expect(wrapper.find('.ProseMirror[contenteditable="true"]').exists()).toBe(true);
    expect(wrapper.find('.semi-aiChatInput-reference').text()).toContain('Reference');
    expect(wrapper.find('.semi-aiChatInput-attachment').text()).toContain('notes.txt');
    expect(wrapper.find('.semi-aiChatInput-footer-action-upload').exists()).toBe(true);
    expect(wrapper.find('.semi-aiChatInput-footer-round').exists()).toBe(true);
  });

  it('honors explicit false for every default-true rendering prop', async () => {
    const wrapper = await mountInput({
      references: [{ id: 'r-1', type: 'text', content: 'Reference' }],
      uploadProps: {
        action: '',
        defaultFileList: [{ uid: 'a-1', name: 'notes.txt', size: 2, status: 'success' }],
      },
      showReference: false,
      showUploadFile: false,
      showUploadButton: false,
      round: false,
    });

    expect(wrapper.find('.semi-aiChatInput-references').exists()).toBe(false);
    expect(wrapper.find('.semi-aiChatInput-scroll-wrapper').exists()).toBe(false);
    expect(wrapper.find('.semi-aiChatInput-footer-action-upload').exists()).toBe(false);
    expect(wrapper.find('.semi-aiChatInput-footer-round').exists()).toBe(false);
  });

  it('emits transformed content and sends the public message payload', async () => {
    const wrapper = await mountInput({ references: [{ id: 'r-1', type: 'text' }] });
    const exposed = wrapper.vm as unknown as AIChatInputExposed;
    exposed.setContent('<p>Hello <strong>world</strong></p>');
    await flushPromises();

    expect(wrapper.emitted('contentChange')?.at(-1)?.[0]).toEqual([
      { type: 'text', text: 'Hello world' },
    ]);
    const send = wrapper.find<HTMLButtonElement>('.semi-aiChatInput-footer-action-send');
    expect(send.element.disabled).toBe(false);
    await send.trigger('click');
    expect(wrapper.emitted('messageSend')?.at(-1)?.[0]).toMatchObject({
      references: [{ id: 'r-1', type: 'text' }],
      inputContents: [{ type: 'text', text: 'Hello world' }],
      setup: {},
    });
  });

  it('uses explicit canSend and switches to stop behavior while generating', async () => {
    const wrapper = await mountInput({ canSend: false });
    (wrapper.vm as unknown as AIChatInputExposed).setContent('blocked');
    await flushPromises();
    const send = wrapper.find<HTMLButtonElement>('.semi-aiChatInput-footer-action-send');
    expect(send.element.disabled).toBe(true);
    await send.trigger('click');
    expect(wrapper.emitted('messageSend')).toBeUndefined();

    await wrapper.setProps({ generating: true });
    await wrapper.find('.semi-aiChatInput-footer-action-stop').trigger('click');
    expect(wrapper.emitted('stopGenerate')).toHaveLength(1);
  });

  it('clears on generating by default and preserves content when explicitly disabled', async () => {
    const clearing = await mountInput();
    (clearing.vm as unknown as AIChatInputExposed).setContent('clear me');
    await flushPromises();
    await clearing.setProps({ generating: true });
    await flushPromises();
    expect((clearing.vm as unknown as AIChatInputExposed).getEditor()?.getText()).toBe('');
    clearing.unmount();

    const preserving = await mountInput({ clearContentOnGenerating: false });
    (preserving.vm as unknown as AIChatInputExposed).setContent('keep me');
    await flushPromises();
    await preserving.setProps({ generating: true });
    await flushPromises();
    expect((preserving.vm as unknown as AIChatInputExposed).getEditor()?.getText()).toBe('keep me');
  });

  it('supports suggestion and skill keyboard/click flows', async () => {
    const skills: Skill[] = [{ value: 'search', label: 'Search', hasTemplate: true }];
    const wrapper = await mountInput({ suggestions: ['Summarize'], skills, skillHotKey: '/' });
    await wrapper.find('.semi-aiChatInput-editor-content').trigger('click');
    await flushPromises();
    const suggestion = document.querySelector<HTMLElement>('.semi-aiChatInput-suggestion-item');
    expect(suggestion?.textContent).toContain('Summarize');
    suggestion?.click();
    await flushPromises();
    expect(wrapper.emitted('suggestClick')?.[0]).toEqual(['Summarize']);

    (wrapper.vm as unknown as AIChatInputExposed).setContent('');
    await wrapper.find('.ProseMirror').trigger('keydown', { key: '/' });
    await flushPromises();
    const skill = document.querySelector<HTMLElement>('.semi-aiChatInput-skill-item');
    expect(skill?.textContent).toContain('Search');
    skill?.click();
    await flushPromises();
    expect(wrapper.emitted('skillChange')?.at(-1)?.[0]).toMatchObject({ value: 'search' });
    expect((wrapper.vm as unknown as AIChatInputExposed).getEditor()?.getHTML()).toContain(
      'skill-slot',
    );
  });

  it('exposes template visibility, focus and skill-preserving content methods', async () => {
    const wrapper = await mountInput({
      skills: [{ value: 'search', label: 'Search', hasTemplate: true }],
      renderTemplate: (_skill: Skill | undefined, select: (content: string) => void) =>
        // A public render function remains valid alongside the Vue slot mapping.
        String(select) && 'Template content',
    });
    const exposed = wrapper.vm as unknown as AIChatInputExposed;
    exposed.setContent(
      '<skill-slot data-value="search" data-label="Search" data-template="true"></skill-slot>',
    );
    await flushPromises();
    exposed.setContentWhileSaveTool('query');
    await flushPromises();
    expect(exposed.getEditor()?.getHTML()).toContain('query');
    exposed.changeTemplateVisible(true);
    await flushPromises();
    expect(document.body.textContent).toContain('Template content');
    expect(wrapper.emitted('templateVisibleChange')?.at(-1)).toEqual([true]);
    exposed.focusEditor();
    await flushPromises();
    expect(exposed.getEditor()).toBeDefined();
  });
});
