<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, ArrayField } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form v-slot="{ formState }" label-position="left" label-width="100px" allow-empty>
    <ArrayField
      v-slot="{ arrayFields, add, addWithInitValue }"
      field="rules"
      :init-value="[
        { name: 'Semi D2C', role: 'Engineer' },
        { name: 'Semi C2D', role: 'Designer' },
      ]"
    >
      <Button html-type="button" @click="add()">新增空白行</Button>
      <Button html-type="button" @click="addWithInitValue({ name: 'Semi DSM', role: 'Designer' })">
        新增带初始值的行
      </Button>
      <div v-for="item in arrayFields" :key="item.key" class="array-row">
        <Form.Input :field="`${item.field}[name]`" :label="`${item.field}.name`" />
        <Form.Select
          :field="`${item.field}[role]`"
          :label="`${item.field}.role`"
          :option-list="['Engineer', 'Designer'].map((value) => ({ value, label: value }))"
        />
        <Button html-type="button" @click="item.remove()">删除行</Button>
      </div>
    </ArrayField>
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
<style scoped>
.array-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
