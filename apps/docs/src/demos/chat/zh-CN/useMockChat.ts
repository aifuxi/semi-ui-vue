import { onBeforeUnmount, ref } from 'vue';
import type { ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
export function useMockChat(initial: ChatMessage[], reply: string) {
  const chats = ref<ChatMessage[]>(initial);
  let sequence = 0;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  function later(action: () => void) {
    const timer = setTimeout(() => {
      timers.delete(timer);
      action();
    }, 200);
    timers.add(timer);
  }
  function respond() {
    later(() => {
      chats.value = [
        ...chats.value,
        { id: 'reply-' + sequence++, role: 'assistant', createAt: Date.now(), content: reply },
      ];
    });
  }
  function regenerate() {
    later(() => {
      chats.value = chats.value.map((message, index) =>
        index === chats.value.length - 1
          ? { ...message, status: 'complete', content: 'This is a mock reset message.' }
          : message,
      );
    });
  }
  onBeforeUnmount(() => {
    for (const timer of timers) clearTimeout(timer);
  });
  const roleConfig = {
    user: { name: 'User', avatar: '/demos/one.svg' },
    assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
    system: { name: 'System', avatar: '/demos/two.svg' },
  };
  const uploadProps = {
    customRequest: ({ onSuccess }: UploadCustomRequestArgs) =>
      onSuccess({ url: '/demos/photo.svg' }),
    afterUpload: () => ({ url: '/demos/photo.svg' }),
  };
  return { chats, respond, regenerate, roleConfig, uploadProps };
}
