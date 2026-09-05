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
    <span>Set animation duration: </span
    ><InputNumber v-model="duration" :min="0" :step="10" style="width: 120px" /><br /><Button
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      @click="isOpen = !isOpen"
      >Toggle</Button
    ><Collapsible :id="panelId" :is-open="isOpen" :duration="Number(duration) || 0"
      ><ul>
        <li>Nothing can ever happen twice.</li>
        <li>In consequence, the sorry fact is</li>
        <li>that we arrive here improvised</li>
        <li>and leave without the chance to practice.</li>
      </ul></Collapsible
    >
  </div>
</template>
