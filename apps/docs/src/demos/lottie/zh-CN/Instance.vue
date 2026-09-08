<script setup lang="ts">
import { shallowRef } from 'vue';
import { Lottie, type LottieAnimationItem } from '@aifuxi/semi-ui-vue/lottie';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/lottie.css';
import '@aifuxi/semi-theme-default/button.css';
const animation = shallowRef<LottieAnimationItem | null>(null);
const params = { path: '/demos/lottie.json' };
function receiveAnimation(value: LottieAnimationItem | null) {
  animation.value = value;
}
</script>

<template>
  <Lottie
    :params="params"
    :get-animation-instance="receiveAnimation"
    width="300px"
    height="300px"
  />
  <Button @click="animation?.pause()">暂停</Button>
  <Button @click="animation?.play()">播放</Button>
</template>
