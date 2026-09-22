<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import { Row, Col } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/grid.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form label-position="top">
    <Row v-for="count in [3, 4]" :key="count">
      <Col :span="24 / count">
        <Form.Input
          :field="`nickName${count}`"
          label="用户名"
          trigger="blur"
          :rules="[{ required: true, message: '此项不能为空' }]"
        />
      </Col>
      <Col :span="24 / count">
        <Form.DatePicker :field="`date${count}`" label="日期" />
      </Col>
      <Col :span="24 / count">
        <Form.Select
          :field="`business${count}`"
          label="业务线"
          :option-list="['Semi', 'Ulike', 'Toutiao'].map((value) => ({ value, label: value }))"
        />
      </Col>
      <Col v-if="count === 4" :span="6">
        <Form.Select
          field="role"
          label="角色"
          :option-list="['operate', 'rd', 'pm', 'ued'].map((value) => ({ value, label: value }))"
        />
      </Col>
    </Row>
  </Form>
</template>
