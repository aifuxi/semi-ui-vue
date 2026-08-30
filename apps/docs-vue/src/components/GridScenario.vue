<script setup lang="ts">
import { Col, Row } from '@aifuxi/semi-ui-vue';

const tallCellStyle = { minHeight: '52px' };
const shortCellStyle = { minHeight: '32px' };
</script>

<template>
  <div class="grid-scenario" data-testid="grid-vue">
    <section class="grid-scenario__section" aria-label="基础栅格">
      <h3>基础栅格</h3>
      <Row class="grid-scenario__row" data-parity-target="grid-basic-row">
        <Col :span="8" data-parity-target="grid-basic-col">
          <div class="grid-scenario__cell">col-8</div>
        </Col>
        <Col :span="8">
          <div class="grid-scenario__cell grid-scenario__cell--secondary">col-8</div>
        </Col>
        <Col :span="8">
          <div class="grid-scenario__cell">col-8</div>
        </Col>
      </Row>
    </section>

    <section class="grid-scenario__section" aria-label="栅格间隔">
      <h3>响应式 Gutter</h3>
      <Row
        class="grid-scenario__row grid-scenario__gutter-row"
        data-parity-target="grid-gutter-row"
        :gutter="[{ xs: 8, md: 24, xl: 32 }, 16]"
      >
        <Col
          v-for="item in 4"
          :key="item"
          :span="12"
          :data-parity-target="item === 1 ? 'grid-gutter-col' : undefined"
        >
          <div class="grid-scenario__cell">col-12</div>
        </Col>
      </Row>
    </section>

    <section class="grid-scenario__section" aria-label="弹性与响应式栅格">
      <h3>Flex 与响应式</h3>
      <Row
        align="middle"
        class="grid-scenario__row grid-scenario__flex-row"
        data-parity-target="grid-flex-row"
        justify="space-between"
        type="flex"
      >
        <Col :order="3" :span="5" data-parity-target="grid-ordered-col">
          <div class="grid-scenario__cell" :style="shortCellStyle">order-3</div>
        </Col>
        <Col :order="1" :span="5">
          <div class="grid-scenario__cell grid-scenario__cell--secondary" :style="tallCellStyle">
            order-1
          </div>
        </Col>
        <Col :order="2" :span="5">
          <div class="grid-scenario__cell" :style="shortCellStyle">order-2</div>
        </Col>
      </Row>
      <Row class="grid-scenario__row grid-scenario__responsive-row">
        <Col
          :xs="{ span: 10, offset: 1 }"
          :md="{ span: 8, offset: 2 }"
          :lg="{ span: 6, offset: 3, push: 1 }"
          data-parity-target="grid-responsive-col"
        >
          <div class="grid-scenario__cell">responsive</div>
        </Col>
        <Col :xs="12" :md="10" :lg="{ span: 8, pull: 1 }">
          <div class="grid-scenario__cell grid-scenario__cell--secondary">adaptive</div>
        </Col>
      </Row>
    </section>
  </div>
</template>
