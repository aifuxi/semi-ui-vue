<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Text, Paragraph, Numeral } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { h, onMounted, shallowRef } from 'vue';
import type { TypographyCopyableConfig } from '@aifuxi/semi-ui-vue/typography';
const timestamp = shallowRef<number>();
onMounted(() => {
  timestamp.value = Date.now() / 1000;
});
function notifyCopy(_event: MouseEvent | KeyboardEvent, _content: string, success: boolean) {
  if (success) Toast.success({ content: '复制文本成功' });
}

// The render callback keeps the copy action available in both states.
const customCopy: TypographyCopyableConfig = {
  content: 'Custom render!',
  render: (copied, copy, config) =>
    h(Button, { size: 'small', onClick: copy }, () =>
      h('span', copied ? '复制成功' : '点击复制:' + config.content),
    ),
};
</script>

<template>
  <div>
    <Paragraph copyable>点击右边的图标复制文本。</Paragraph>
    <Paragraph :copyable="{ content: 'Hello, Semi Design!' }">点击复制文本。</Paragraph>
    <Paragraph copyable @copy="notifyCopy">点击右边的图标复制文本。</Paragraph>
    时间戳:
    <Numeral v-if="timestamp !== undefined" truncate="ceil" copyable underline
      >{{ timestamp }}s</Numeral
    >
    <Paragraph :copyable="{ icon: h(IconSetting, { style: { color: 'var(--semi-color-link)' } }) }"
      >自定义复制节点</Paragraph
    >
    <Paragraph :copyable="customCopy">自定义复制渲染</Paragraph>
    <br /><br />
    <Text type="secondary">粘贴区域：</Text><br />
    <TextArea autosize style="width: 320px; margin-top: 4px" :rows="3" aria-label="粘贴区域" />
  </div>
</template>
