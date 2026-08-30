<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';
import type { ConfigContextValue } from '@aifuxi/semi-ui-vue';

const props = defineProps<{ context: ConfigContextValue }>();
const screens = shallowRef(props.context.screens);
let unsubscribe: (() => void) | undefined;

const activeScreens = computed(() =>
  Object.entries(screens.value)
    .filter(([, matches]) => matches)
    .map(([screen]) => screen)
    .join(','),
);

onMounted(() => {
  unsubscribe = props.context.onBreakpoint((nextScreens) => {
    screens.value = nextScreens;
  });
});
onBeforeUnmount(() => unsubscribe?.());
</script>

<template>
  <section class="config-provider-scenario__card" data-parity-target="config-provider-card">
    <strong data-parity-target="config-provider-direction">
      {{ `direction: ${props.context.direction}` }}
    </strong>
    <span>{{ `locale: ${props.context.locale.code}` }}</span>
    <span>{{ `timeZone: ${props.context.timeZone}` }}</span>
    <code data-parity-target="config-provider-screens">
      {{ `screens: ${activeScreens || 'none'}` }}
    </code>
  </section>
</template>
