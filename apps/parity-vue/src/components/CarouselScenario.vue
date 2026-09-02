<script setup lang="ts">
import { shallowRef } from 'vue';
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';

const slideLabels = ['设计', '开发', '交付'];
const status = shallowRef('当前：设计');
</script>

<template>
  <div class="carousel-scenario" data-testid="carousel-vue">
    <Carousel
      :auto-play="false"
      theme="dark"
      :speed="0"
      class="carousel-scenario__hero"
      data-parity-target="carousel-basic"
      aria-label="产品流程轮播"
      @change="(index: number) => (status = `当前：${slideLabels[index]}`)"
    >
      <section class="carousel-scenario__slide carousel-scenario__slide--blue">
        <strong>设计</strong><span>统一视觉语言</span>
      </section>
      <section class="carousel-scenario__slide carousel-scenario__slide--violet">
        <strong>开发</strong><span>沉淀组件能力</span>
      </section>
      <section class="carousel-scenario__slide carousel-scenario__slide--green">
        <strong>交付</strong><span>保持体验一致</span>
      </section>
    </Carousel>

    <div class="carousel-scenario__variants">
      <Carousel
        :auto-play="false"
        animation="fade"
        indicator-type="line"
        indicator-position="left"
        theme="primary"
        :show-arrow="false"
        class="carousel-scenario__compact"
        data-parity-target="carousel-fade"
      >
        <div class="carousel-scenario__mini carousel-scenario__mini--warm">Fade A</div>
        <div class="carousel-scenario__mini carousel-scenario__mini--cool">Fade B</div>
      </Carousel>

      <Carousel
        :auto-play="false"
        indicator-type="columnar"
        indicator-size="medium"
        indicator-position="right"
        arrow-type="hover"
        slide-direction="right"
        theme="light"
        class="carousel-scenario__compact"
        data-parity-target="carousel-columnar"
      >
        <div class="carousel-scenario__mini carousel-scenario__mini--dark">Column 1</div>
        <div class="carousel-scenario__mini carousel-scenario__mini--ink">Column 2</div>
      </Carousel>

      <Carousel
        :auto-play="false"
        class="carousel-scenario__single"
        data-parity-target="carousel-single"
      >
        <div class="carousel-scenario__mini carousel-scenario__mini--single">单项无控件</div>
      </Carousel>
    </div>

    <output class="carousel-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
