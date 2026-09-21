<script setup lang="ts">
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>

<template>
  <div class="grid grid-flex">
    <p>Align Top</p>
    <Row type="flex" justify="center" align="top">
      <Col :span="4"><div class="col-content" :value="100">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="50">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="120">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="80">col-4</div></Col>
    </Row>

    <p>Align Center</p>
    <Row type="flex" justify="space-around" align="middle">
      <Col :span="4"><div class="col-content" :value="100">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="50">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="120">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="80">col-4</div></Col>
    </Row>

    <p>Align Bottom</p>
    <Row type="flex" justify="space-between" align="bottom">
      <Col :span="4"><div class="col-content" :value="100">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="50">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="120">col-4</div></Col>
      <Col :span="4"><div class="col-content" :value="80">col-4</div></Col>
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
