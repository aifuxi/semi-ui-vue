<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { getParityScenario, type ParityScenarioOptions } from '@workspace/test-infra';

const props = defineProps<ParityScenarioOptions>();
const scenario = computed(() => getParityScenario(props.scenarioId));

watchEffect(() => {
  document.documentElement.lang = props.locale;
  document.documentElement.dir = props.direction;
  document.body.setAttribute('theme-mode', props.theme);
});
</script>

<template>
  <main
    :class="['workspace-shell', { 'semi-rtl': direction === 'rtl' }]"
    data-parity-framework="vue"
    :data-parity-scenario="scenario.id"
    :data-reference-status="scenario.referenceStatus"
    :data-vue-status="scenario.vueStatus"
    :dir="direction"
  >
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
      <slot />
    </section>
    <span hidden data-testid="reference-source">{{
      scenario.referenceSource ?? 'shared harness'
    }}</span>
  </main>
</template>
