<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@workspace/ui';

const status = shallowRef('等待操作');
</script>

<template>
  <div class="steps-scenario" data-testid="steps-vue">
    <div class="steps-scenario__section">
      <span class="steps-scenario__label">Fill</span>
      <Steps
        aria-label="Fill progress"
        :current="1"
        data-parity-target="steps-fill"
        @change="(index) => (status = `Fill：${index}`)"
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
        @change="(index) => (status = `Basic：${index}`)"
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
        type="nav"
        @change="(index) => (status = `Nav：${index}`)"
      >
        <Step title="Register account" />
        <Step title="Product usage" />
        <Step title="Try features" />
      </Steps>
    </div>
    <output class="steps-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
