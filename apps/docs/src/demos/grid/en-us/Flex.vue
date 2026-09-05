<script setup lang="ts">
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>

<template>
  <div class="grid">
    <p>sub-element align left</p>
    <Row type="flex" justify="start">
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
    </Row>

    <p>sub-element align center</p>
    <Row type="flex" justify="center">
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
    </Row>

    <p>sub-element align right</p>
    <Row type="flex" justify="end">
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
    </Row>

    <p>sub-element monospaced arrangement</p>
    <Row type="flex" justify="space-between">
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
    </Row>

    <p>sub-element align full</p>
    <Row type="flex" justify="space-around">
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
      <Col :span="4"><div class="col-content">col-4</div></Col>
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
