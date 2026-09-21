<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, ArrayField } from '@aifuxi/semi-ui-vue/form';
import NestedRules from '../shared/NestedRules.vue';
const initValues = {
  group: [
    {
      name: 'Rule 1',
      rules: [
        { ruleType: 'address', type: 'include', text: 'example.com' },
        { ruleType: 'title', type: 'exclude', text: 'Changelog' },
      ],
    },
    { name: 'Rule 2', rules: [{ ruleType: 'sendTime', type: 'include', text: '2019' }] },
  ],
};
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form v-slot="{ values }" :init-values="initValues" label-position="left" allow-empty>
    <ArrayField v-slot="{ arrayFields, addWithInitValue }" field="group">
      <Button
        html-type="button"
        @click="
          addWithInitValue({
            name: 'New rule',
            rules: [
              { ruleType: 'main', type: 'include', text: '' },
              { ruleType: 'attachmentName', type: 'include', text: '' },
            ],
          })
        "
      >
        新增收信规则
      </Button>
      <section v-for="item in arrayFields" :key="item.key">
        <Form.Input :field="`${item.field}[name]`" label="规则名称" />
        <Button html-type="button" @click="item.remove()"> 删除规则组 </Button>
        <p>邮件到达时匹配以下条件：</p>
        <NestedRules :field="item.field" add-label="新增条件" remove-label="删除条件" />
      </section>
    </ArrayField>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </Form>
</template>
