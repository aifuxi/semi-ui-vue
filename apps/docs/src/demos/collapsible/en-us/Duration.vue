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
    <label>Set animation duration：</label
    ><InputNumber v-model="duration" :min="0" :step="10" style="width: 120px" /><br /><Button
      @click="isOpen = !isOpen"
      >Toggle</Button
    ><Collapsible :is-open="isOpen" :duration="Number(duration) || 0"
      ><ul>
        <li>Nothing can ever happen twice.</li>
        <li>In consequence, the sorry fact is</li>
        <li>that we arrive here improvised</li>
        <li>and leave without the chance to practice.</li>
      </ul></Collapsible
    >
  </div>
</template>
