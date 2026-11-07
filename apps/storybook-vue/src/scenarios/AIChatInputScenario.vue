<script setup lang="ts">
import { AIChatInput, type Attachment } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { h, ref } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
// 与 React 使用一致的公开布尔状态，覆盖发送禁用、生成中和非圆角外观。
const query = new URLSearchParams(window.location.search);
const reviewPanels = query.get('aiInputPanels') === 'true';
const suggestions = ref(
  props.locale === 'zh-CN' ? ['总结规范', '生成行动项'] : ['Summarize spec', 'Create action items'],
);
const templateProps = reviewPanels
  ? {
      showTemplateButton: true,
      renderTemplate: (_skill: unknown, onTemplateClick: (content: string) => void) =>
        h('div', { style: { padding: '16px' } }, [
          h(Button, { onClick: () => onTemplateClick('模板内容') }, () => '使用模板'),
        ]),
    }
  : {};
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    AIChatInput: { template: '模板', configure: '配置', selected: '已选 ${count} 个' },
    Upload: { cropTitle: '裁切图片', cropOk: '确定', cropCancel: '取消' },
  },
  'en-US': {
    code: 'en-US',
    AIChatInput: { template: 'Template', configure: 'Configure', selected: '${count} selected' },
    Upload: { cropTitle: 'Crop image', cropOk: 'OK', cropCancel: 'Cancel' },
  },
};
const attachments: Attachment[] = [
  { uid: 'file-1', name: 'roadmap.pdf', size: '24 KB', status: 'success' },
];
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="ai-chat-input-scenario" data-testid="ai-chat-input-vue">
      <Button
        v-if="reviewPanels"
        data-action="show-suggestions"
        size="small"
        @click="suggestions = [...suggestions, '深入了解']"
        >显示建议</Button
      >
      <section class="ai-chat-input-scenario__card" data-parity-target="ai-chat-input-main">
        <AIChatInput
          v-bind="{
            ...templateProps,
            ...(query.get('aiInputCanSend') === 'false' ? { canSend: false } : {}),
          }"
          :generating="query.get('aiInputGenerating') === 'true'"
          :round="query.get('aiInputRound') !== 'false'"
          :placeholder="
            props.locale === 'zh-CN'
              ? '请输入问题，按 Enter 发送'
              : 'Ask a question and press Enter'
          "
          default-content="<p>Semi UI Vue parity</p>"
          :references="[
            {
              id: 'ref-1',
              type: 'text',
              content: props.locale === 'zh-CN' ? '产品规范' : 'Product spec',
            },
          ]"
          :upload-props="{ action: '', defaultFileList: attachments }"
          :suggestions="suggestions"
          :skills="[
            { value: 'search', label: props.locale === 'zh-CN' ? '联网搜索' : 'Web search' },
          ]"
          skill-hot-key="/"
        />
      </section>
    </div>
  </ConfigProvider>
</template>
