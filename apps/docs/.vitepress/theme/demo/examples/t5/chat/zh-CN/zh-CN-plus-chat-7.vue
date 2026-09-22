<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
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
          text: '这张图片里有什么？',
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
      content: '图片中是本地示例插画。',
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
        >头像渲染模式
        <RadioGroup v-model="avatar" type="button"
          ><Radio value="default">默认头像</Radio><Radio value="null">无头像</Radio
          ><Radio value="custom">自定义头像</Radio></RadioGroup
        ></span
      ><span
        >标题渲染模式
        <RadioGroup v-model="title" type="button"
          ><Radio value="default">默认标题</Radio><Radio value="null">无标题</Radio
          ><Radio value="custom">自定义标题</Radio></RadioGroup
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
