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
    <Form.Section text="Basic information">
      <Form.Input field="name" label="Exam name" init-value="TCS" />
    </Form.Section>
    <Form.Section text="Pass criteria">
      <Form.InputNumber field="pass" label="Pass rate" :init-value="60" />
      <Form.InputNumber field="number" label="Count" :init-value="10" />
    </Form.Section>
    <Form.Section text="Time">
      <Form.DatePicker
        field="date"
        label="Start time"
        type="dateTime"
        :init-value="new Date(2024, 0, 15, 9)"
      />
      <Form.Input field="duration" label="Duration" init-value="60" addon-after="min" />
      <Form.Checkbox field="auto" :init-value="true" no-label
        >Submit when time expires</Form.Checkbox
      >
      <Form.RadioGroup field="type" label="Validity" init-value="always">
        <Form.Radio value="always">Always valid</Form.Radio>
        <Form.Radio value="custom">Custom</Form.Radio>
      </Form.RadioGroup>
      <Form.RadioGroup field="answerTime" label="Answer release" init-value="always">
        <Form.Radio value="always">Automatic release</Form.Radio>
        <Form.Radio value="custom">Custom</Form.Radio>
      </Form.RadioGroup>
      <Form.DatePicker field="customTime" label="Custom" type="dateTimeRange" />
    </Form.Section>
    <Form.Section text="Participants">
      <Form.Switch field="open" label="Public access" />
      <Form.Select
        field="users"
        label="Participants"
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
    <Button html-type="submit">Create</Button>
    <Button html-type="reset">Reset</Button>
  </Form>
</template>
