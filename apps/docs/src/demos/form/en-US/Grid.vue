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
          label="Username"
          trigger="blur"
          :rules="[{ required: true, message: 'This field is required' }]"
        />
      </Col>
      <Col :span="24 / count">
        <Form.DatePicker :field="`date${count}`" label="Date" />
      </Col>
      <Col :span="24 / count">
        <Form.Select
          :field="`business${count}`"
          label="Business"
          :option-list="['Semi', 'Ulike', 'Toutiao'].map((value) => ({ value, label: value }))"
        />
      </Col>
      <Col v-if="count === 4" :span="6">
        <Form.Select
          field="role"
          label="Role"
          :option-list="['operate', 'rd', 'pm', 'ued'].map((value) => ({ value, label: value }))"
        />
      </Col>
    </Row>
  </Form>
</template>
