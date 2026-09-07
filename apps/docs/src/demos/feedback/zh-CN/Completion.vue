<script setup lang="ts">
import { onBeforeUnmount, shallowReactive } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Feedback, type FeedbackMode } from '@aifuxi/semi-ui-vue/feedback';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import IllustrationSuccess from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccess';
import IllustrationSuccessDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccessDark';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/feedback.css';
import '@aifuxi/semi-theme-default/empty.css';
import '@aifuxi/semi-theme-default/input.css';

interface FeedbackState {
  mode: FeedbackMode;
  visible: boolean;
  value: string;
  showThanks: boolean;
  closeTimer?: ReturnType<typeof setTimeout>;
  resetTimer?: ReturnType<typeof setTimeout>;
}

const feedbacks = (['popup', 'modal'] as const).map((mode) =>
  shallowReactive<FeedbackState>({ mode, visible: false, value: '', showThanks: false }),
);
const thankProps = { title: ' ', footer: null };

function close(feedback: FeedbackState) {
  feedback.visible = false;
}

function complete(feedback: FeedbackState) {
  feedback.showThanks = true;
  feedback.closeTimer = setTimeout(() => {
    feedback.visible = false;
    feedback.resetTimer = setTimeout(() => {
      feedback.showThanks = false;
    }, 200);
  }, 1500);
}

onBeforeUnmount(() => {
  for (const feedback of feedbacks) {
    clearTimeout(feedback.closeTimer);
    clearTimeout(feedback.resetTimer);
  }
});
</script>

<template>
  <div>
    <template v-for="(feedback, index) in feedbacks" :key="feedback.mode">
      <template v-if="index"><br /><br /></template>
      <Button @click="feedback.visible = !feedback.visible">
        Open Feedback: {{ feedback.mode === 'popup' ? 'Popup' : 'Modal' }}, Custom
      </Button>
      <Feedback
        :visible="feedback.visible"
        :mode="feedback.mode"
        type="custom"
        title="What is your feedback on this product?"
        :ok-button-props="{ disabled: !feedback.value }"
        v-bind="feedback.showThanks ? thankProps : {}"
        @ok="complete(feedback)"
        @cancel="close(feedback)"
      >
        <Empty v-if="feedback.showThanks" description="感谢您的反馈" :style="{ padding: '30px' }">
          <template #image>
            <IllustrationSuccess :style="{ width: '150px', height: '150px' }" />
          </template>
          <template #darkModeImage>
            <IllustrationSuccessDark :style="{ width: '150px', height: '150px' }" />
          </template>
        </Empty>
        <template v-else>
          <span>这是一段自定义的内容</span>
          <TextArea @change="feedback.value = $event" />
        </template>
      </Feedback>
    </template>
  </div>
</template>
