<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, ArrayField } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
defineProps<{ field: string; addLabel: string; removeLabel: string }>();
const options = ['address', 'title', 'sendTime', 'receiveTime', 'main', 'attachmentName'];
</script>
<template>
  <ArrayField v-slot="{ arrayFields, addWithInitValue }" :field="`${field}.rules`">
    <div v-for="item in arrayFields" :key="item.key" class="rule-row">
      <Form.Select
        :field="`${item.field}[ruleType]`"
        :aria-label="`${item.field}.ruleType`"
        no-label
        :option-list="options.map((value) => ({ value, label: value }))"
        style="width: 140px"
      />
      <Form.Select
        :field="`${item.field}[type]`"
        :aria-label="`${item.field}.type`"
        no-label
        :option-list="['include', 'exclude'].map((value) => ({ value, label: value }))"
        style="width: 120px"
      />
      <Form.Input :field="`${item.field}[text]`" :aria-label="`${item.field}.text`" no-label />
      <Button html-type="button" :aria-label="`${removeLabel} ${item.field}`" @click="item.remove()"
        >−</Button
      >
    </div>
    <Button
      html-type="button"
      @click="addWithInitValue({ ruleType: 'main', type: 'include', text: '' })"
    >
      + {{ addLabel }}
    </Button>
  </ArrayField>
</template>
<style scoped>
.rule-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
