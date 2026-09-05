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
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
import { h, onMounted, shallowRef } from 'vue';
import type { TypographyCopyableConfig } from '@aifuxi/semi-ui-vue/typography';
const timestamp = shallowRef<number>();
onMounted(() => {
  timestamp.value = Date.now() / 1000;
});
function notifyCopy(_event: MouseEvent | KeyboardEvent, _content: string, success: boolean) {
  if (success) Toast.success({ content: 'Successfully copied.' });
}

// The render callback keeps the copy action available in both states.
const customCopy: TypographyCopyableConfig = {
  content: 'Custom render!',
  render: (copied, copy, config) =>
    h(Button, { size: 'small', onClick: copy }, () =>
      copied ? 'Copy success' : 'Click to copy: ' + config.content,
    ),
};
</script>

<template>
  <div>
    <Paragraph copyable>Click the right icon to copy text.</Paragraph>
    <Paragraph :copyable="{ content: 'Hello, Semi Design!' }">Click to copy text.</Paragraph>
    <Paragraph copyable @copy="notifyCopy">Click the right icon to copy.</Paragraph>
    Timestamp:
    <Numeral v-if="timestamp !== undefined" truncate="ceil" copyable underline
      >{{ timestamp }}s</Numeral
    >
    <Paragraph copyable>
      Custom Copy Node
      <template #copyIcon><IconSetting style="color: var(--semi-color-link)" /></template>
    </Paragraph>
    <Paragraph :copyable="customCopy">Custom Copy Render</Paragraph>
    <br /><br />
    <Text type="secondary">Paste here:</Text><br />
    <TextArea autosize style="width: 320px; margin-top: 4px" :rows="3" aria-label="Paste here" />
  </div>
</template>
