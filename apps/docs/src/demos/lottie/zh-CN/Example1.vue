<script setup lang="ts">
import { shallowRef } from 'vue';
import { Lottie, type LottieAnimationItem } from '@aifuxi/semi-ui-vue/lottie';
import '@aifuxi/semi-theme-default/lottie.css';
const animationData = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 120,
  h: 120,
  nm: 'Local animation',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 1,
      nm: 'Square',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [180], i: { x: [0.67], y: [1] }, o: { x: [0.33], y: [0] } },
            { t: 60, s: [180] },
          ],
        },
        p: { a: 0, k: [60, 60, 0] },
        a: { a: 0, k: [20, 20, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      sw: 40,
      sh: 40,
      sc: '#0064fa',
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
};

const animation = shallowRef<LottieAnimationItem | null>(null);
</script>

<template>
  <Lottie
    :params="{ animationData }"
    :get-animation-instance="(instance: LottieAnimationItem | null) => (animation = instance)"
  />
  <button @click="animation?.pause()">暂停</button>
</template>
