<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue';
import { Lottie, type LottieAnimationItem, type LottieParams } from '@aifuxi/semi-ui-vue';
import { LOTTIE_ANIMATION_DATA_BLUE, LOTTIE_ANIMATION_DATA_ORANGE } from '@workspace/test-infra';

const orange = shallowRef(false);
const externalReady = shallowRef(false);
const externalContainer = useTemplateRef<HTMLDivElement>('externalContainer');
const variantParams = computed<LottieParams>(() => ({
  animationData: orange.value ? LOTTIE_ANIMATION_DATA_ORANGE : LOTTIE_ANIMATION_DATA_BLUE,
  autoplay: false,
  loop: false,
}));
const externalParams = computed<LottieParams>(() => ({
  animationData: LOTTIE_ANIMATION_DATA_BLUE,
  autoplay: false,
  container: externalContainer.value as Element,
  loop: false,
}));

function stopAtFirstFrame(animation: LottieAnimationItem | null): void {
  animation?.goToAndStop(0, true);
}

onMounted(() => {
  externalReady.value = true;
});
</script>

<template>
  <div class="lottie-scenario" data-testid="lottie-vue">
    <section class="lottie-scenario__card">
      <h3>Internal SVG container</h3>
      <p>Fixed local animation data with autoplay and loop disabled.</p>
      <Lottie
        :params="{ animationData: LOTTIE_ANIMATION_DATA_BLUE, autoplay: false, loop: false }"
        width="120px"
        height="120px"
        data-parity-target="lottie-basic"
        aria-label="Blue Lottie square"
        :get-animation-instance="stopAtFirstFrame"
      />
    </section>

    <section class="lottie-scenario__card">
      <h3>Reactive params</h3>
      <p>Replacing animationData destroys and reloads the animation instance.</p>
      <Lottie
        :params="variantParams"
        width="120px"
        height="120px"
        data-parity-target="lottie-variant"
        :get-animation-instance="stopAtFirstFrame"
      />
      <button type="button" @click="orange = !orange">
        Use {{ orange ? 'blue' : 'orange' }} data
      </button>
      <output class="lottie-scenario__status">Variant {{ orange ? 'orange' : 'blue' }}</output>
    </section>

    <section class="lottie-scenario__card lottie-scenario__card--wide">
      <h3>Caller-owned container</h3>
      <p>The component renders no internal root when params.container is provided.</p>
      <div
        ref="externalContainer"
        class="lottie-scenario__external"
        data-parity-target="lottie-external"
      />
      <Lottie
        v-if="externalReady"
        :params="externalParams"
        :get-animation-instance="stopAtFirstFrame"
      />
    </section>
  </div>
</template>
