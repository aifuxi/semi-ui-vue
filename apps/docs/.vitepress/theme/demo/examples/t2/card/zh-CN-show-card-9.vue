<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
</script>
<template>
  <div
    :style="{
      backgroundColor: 'var(--semi-color-fill-0)',
      padding: '20px',
    }"
  >
    <Row :gutter="[16, 16]">
      <Col :span="8">
        <Card title="Card Title" :bordered="false"> Card Content </Card>
      </Col>
      <Col :span="8">
        <Card title="Card Title" :bordered="false"> Card Content </Card>
      </Col>
      <Col :span="8">
        <Card title="Card Title" :bordered="false"> Card Content </Card>
      </Col>
    </Row>
    <Row :gutter="[16, 16]">
      <Col :span="16">
        <Card title="Card Title" :bordered="false"> Card Content </Card>
      </Col>
      <Col :span="8">
        <Card title="Card Title" :bordered="false"> Card Content </Card>
      </Col>
    </Row>
  </div>
</template>
