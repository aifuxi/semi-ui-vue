<script setup lang="ts">
import { h, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { ConfigProvider, UserGuide } from '@aifuxi/semi-ui-vue';
import type { ConfigDirection, UserGuideMode, UserGuideStepItem } from '@aifuxi/semi-ui-vue';

const props = defineProps<{ direction: ConfigDirection }>();
const first = useTemplateRef<HTMLButtonElement>('first');
const second = useTemplateRef<HTMLDivElement>('second');
const third = useTemplateRef<HTMLDivElement>('third');
const ready = ref(false);
const visible = ref(false);
const mode = ref<UserGuideMode>('popup');
const current = ref(0);
const status = ref('步骤 1');
const cover =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop stop-color="%234f7cff"/%3E%3Cstop offset="1" stop-color="%237d5cff"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="200" rx="8" fill="url(%23g)"/%3E%3Ccircle cx="315" cy="40" r="72" fill="white" fill-opacity=".14"/%3E%3Cpath d="M58 130h140M58 98h210M58 66h170" stroke="white" stroke-width="14" stroke-linecap="round"/%3E%3C/svg%3E';

const steps = ref<UserGuideStepItem[]>([]);

onMounted(() => {
  steps.value = [
    {
      target: () => first.value,
      cover: h('img', { src: cover, alt: '引导封面' }),
      title: '发现协作入口',
      description: '从这里开始创建一条新的协作任务。',
      position: props.direction === 'rtl' ? 'left' : 'right',
    },
    {
      target: () => second.value,
      title: '查看任务进度',
      description: '状态会在处理过程中持续更新。',
      spotlightPadding: 8,
      theme: 'primary',
      position: 'bottom',
    },
    {
      target: () => third.value,
      title: '完成设置',
      description: '你随时可以重新打开这份引导。',
      showArrow: false,
      position: 'top',
    },
  ];
  ready.value = true;
  visible.value = true;
});

async function open(nextMode: UserGuideMode): Promise<void> {
  visible.value = false;
  mode.value = nextMode;
  current.value = 0;
  await nextTick();
  visible.value = true;
}

function changeStep(nextCurrent: number): void {
  current.value = nextCurrent;
  status.value = `步骤 ${nextCurrent + 1}`;
}

function finish(): void {
  status.value = '已完成';
  visible.value = false;
}

function skip(): void {
  status.value = '已跳过';
  visible.value = false;
}
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div class="user-guide-scenario">
      <div class="user-guide-scenario__actions">
        <button type="button" data-action="open-user-guide-popup" @click="open('popup')">
          气泡引导
        </button>
        <button type="button" data-action="open-user-guide-modal" @click="open('modal')">
          弹窗引导
        </button>
        <span role="status">{{ status }}</span>
      </div>
      <div class="user-guide-scenario__stage" data-testid="user-guide-vue">
        <button
          ref="first"
          type="button"
          class="user-guide-scenario__target user-guide-scenario__target--primary"
        >
          创建协作
        </button>
        <div ref="second" class="user-guide-scenario__target user-guide-scenario__target--status">
          处理中 · 68%
        </div>
        <div ref="third" class="user-guide-scenario__target user-guide-scenario__target--summary">
          今日完成 12 项
        </div>
        <UserGuide
          v-if="ready"
          v-model:current="current"
          :visible="visible"
          :mode="mode"
          mask
          :steps="steps"
          @change="changeStep"
          @finish="finish"
          @skip="skip"
        />
      </div>
    </div>
  </ConfigProvider>
</template>
