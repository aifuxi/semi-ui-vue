<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/input-number.css';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/switch.css';
</script>
<template>
  <Form style="max-width: 560px">
    <Form.Section text="基本信息">
      <Form.Input field="name" label="考试名称" init-value="TCS" />
    </Form.Section>
    <Form.Section text="合格标准">
      <Form.InputNumber field="pass" label="及格正确率" :init-value="60" />
      <Form.InputNumber field="number" label="数量" :init-value="10" />
    </Form.Section>
    <Form.Section text="时间">
      <Form.DatePicker
        field="date"
        label="开始时间"
        type="dateTime"
        :init-value="new Date(2024, 0, 15, 9)"
      />
      <Form.Input field="duration" label="考试时长" init-value="60" addon-after="min" />
      <Form.Checkbox field="auto" :init-value="true" no-label>到时间自动交卷</Form.Checkbox>
      <Form.RadioGroup field="type" label="有效时间" init-value="always">
        <Form.Radio value="always">永久有效</Form.Radio>
        <Form.Radio value="custom">自定义</Form.Radio>
      </Form.RadioGroup>
      <Form.RadioGroup field="answerTime" label="答案放出时间" init-value="always">
        <Form.Radio value="always">自动放出</Form.Radio>
        <Form.Radio value="custom">自定义</Form.Radio>
      </Form.RadioGroup>
      <Form.DatePicker field="customTime" label="自定义" type="dateTimeRange" />
    </Form.Section>
    <Form.Section text="考试人员">
      <Form.Switch field="open" label="对外开放" />
      <Form.Select
        field="users"
        label="考试人员"
        multiple
        :init-value="['1', '2']"
        :option-list="[
          { value: '1', label: 'Alex' },
          { value: '2', label: 'Sam' },
          { value: '3', label: 'Taylor' },
          { value: '4', label: 'Robin' },
        ]"
      />
    </Form.Section>
    <Button html-type="submit">创建</Button>
    <Button html-type="reset">重置</Button>
  </Form>
</template>
