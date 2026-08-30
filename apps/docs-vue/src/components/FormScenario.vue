<script setup lang="ts">
import { Form } from '@workspace/ui';
</script>

<template>
  <div class="form-scenario" data-testid="form-vue">
    <Form class-name="form-scenario__form">
      <Form.Input
        data-parity-target="form-name"
        field="name"
        label="名称"
        placeholder="请输入名称"
        :rules="[{ required: true, message: '请输入名称' }]"
      />
      <Form.Input
        data-parity-target="form-description"
        field="description"
        help-text="用于识别当前方案"
        init-value="Semi Vue"
        label="说明"
      />
      <button class="form-scenario__submit" type="submit">提交</button>
    </Form>
  </div>
</template>
