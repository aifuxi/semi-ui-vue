<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
const treeData = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        children: [{ label: 'Beijing', value: 'Beijing', key: '0-0-0' }],
      },
    ],
  },
  { label: 'North America', value: 'America', key: '1' },
];
const initValues = {
  name: 'semi',
  business: ['ulikeCam'],
  role: 'ued',
  switch: true,
  files: [{ uid: '1', name: 'example.txt', status: 'success', size: '130KB' }],
};
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/auto-complete.css';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/input-number.css';
import '@aifuxi/semi-theme-default/pin-code.css';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/rating.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/slider.css';
import '@aifuxi/semi-theme-default/switch.css';
import '@aifuxi/semi-theme-default/tag-input.css';
import '@aifuxi/semi-theme-default/time-picker.css';
import '@aifuxi/semi-theme-default/tree-select.css';
import '@aifuxi/semi-theme-default/upload.css';
</script>
<template>
  <Form v-slot="{ values }" :init-values="initValues" style="padding: 10px">
    <Form.Section text="Basic information">
      <div class="field-grid">
        <Form.Input field="name" label="Username (Input)" init-value="mikeya" trigger="blur" />
        <Form.DatePicker
          field="date"
          label="Date (DatePicker)"
          :init-value="new Date(2024, 0, 15)"
        />
        <Form.Select
          field="role"
          label="Role (Select)"
          :option-list="[
            { value: 'operate', label: 'Operations' },
            { value: 'rd', label: 'Development' },
            { value: 'pm', label: 'Product' },
            { value: 'ued', label: 'Design' },
          ]"
        />
        <Form.Select
          field="business"
          label="Business (Select)"
          multiple
          :option-list="[
            { value: 'abc', label: 'Semi' },
            { value: 'ulikeCam', label: 'Ulike' },
            { value: 'toutiao', label: 'Toutiao' },
          ]"
        />
        <Form.Cascader field="area" label="Area (Cascader)" :tree-data="treeData" />
        <Form.TreeSelect
          field="tree"
          label="Service node (TreeSelect)"
          :tree-data="treeData"
          filter-tree-node
        />
        <Form.TagInput
          field="product"
          label="Product (TagInput)"
          :init-value="['abc', 'ulikeCam']"
        />
        <Form.AutoComplete field="search" label="AutoComplete" :data="['Semi', 'Semi Design']" />
      </div>
      <Form.Upload
        field="files"
        label="Choose local files (Upload)"
        action="/local-demo-unused"
        :upload-trigger="'custom'"
      >
        <Button html-type="button">Choose local files</Button>
      </Form.Upload>
    </Form.Section>
    <Form.Section text="Resource details">
      <div class="field-grid">
        <Form.TextArea field="description" label="Reason for application (TextArea)" />
        <Form.CheckboxGroup
          field="type"
          label="Application type (CheckboxGroup)"
          :init-value="['user', 'admin']"
          :options="['admin', 'user', 'guest', 'root']"
        />
        <Form.RadioGroup field="exclusive" label="Exclusive resource (RadioGroup)">
          <Form.Radio :value="1">Yes</Form.Radio>
          <Form.Radio :value="0">No</Form.Radio>
        </Form.RadioGroup>
        <Form.TimePicker field="time" label="Time (TimePicker)" />
        <Form.InputNumber field="number" label="Count (InputNumber)" :init-value="20" />
        <Form.Slider field="range" label="Alert threshold (Slider)" :init-value="10" />
        <Form.Switch field="switch" label="Switch" />
        <Form.Rating field="rating" label="Rating" :init-value="2" />
        <Form.PinCode field="code" label="PinCode" />
      </div>
    </Form.Section>
    <Form.Checkbox field="agree" no-label>I have read and agree to the terms</Form.Checkbox>
    <Button html-type="submit">Submit</Button>
    <Button html-type="reset">Reset</Button>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </Form>
</template>
<style scoped>
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
</style>
