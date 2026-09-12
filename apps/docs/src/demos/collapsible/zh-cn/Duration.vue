<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import { shallowRef } from 'vue';
const isOpen = shallowRef(false);
const duration = shallowRef<number | string>(250);
</script>

<template>
  <div>
    <label>设置动画时间：</label
    ><InputNumber v-model="duration" :min="0" :step="10" style="width: 120px" /><br /><Button
      @click="isOpen = !isOpen"
      >Toggle</Button
    ><Collapsible :is-open="isOpen" :duration="Number(duration) || 0"
      ><ul>
        <li><p>Semi Design 以内容优先进行设计。</p></li>
        <li><p>更容易地自定义主题。</p></li>
        <li><p>适用国际化场景。</p></li>
        <li><p>效率场景加入人性化关怀。</p></li>
      </ul></Collapsible
    >
  </div>
</template>
