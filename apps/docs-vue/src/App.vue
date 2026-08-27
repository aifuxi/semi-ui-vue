<script setup lang="ts">
import { computed } from 'vue';
import {
  getParityScenario,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import ButtonTypesScenario from './components/ButtonTypesScenario.vue';
import ButtonContractScenario from './components/ButtonContractScenario.vue';
import ConfigProviderScenario from './components/ConfigProviderScenario.vue';
import DividerScenario from './components/DividerScenario.vue';
import FloatButtonScenario from './components/FloatButtonScenario.vue';
import GridScenario from './components/GridScenario.vue';
import IconScenario from './components/IconScenario.vue';
import LayoutScenario from './components/LayoutScenario.vue';
import ResizableScenario from './components/ResizableScenario.vue';
import SpaceScenario from './components/SpaceScenario.vue';
import TypographyScenario from './components/TypographyScenario.vue';
import HarnessCalibration from './components/HarnessCalibration.vue';
import UnavailableScenario from './components/UnavailableScenario.vue';

const props = withDefaults(defineProps<Partial<ParityScenarioOptions>>(), {
  scenarioId: 'harness-calibration',
  theme: 'light',
  direction: 'ltr',
  locale: 'zh-CN',
});

const scenario = computed(() => getParityScenario(props.scenarioId));
</script>

<template>
  <main
    :class="['workspace-shell', { 'semi-rtl': props.direction === 'rtl' }]"
    data-parity-framework="vue"
    :data-parity-scenario="scenario.id"
    :data-reference-status="scenario.referenceStatus"
    :data-vue-status="scenario.vueStatus"
    :dir="props.direction"
  >
    <header class="workspace-header">
      <p class="workspace-shell__eyebrow">Vue parity target</p>
      <h1>Semi UI Vue 对照工作台</h1>
      <p>
        当前固定参考版本为
        <code>{{ REFERENCE_BASELINE.tag }}</code>
        ，Vue 场景只在实现和证据齐全后进入可比较状态。
      </p>
    </header>

    <section class="scenario-panel" aria-labelledby="scenario-title">
      <div class="scenario-panel__heading">
        <div>
          <p class="scenario-panel__id">{{ scenario.id }}</p>
          <h2 id="scenario-title">{{ scenario.title }}</h2>
        </div>
        <span class="scenario-status" :data-status="scenario.vueStatus">
          Vue {{ scenario.vueStatus }}
        </span>
      </div>
      <p class="scenario-panel__description">{{ scenario.description }}</p>

      <HarnessCalibration v-if="scenario.id === 'harness-calibration'" />
      <ButtonTypesScenario v-else-if="scenario.id === 'button-types'" />
      <ButtonContractScenario v-else-if="scenario.id === 'button-contract'" />
      <ConfigProviderScenario v-else-if="scenario.id === 'config-provider'" />
      <DividerScenario v-else-if="scenario.id === 'divider'" />
      <FloatButtonScenario v-else-if="scenario.id === 'float-button'" />
      <GridScenario v-else-if="scenario.id === 'grid'" />
      <IconScenario v-else-if="scenario.id === 'icon'" />
      <LayoutScenario v-else-if="scenario.id === 'layout'" />
      <ResizableScenario v-else-if="scenario.id === 'resizable'" />
      <SpaceScenario v-else-if="scenario.id === 'space'" />
      <TypographyScenario v-else-if="scenario.id === 'typography'" />
      <UnavailableScenario
        v-else
        :scenario-id="scenario.id"
        :reference-source="scenario.referenceSource"
      />
    </section>

    <dl class="runtime-evidence" aria-label="Vue 对照状态">
      <div>
        <dt>commit</dt>
        <dd>{{ REFERENCE_BASELINE.commit }}</dd>
      </div>
      <div>
        <dt>source</dt>
        <dd data-testid="reference-source">{{ scenario.referenceSource ?? 'shared harness' }}</dd>
      </div>
    </dl>
  </main>
</template>
