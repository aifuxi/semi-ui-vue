<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
import { shallowRef } from 'vue';
const isOpen = shallowRef(false);
</script>

<template>
  <div>
    <Button @click="isOpen = !isOpen">Toggle</Button
    ><Collapsible :is-open="isOpen"
      ><ul>
        <li><p>Semi Design 以内容优先进行设计。</p></li>
        <li><p>更容易地自定义主题。</p></li>
        <li><p>适用国际化场景。</p></li>
        <li><p>效率场景加入人性化关怀。</p></li>
      </ul></Collapsible
    >
  </div>
</template>
