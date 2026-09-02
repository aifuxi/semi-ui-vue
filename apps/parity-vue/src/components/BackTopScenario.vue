<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection }>();
const scrollTarget = useTemplateRef<HTMLElement>('scrollTarget');
const status = shallowRef('等待操作');
const getTarget = (): HTMLElement | null => scrollTarget.value;
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div class="back-top-scenario" data-testid="back-top-vue">
      <div
        ref="scrollTarget"
        class="back-top-scenario__scroll"
        tabindex="0"
        aria-label="BackTop 滚动容器"
      >
        <div class="back-top-scenario__content">
          <strong>向下滚动查看默认回顶按钮</strong>
          <span>Element target / visibilityHeight 80</span>
        </div>
      </div>

      <BackTop
        data-parity-target="back-top-default"
        :duration="1"
        :target="getTarget"
        :visibility-height="80"
        @click="status = '点击：默认回顶'"
      />
      <BackTop
        class-name="back-top-target-custom"
        data-parity-target="back-top-custom"
        :duration="1"
        :style="{ bottom: '118px', right: '100px' }"
        :target="getTarget"
        :visibility-height="-1"
        @click="status = '点击：自定义回顶'"
      >
        <span class="back-top-scenario__custom">TOP</span>
      </BackTop>

      <output class="back-top-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
