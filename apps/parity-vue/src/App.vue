<script setup lang="ts">
import { computed, type Component } from 'vue';
import {
  getParityScenario,
  getParityScenarioRuntimeProps,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import HarnessCalibration from './components/HarnessCalibration.vue';
import UnavailableScenario from './components/UnavailableScenario.vue';
import { getAsyncVueScenarioComponent } from './scenario-registry';

const props = withDefaults(
  defineProps<Partial<ParityScenarioOptions> & { scenarioComponent?: Component | undefined }>(),
  {
    scenarioId: 'harness-calibration',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
    scenarioComponent: undefined,
  },
);

const scenario = computed(() => getParityScenario(props.scenarioId));
const scenarioComponent = computed(
  () =>
    props.scenarioComponent ??
    (scenario.value.id === 'harness-calibration'
      ? HarnessCalibration
      : getAsyncVueScenarioComponent(props.scenarioId)),
);
const scenarioComponentProps = computed(() =>
  getParityScenarioRuntimeProps({
    scenarioId: props.scenarioId,
    theme: props.theme,
    direction: props.direction,
    locale: props.locale,
  }),
);
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

      <Suspense v-if="scenarioComponent">
        <component :is="scenarioComponent" v-bind="scenarioComponentProps" />
        <template #fallback>
          <span data-parity-scenario-loading>场景加载中</span>
        </template>
      </Suspense>
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
