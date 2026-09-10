<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import { shallowRef, useId } from 'vue';
const isOpen = shallowRef(false);
const panelId = useId();
const duration = shallowRef<number | string>(250);
</script>

<template>
  <div>
    <span>设置动画时间：</span
    ><InputNumber v-model="duration" :min="0" :step="10" style="width: 120px" /><br /><Button
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="isOpen = !isOpen"
      >Toggle</Button
    ><Collapsible :id="panelId" :is-open="isOpen" :duration="Number(duration) || 0"
      ><ul>
        <li><p>Semi Design 以内容优先进行设计。</p></li>
        <li><p>更容易地自定义主题。</p></li>
        <li><p>适用国际化场景。</p></li>
        <li><p>效率场景加入人性化关怀。</p></li>
      </ul></Collapsible
    >
  </div>
</template>
