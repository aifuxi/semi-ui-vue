import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import { semiGlobal } from '../config-provider';
import {
  AIChatDialogue,
  chatCompletionToMessage,
  chatInputToChatCompletion,
  chatInputToMessage,
  messageToChatInput,
  responseToMessage,
} from './index';
import type { AIChatDialogueExpose, Message } from './types';

const roleConfig = {
  user: { name: 'User' },
  assistant: { name: 'Assistant' },
};
const plainRender = {
  renderDialogueContent: ({ message, className }: { message?: Message; className?: string }) =>
    h('div', { class: className }, String(message?.content ?? '')),
};

describe('AIChatDialogue', () => {
  beforeEach(() => {
    semiGlobal.config = {};
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(performance.now());
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    semiGlobal.config = {};
    document.body.replaceChildren();
  });

  it('保留默认 align/mode/class，并区分默认 true Boolean 的显式 false', async () => {
    const messages: Message[] = [
      { id: 'user', role: 'user', content: '<b>question</b>', status: 'completed' },
      { id: 'assistant', role: 'assistant', content: 'answer', status: 'completed' },
    ];
    const defaultWrapper = mount(AIChatDialogue, {
      props: { chats: messages, roleConfig, dialogueRenderConfig: plainRender },
    });
    expect(defaultWrapper.find('.semi-ai-chat-dialogue').exists()).toBe(true);
    expect(defaultWrapper.findAll('.semi-ai-chat-dialogue-content-bubble')).toHaveLength(2);
    expect(defaultWrapper.find('.semi-ai-chat-dialogue-container-right').exists()).toBe(true);

    semiGlobal.config.overrideDefaultProps = { AIChatDialogue: { showReset: false } };
    const explicit = mount(AIChatDialogue, {
      props: {
        chats: messages,
        roleConfig,
        align: 'leftAlign',
        mode: 'noBubble',
        escapeHtml: false,
        showReset: true,
        dialogueRenderConfig: plainRender,
      },
    });
    expect(explicit.find('.semi-ai-chat-dialogue-container-right').exists()).toBe(false);
    expect(explicit.findAll('.semi-ai-chat-dialogue-content-no-bubble')).toHaveLength(2);
    expect(explicit.find('[aria-label="reset message"]').exists()).toBe(true);
  });

  it('选择模式、selectAll 与 deselectAll 只发出完整 id 列表', async () => {
    const wrapper = mount(AIChatDialogue, {
      props: {
        chats: [
          { id: 'one', role: 'assistant', content: 'one' },
          { id: 'two', role: 'user', content: 'two' },
        ],
        roleConfig,
        selecting: true,
        dialogueRenderConfig: plainRender,
      },
    });
    expect(wrapper.findAll('.semi-ai-chat-dialogue-checkbox')).toHaveLength(2);
    (wrapper.vm as unknown as AIChatDialogueExpose).selectAll();
    await nextTick();
    expect(wrapper.emitted('select')?.at(-1)).toEqual([['one', 'two']]);
    (wrapper.vm as unknown as AIChatDialogueExpose).deselectAll();
    expect(wrapper.emitted('select')?.at(-1)).toEqual([[]]);
  });

  it('hint 先更新受控 chats，再通知 hint-click，且不修改原数组', async () => {
    const order: string[] = [];
    const chats: Message[] = [{ id: 'one', role: 'assistant', content: 'one' }];
    const wrapper = mount(AIChatDialogue, {
      props: {
        chats,
        hints: ['继续'],
        roleConfig,
        dialogueRenderConfig: plainRender,
        'onUpdate:chats': () => order.push('update'),
        onChatsChange: () => order.push('change'),
        onHintClick: () => order.push('hint'),
      },
    });
    await wrapper.get('.semi-ai-chat-dialogue-hint-item').trigger('click');
    expect(order).toEqual(['update', 'change', 'hint']);
    expect(chats).toHaveLength(1);
    expect(wrapper.emitted('update:chats')?.[0]?.[0]).toMatchObject([
      { id: 'one' },
      { role: 'user', content: '继续' },
    ]);
  });

  it('like/dislike/edit 维持互斥、不可变与事件顺序', async () => {
    const assistant: Message = {
      id: 'assistant',
      role: 'assistant',
      content: 'answer',
      status: 'completed',
    };
    const wrapper = mount(AIChatDialogue, {
      props: { chats: [assistant], roleConfig, dialogueRenderConfig: plainRender },
    });
    await wrapper.get('[aria-label="good feedback"]').trigger('click');
    expect(wrapper.emitted('message-good-feedback')?.[0]).toEqual([assistant]);
    expect(wrapper.emitted('update:chats')?.[0]?.[0]).toMatchObject([
      { id: 'assistant', like: true, dislike: false },
    ]);
    expect(assistant.like).toBeUndefined();

    const userWrapper = mount(AIChatDialogue, {
      props: {
        chats: [{ id: 'user', role: 'user', content: 'question', status: 'completed' }],
        roleConfig,
        dialogueRenderConfig: plainRender,
      },
    });
    await userWrapper.get('[aria-label="edit message"]').trigger('click');
    expect(userWrapper.emitted('message-edit')).toHaveLength(1);
    expect(userWrapper.emitted('update:chats')?.[0]?.[0]).toMatchObject([
      { id: 'user', editing: true },
    ]);
  });

  it('渲染多模态、annotation、reasoning、tool call 与 reference 公开结构', async () => {
    const wrapper = mount(AIChatDialogue, {
      props: {
        chats: [
          {
            id: 'multi',
            role: 'assistant',
            status: 'completed',
            references: [{ id: 'ref', name: 'guide.pdf' }],
            content: [
              {
                type: 'message',
                content: [
                  {
                    type: 'output_text',
                    text: 'answer',
                    annotations: [{ title: 'source', logo: 'source.png' }],
                  },
                ],
              },
              {
                type: 'reasoning',
                status: 'completed',
                summary: [{ type: 'summary_text', text: 'reason' }],
              },
              { type: 'function_call', name: 'lookup', arguments: '{"id":1}' },
            ],
          },
        ],
        roleConfig,
      },
    });
    expect(wrapper.find('.semi-ai-chat-dialogue-references').exists()).toBe(true);
    expect(wrapper.find('.semi-ai-chat-dialogue-annotation-wrapper').exists()).toBe(true);
    expect(wrapper.find('.semi-ai-chat-dialogue-reasoning-wrapper').exists()).toBe(true);
    expect(wrapper.find('.semi-ai-chat-dialogue-content-tool-call').text()).toContain('lookup');
  });

  it('render config、content item default 与 Vue scoped slot 都能替换默认节点', () => {
    const Host = defineComponent({
      components: { AIChatDialogue },
      setup: () => ({ roleConfig }),
      template: `
        <AIChatDialogue
          :chats="[{ id: 'one', role: 'assistant', content: 'answer' }]"
          :role-config="roleConfig"
        >
          <template #dialogue-title="{ message }"><strong class="slot-title">{{ message.id }}</strong></template>
        </AIChatDialogue>`,
    });
    const wrapper = mount(Host);
    expect(wrapper.get('.slot-title').text()).toBe('one');

    const custom = mount(AIChatDialogue, {
      props: {
        chats: [{ id: 'two', role: 'assistant', content: 'answer' }],
        roleConfig,
        renderDialogueContentItem: {
          default: (content: unknown) => h('span', { class: 'custom-default' }, String(content)),
        },
      },
    });
    expect(custom.get('.custom-default').text()).toBe('answer');
  });

  it('固定数据适配器覆盖 Chat Completion、Response 与 AIChatInput 路径', () => {
    expect(
      chatCompletionToMessage({
        id: 'completion',
        choices: [{ index: 0, message: { role: 'assistant', content: 'done' } }],
      })[0],
    ).toMatchObject({ role: 'assistant' });
    expect(
      responseToMessage({
        id: 'response',
        status: 'completed',
        output: [{ type: 'message', role: 'assistant', content: [] }],
      }),
    ).toMatchObject({ id: 'response', role: 'assistant' });
    const input = { inputContents: [{ type: 'text', text: 'hello' }], attachments: [] };
    const message = chatInputToMessage(input);
    expect(message.role).toBe('user');
    expect(chatInputToChatCompletion(input).messages).toHaveLength(1);
    expect(messageToChatInput(message)).toMatchObject({
      inputContents: [{ type: 'text', text: 'hello' }],
    });
  });
});
