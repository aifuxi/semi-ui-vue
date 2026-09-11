<script setup lang="ts">
import { shallowRef } from 'vue';
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import { Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/resizable.css';
import '@aifuxi/semi-theme-default/switch.css';
import '@aifuxi/semi-theme-default/typography.css';
const b = shallowRef(false);
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <div :style="{ display: 'flex', alignItems: 'center', margin: '8px' }">
      <Switch v-model="b"></Switch>
      <Title :heading="6" :style="{ margin: '8px' }">
        {{ b ? 'able' : 'disable' }}
      </Title>
    </div>
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :enable="{
        left: b,
      }"
      :default-size="{
        width: 200,
        height: 200,
      }"
    >
      <div :style="{ marginLeft: '20%' }">
        {{ 'enable.left:' + b }}
      </div>
    </Resizable>
  </div>
</template>
