<script setup lang="ts">
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>

<template>
  <div class="grid">
    <Row type="flex">
      <Col :span="6" :order="4"><div class="col-content">col-4</div></Col>
      <Col :span="6" :order="3"><div class="col-content">col-3</div></Col>
      <Col :span="6" :order="2"><div class="col-content">col-2</div></Col>
      <Col :span="6" :order="1"><div class="col-content">col-1</div></Col>
    </Row>
  </div>
</template>

<style scoped>
.grid :deep(.semi-row),
.grid :deep(.semi-row-flex) {
  text-align: center;
}
.grid :deep(.semi-col) {
  min-height: 30px;
  line-height: 30px;
  background: var(--semi-color-primary-light-default);
  outline: 1px solid var(--semi-color-primary-light-active);
}
.grid-gutter .col-content {
  background: var(--semi-color-primary-light-hover);
}
.grid-flex :deep(.semi-row-flex) {
  height: 50px;
  background: var(--semi-color-fill-0);
}
</style>
