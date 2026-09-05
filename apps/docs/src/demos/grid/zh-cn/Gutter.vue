<script setup lang="ts">
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>

<template>
  <div class="grid grid-gutter">
    <p>horizontal</p>
    <hr />
    <Row :gutter="16">
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
    </Row>
    <p>vertical</p>
    <hr />
    <Row :gutter="[16, 24]">
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
      <Col :span="6">
        <div class="col-content">col-6</div>
      </Col>
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
