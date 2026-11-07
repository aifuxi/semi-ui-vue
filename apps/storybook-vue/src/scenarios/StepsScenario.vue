<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@aifuxi/semi-ui-vue/steps';

const status = shallowRef('等待操作');
// 查询仅扩展视觉复核尺寸，保留默认场景原有大小。
const small = new URLSearchParams(window.location.search).get('stepsSize') === 'small';
</script>

<template>
  <div class="steps-scenario" data-testid="steps-vue">
    <div class="steps-scenario__section">
      <span class="steps-scenario__label">Fill</span>
      <Steps
        :size="small ? 'small' : 'default'"
        aria-label="Fill progress"
        :current="1"
        data-parity-target="steps-fill"
        @change="(index: number) => (status = `Fill：${index}`)"
      >
        <Step title="Finished" description="This is a description" />
        <Step title="In Progress" description="This is a description" />
        <Step title="Waiting" description="This is a description" />
      </Steps>
    </div>
    <div class="steps-scenario__section">
      <span class="steps-scenario__label">Basic small</span>
      <Steps
        :current="1"
        data-parity-target="steps-basic"
        size="small"
        type="basic"
        @change="(index: number) => (status = `Basic：${index}`)"
      >
        <Step title="Finished" description="This is a description" />
        <Step title="In Progress" description="This is a description" />
        <Step status="warning" title="Waiting" description="This is a description" />
      </Steps>
    </div>
    <div class="steps-scenario__section steps-scenario__vertical">
      <span class="steps-scenario__label">Basic vertical error</span>
      <Steps
        :current="1"
        data-parity-target="steps-vertical"
        :size="small ? 'small' : 'default'"
        direction="vertical"
        status="error"
        :style="{ width: '300px' }"
        type="basic"
      >
        <Step title="Finished" description="This is a description" />
        <Step title="Error" description="This is a description" />
        <Step title="Waiting" description="This is a description" />
      </Steps>
    </div>
    <div class="steps-scenario__section">
      <span class="steps-scenario__label">Nav</span>
      <Steps
        :current="1"
        data-parity-target="steps-nav"
        :size="small ? 'small' : 'default'"
        type="nav"
        @change="(index: number) => (status = `Nav：${index}`)"
      >
        <Step title="Register account" />
        <Step title="Product usage" />
        <Step title="Try features" />
      </Steps>
    </div>
    <output class="steps-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
