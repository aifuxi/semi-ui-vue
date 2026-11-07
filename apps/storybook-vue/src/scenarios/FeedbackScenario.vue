<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { ConfigProvider, type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import { Feedback, type FeedbackValue } from '@aifuxi/semi-ui-vue/feedback';

defineProps<{ direction: ConfigDirection }>();
// 与 React 固定基线使用相同公开 props，补齐反馈内容和容器变体。
const query = new URLSearchParams(window.location.search);
const requestedType = query.get('feedbackType');
const reviewType =
  requestedType === 'text' ||
  requestedType === 'radio' ||
  requestedType === 'checkbox' ||
  requestedType === 'custom'
    ? requestedType
    : 'emoji';
const reviewMode = query.get('feedbackMode') === 'modal' ? 'modal' : 'popup';
const container = useTemplateRef<HTMLDivElement>('container');
const mounted = ref(false);
const popupVisible = ref(true);
const modalVisible = ref(false);
const lastValue = ref('未选择');

onMounted(() => {
  mounted.value = true;
});

function recordValue(value: Exclude<FeedbackValue, null>): void {
  lastValue.value = JSON.stringify(value);
}

function closePopup(): void {
  popupVisible.value = false;
}

function closeModal(): void {
  modalVisible.value = false;
}
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="feedback-scenario">
      <div class="feedback-scenario__actions">
        <button type="button" data-action="open-feedback-popup" @click="popupVisible = true">
          打开表情反馈
        </button>
        <button type="button" data-action="open-feedback-modal" @click="modalVisible = true">
          打开单选反馈
        </button>
        <span role="status">最近选择：{{ lastValue }}</span>
      </div>
      <div ref="container" class="feedback-scenario__stage" data-testid="feedback-vue">
        <span class="feedback-scenario__backdrop-label">体验反馈工作台</span>
        <Feedback
          v-if="mounted"
          v-model:visible="popupVisible"
          data-parity-target="feedback-basic"
          :mode="reviewMode"
          :type="reviewType"
          :radio-group-props="{
            options: [
              { label: '交互不够清晰', value: 'interaction' },
              { label: '响应速度较慢', value: 'performance' },
              { label: '功能不符合预期', value: 'feature' },
            ],
          }"
          :checkbox-group-props="{
            options: [
              { label: '交互不够清晰', value: 'interaction' },
              { label: '响应速度较慢', value: 'performance' },
              { label: '功能不符合预期', value: 'feature' },
            ],
          }"
          title="这次体验怎么样？"
          :motion="false"
          :get-popup-container="() => container!"
          @value-change="recordValue"
          @cancel="closePopup"
          @ok="closePopup"
        >
          <p v-if="reviewType === 'custom'">请留下你的使用建议。</p>
        </Feedback>
        <Feedback
          v-if="mounted"
          v-model:visible="modalVisible"
          mode="modal"
          type="radio"
          title="主要问题是什么？"
          :motion="false"
          :get-popup-container="() => container!"
          :radio-group-props="{
            options: [
              { label: '交互不够清晰', value: 'interaction' },
              { label: '响应速度较慢', value: 'performance' },
              { label: '功能不符合预期', value: 'feature' },
            ],
          }"
          @value-change="recordValue"
          @cancel="closeModal"
          @ok="closeModal"
        />
      </div>
    </div>
  </ConfigProvider>
</template>
