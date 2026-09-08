<script setup lang="ts">
import { shallowRef } from 'vue';
import { Lottie, type LottiePlayer } from '@aifuxi/semi-ui-vue/lottie';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/lottie.css';
import '@aifuxi/semi-theme-default/button.css';
const player = shallowRef<LottiePlayer | null>(null);
const samePlayer = shallowRef(false);
const params = { path: '/demos/lottie.json' };
function receivePlayer(value: LottiePlayer) {
  player.value = value;
  samePlayer.value = value === Lottie.getLottie();
}
</script>

<template>
  <Lottie :params="params" :get-lottie="receivePlayer" width="300px" height="300px" />
  <p role="status">{{ samePlayer ? 'Global instance matches' : 'Loading' }}</p>
  <Button @click="player?.pause()">Pause all</Button>
  <Button @click="player?.play()">Play all</Button>
</template>
