<script setup lang="ts">
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import '@aifuxi/semi-theme-default/divider.css';
</script>

<template>
  <div>
    <h3>Horizontal Solid Line</h3>
    <span>Semi Design is a design system.</span>
    <Divider margin="12px" />
    <span>It defines a set of components.</span>

    <h3 :style="{ marginTop: '40px' }">Horizontal Dashed Line</h3>
    <span>Semi Design is a design system.</span>
    <Divider :dashed="true" margin="12px" />
    <span>It defines a set of components.</span>

    <h3 :style="{ marginTop: '40px' }">Vertical Solid Line</h3>

    <div>
      <span>Left</span>
      <Divider layout="vertical" margin="12px" />
      <span>Middle</span>
      <Divider layout="vertical" margin="12px" />
      <span>Right</span>
    </div>

    <h3 :style="{ marginTop: '40px' }">Vertical Dashed Line</h3>
    <div>
      <span>Left</span>
      <Divider layout="vertical" :dashed="true" margin="12px" />
      <span>Middle</span>
      <Divider layout="vertical" :dashed="true" margin="12px" />
      <span>Right</span>
    </div>
  </div>
</template>
