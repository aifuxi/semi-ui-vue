<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import { shallowRef } from 'vue';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/avatar.css';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'system',
      id: '1',
      createAt: 1715676751919,
      content: "Hello, I'm your AI assistant.",
    },
    {
      role: 'user',
      id: '2',
      createAt: 1715676751919,
      content: [
        {
          type: 'text',
          text: "What's in this picture?",
        },
        {
          type: 'image_url',
          image_url: {
            url: '/demos/photo.svg',
          },
        },
      ],
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content: 'The image is a local sample illustration.',
    },
  ],
  'This is a mock response',
);
const avatar = shallowRef('null');
const title = shallowRef('null');
function time(value?: number) {
  const date = new Date(value ?? 1715676751919);
  return (
    String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
  );
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 5px">
      <span
        >Avatar rendering
        <RadioGroup v-model="avatar" type="button"
          ><Radio value="default">Default avatar</Radio><Radio value="null">No avatar</Radio
          ><Radio value="custom">Custom avatar</Radio></RadioGroup
        ></span
      ><span
        >Title rendering
        <RadioGroup v-model="title" type="button"
          ><Radio value="default">Default title</Radio><Radio value="null">No title</Radio
          ><Radio value="custom">Custom title</Radio></RadioGroup
        ></span
      >
    </div>
    <Chat
      :key="avatar + title"
      v-model:chats="chats"
      :role-config="roleConfig"
      :upload-props="uploadProps"
      :style="{
        border: '1px solid var(--semi-color-border)',
        borderRadius: '16px',
        height: '400px',
      }"
      @message-send="respond"
      ><template v-if="avatar !== 'default'" #chat-box-avatar="{ role }"
        ><Avatar
          v-if="avatar === 'custom'"
          size="extra-small"
          shape="square"
          style="flex-shrink: 0"
          >{{ role?.name }}</Avatar
        ></template
      ><template v-if="title !== 'default'" #chat-box-title="{ role, message }"
        ><span v-if="title === 'custom'" class="custom-title"
          >{{ role?.name }}
          <span style="margin-left: 10px">{{ time(message?.createAt) }}</span></span
        ></template
      ></Chat
    ></ConfigProvider
  >
</template>
