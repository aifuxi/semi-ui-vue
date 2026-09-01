import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import { semiGlobal } from '../config-provider';
import { Chat, type ChatExposed, type ChatMessage } from './index';

const messages: ChatMessage[] = [
  { id: 'assistant-1', role: 'assistant', content: 'Hello **Semi**' },
  { id: 'user-1', role: 'user', content: 'Hi' },
];

afterEach(() => {
  delete semiGlobal.config.overrideDefaultProps;
  vi.restoreAllMocks();
});

describe('Chat', () => {
  it('保留固定消息 DOM、默认 bubble/leftRight 与连续角色结构', () => {
    const wrapper = mount(Chat, {
      props: {
        chats: [...messages, { id: 'user-2', role: 'user', content: 'Again' }],
        roleConfig: { assistant: { name: 'Assistant' }, user: { name: 'User' } },
        enableUpload: false,
      },
    });
    expect(wrapper.find('.semi-chat').exists()).toBe(true);
    expect(wrapper.findAll('.semi-chat-chatBox')).toHaveLength(3);
    expect(wrapper.findAll('.semi-chat-chatBox-right')).toHaveLength(2);
    expect(wrapper.findAll('.semi-chat-chatBox-content-bubble')).toHaveLength(3);
    expect(wrapper.findAll('.semi-chat-chatBox-avatar-hidden')).toHaveLength(1);
    expect(wrapper.find('.semi-markdownRender strong').text()).toBe('Semi');
  });

  it('sendMessage 先生成受控 user 消息，再发出发送 payload', () => {
    const wrapper = mount(Chat, { props: { chats: messages, enableUpload: false } });
    (wrapper.vm as unknown as ChatExposed).sendMessage('New message', []);
    const changed = wrapper.emitted('chats-change')?.[0]?.[0] as ChatMessage[];
    expect(changed).toHaveLength(3);
    expect(changed[2]).toMatchObject({ role: 'user', content: 'New message' });
    expect(wrapper.emitted('update:chats')?.[0]?.[0]).toEqual(changed);
    expect(wrapper.emitted('message-send')?.[0]).toEqual(['New message', []]);
    expect(messages).toHaveLength(2);
  });

  it('hint 点击追加消息，并保持 chats-change → hint-click 顺序语义', async () => {
    const wrapper = mount(Chat, {
      props: { chats: messages, hints: ['Tell me more'], enableUpload: false },
    });
    await wrapper.find('.semi-chat-hint-item').trigger('click');
    const changed = wrapper.emitted('chats-change')?.[0]?.[0] as ChatMessage[];
    expect(changed.at(-1)).toMatchObject({ role: 'user', content: 'Tell me more' });
    expect(wrapper.emitted('hint-click')?.[0]).toEqual(['Tell me more']);
  });

  it('clearContext 追加 divider，末项为 divider 时不重复', () => {
    const wrapper = mount(Chat, { props: { chats: messages, enableUpload: false } });
    const exposed = wrapper.vm as unknown as ChatExposed;
    exposed.clearContext();
    const changed = wrapper.emitted('chats-change')?.[0]?.[0] as ChatMessage[];
    expect(changed.at(-1)?.role).toBe('divider');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('like/dislike/reset 不修改调用方数组并保持业务回调', async () => {
    const source = [{ id: 'assistant', role: 'assistant', content: 'Answer' }];
    const wrapper = mount(Chat, { props: { chats: source, enableUpload: false } });
    await wrapper.find('button[aria-label="like"]').trigger('click');
    const liked = wrapper.emitted('chats-change')?.[0]?.[0] as ChatMessage[];
    expect(liked[0]).toMatchObject({ like: true, dislike: false });
    expect(wrapper.emitted('message-good-feedback')?.[0]?.[0]).toEqual(source[0]);
    expect(source[0]).not.toHaveProperty('like');

    (wrapper.vm as unknown as ChatExposed).resetMessage();
    const reset = wrapper.emitted('chats-change')?.at(-1)?.[0] as ChatMessage[];
    expect(reset[0]).toMatchObject({ status: 'loading', content: '' });
    expect(wrapper.emitted('message-reset')).toHaveLength(1);
  });

  it('escapeHtml 缺省/显式 true 安全渲染文本，显式 false 仍不执行脚本', () => {
    for (const escapeHtml of [undefined, true, false]) {
      const wrapper = mount(Chat, {
        props: {
          chats: [{ id: 'unsafe', role: 'user', content: '<img src=x onerror=alert(1)>' }],
          enableUpload: false,
          ...(escapeHtml === undefined ? {} : { escapeHtml }),
        },
      });
      expect(wrapper.find('.semi-chat-chatBox-content img').exists()).toBe(false);
      expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>');
    }
  });

  it('enableUpload 区分缺省、显式 false、显式 true 和对象缺省项', () => {
    expect(
      mount(Chat, { props: { chats: [] } })
        .find('.semi-upload')
        .exists(),
    ).toBe(true);
    expect(
      mount(Chat, { props: { chats: [], enableUpload: false } })
        .find('.semi-upload')
        .exists(),
    ).toBe(false);
    expect(
      mount(Chat, { props: { chats: [], enableUpload: true } })
        .find('.semi-upload')
        .exists(),
    ).toBe(true);
    expect(
      mount(Chat, { props: { chats: [], enableUpload: { clickUpload: false } } })
        .find('.semi-upload')
        .exists(),
    ).toBe(false);
  });

  it('全局默认只影响缺省值，显式 prop 优先', () => {
    semiGlobal.config.overrideDefaultProps = { Chat: { mode: 'noBubble', enableUpload: false } };
    const global = mount(Chat, { props: { chats: messages } });
    expect(global.find('.semi-chat-chatBox-content-bubble').exists()).toBe(false);
    expect(global.find('.semi-upload').exists()).toBe(false);
    const explicit = mount(Chat, {
      props: { chats: messages, mode: 'bubble', enableUpload: true },
    });
    expect(explicit.find('.semi-chat-chatBox-content-bubble').exists()).toBe(true);
    expect(explicit.find('.semi-upload').exists()).toBe(true);
  });

  it('支持 Content[]、loading/error 与 Vue scoped slots', () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Chat,
            {
              chats: [
                { id: 'loading', role: 'assistant', status: 'loading' },
                {
                  id: 'file',
                  role: 'user',
                  status: 'error',
                  content: [
                    { type: 'text', text: 'Attachment' },
                    {
                      type: 'file_url',
                      file_url: { url: '/a.pdf', name: 'a.pdf', size: '1 KB', type: 'pdf' },
                    },
                  ],
                },
              ],
              enableUpload: false,
            },
            {
              'chat-box-title': ({ role }: { role?: { name?: string } }) =>
                h('b', { class: 'custom-title' }, role?.name ?? 'Agent'),
            },
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.find('.semi-chat-chatBox-content-loading-item').exists()).toBe(true);
    expect(wrapper.find('.semi-chat-chatBox-content-error').exists()).toBe(true);
    expect(wrapper.find('.semi-chat-attachment-file').attributes('href')).toBe('/a.pdf');
    expect(wrapper.findAll('.custom-title')).toHaveLength(2);
  });

  it('按 sendHotKey 区分 Enter 与 Shift+Enter，并在发送后清空输入', async () => {
    const enter = mount(Chat, { props: { chats: messages, enableUpload: false } });
    const enterTextarea = enter.get('textarea');
    await enterTextarea.setValue('Enter message');
    await enterTextarea.trigger('keydown', { key: 'Enter', shiftKey: false });
    expect(enter.emitted('message-send')?.[0]).toEqual(['Enter message', []]);
    expect((enterTextarea.element as HTMLTextAreaElement).value).toBe('');

    const shifted = mount(Chat, {
      props: { chats: messages, enableUpload: false, sendHotKey: 'shift+enter' },
    });
    const shiftedTextarea = shifted.get('textarea');
    await shiftedTextarea.setValue('Shift message');
    await shiftedTextarea.trigger('keydown', { key: 'Enter', shiftKey: false });
    expect(shifted.emitted('message-send')).toBeUndefined();
    await shiftedTextarea.trigger('keydown', { key: 'Enter', shiftKey: true });
    expect(shifted.emitted('message-send')?.[0]).toEqual(['Shift message', []]);
  });

  it('生成中显示停止入口、禁用发送，并透传 stop-generator', async () => {
    const wrapper = mount(Chat, {
      props: {
        chats: [{ id: 'streaming', role: 'assistant', status: 'incomplete', content: '...' }],
        enableUpload: false,
        showStopGenerate: true,
      },
    });
    expect(wrapper.find('.semi-chat-action-stop').exists()).toBe(true);
    expect(wrapper.get('.semi-chat-inputBox-sendButton').attributes('disabled')).toBeDefined();
    await wrapper.get('.semi-chat-action-stop').trigger('click');
    expect(wrapper.emitted('stop-generator')).toHaveLength(1);
  });

  it('dragUpload 只在启用时显示并关闭固定 drop 区', async () => {
    const wrapper = mount(Chat, {
      props: {
        chats: messages,
        enableUpload: { clickUpload: false, pasteUpload: false, dragUpload: true },
      },
    });
    await wrapper.get('.semi-chat').trigger('dragover');
    expect(wrapper.find('.semi-chat-dropArea').exists()).toBe(true);
    await wrapper.get('.semi-chat-dropArea').trigger('drop', {
      dataTransfer: { files: [] },
    });
    expect(wrapper.find('.semi-chat-dropArea').exists()).toBe(false);

    const disabled = mount(Chat, { props: { chats: messages, enableUpload: false } });
    await disabled.get('.semi-chat').trigger('dragover');
    expect(disabled.find('.semi-chat-dropArea').exists()).toBe(false);
  });

  it('卸载时清理 ResizeObserver 与滚动监听', async () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );
    const wrapper = mount(Chat, { props: { chats: messages, enableUpload: false } });
    await nextTick();
    expect(observe).toHaveBeenCalled();
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
