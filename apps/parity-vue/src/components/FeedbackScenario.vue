<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { ConfigProvider, type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import { Feedback, type FeedbackValue } from '@aifuxi/semi-ui-vue/feedback';

defineProps<{ direction: ConfigDirection }>();
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
          mode="popup"
          type="emoji"
          title="这次体验怎么样？"
          :motion="false"
          :get-popup-container="() => container!"
          @value-change="recordValue"
          @cancel="closePopup"
          @ok="closePopup"
        />
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
