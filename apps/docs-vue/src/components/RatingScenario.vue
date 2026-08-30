<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue';
import { shallowRef } from 'vue';

const TOOLTIPS = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const status = shallowRef('none');
</script>

<template>
  <div class="rating-scenario" data-testid="rating-vue">
    <section class="rating-scenario__section" aria-label="基础评分">
      <h3>基础、半星与状态</h3>
      <div class="rating-scenario__row">
        <Rating
          :default-value="3"
          aria-label="基础评分"
          data-parity-target="rating-default"
          @change="status = `change:${$event}`"
        />
        <Rating
          allow-half
          :default-value="3.5"
          aria-label="半星评分"
          data-parity-target="rating-half"
        />
        <Rating
          disabled
          :default-value="2"
          aria-label="禁用评分"
          data-parity-target="rating-disabled"
        />
      </div>
    </section>

    <section class="rating-scenario__section" aria-label="尺寸与字符">
      <h3>尺寸、自定义字符与提示</h3>
      <div class="rating-scenario__row rating-scenario__row--center">
        <Rating size="small" :default-value="4" data-parity-target="rating-small" />
        <Rating :size="32" character="S" :default-value="3" data-parity-target="rating-custom" />
        <Rating
          :tooltips="TOOLTIPS"
          :default-value="2"
          data-parity-target="rating-tooltip"
          @hover-change="status = `hover:${String($event)}`"
        />
      </div>
    </section>

    <output class="rating-scenario__status" aria-live="polite">
      {{ `最近变化：${status}` }}
    </output>
  </div>
</template>
