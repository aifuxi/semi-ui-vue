<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
const treeData = [
  {
    label: '亚洲',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: '中国',
        value: 'China',
        key: '0-0',
        children: [{ label: '北京', value: 'Beijing', key: '0-0-0' }],
      },
    ],
  },
  { label: '北美洲', value: 'America', key: '1' },
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
    <Form.Section text="基本信息">
      <div class="field-grid">
        <Form.Input field="name" label="用户名 (Input)" init-value="mikeya" trigger="blur" />
        <Form.DatePicker
          field="date"
          label="日期 (DatePicker)"
          :init-value="new Date(2024, 0, 15)"
        />
        <Form.Select
          field="role"
          label="角色 (Select)"
          :option-list="[
            { value: 'operate', label: 'Operations' },
            { value: 'rd', label: 'Development' },
            { value: 'pm', label: 'Product' },
            { value: 'ued', label: 'Design' },
          ]"
        />
        <Form.Select
          field="business"
          label="业务线 (Select)"
          multiple
          :option-list="[
            { value: 'abc', label: 'Semi' },
            { value: 'ulikeCam', label: 'Ulike' },
            { value: 'toutiao', label: 'Toutiao' },
          ]"
        />
        <Form.Cascader field="area" label="地区 (Cascader)" :tree-data="treeData" />
        <Form.TreeSelect
          field="tree"
          label="服务节点 (TreeSelect)"
          :tree-data="treeData"
          filter-tree-node
        />
        <Form.TagInput field="product" label="产品 (TagInput)" :init-value="['abc', 'ulikeCam']" />
        <Form.AutoComplete field="search" label="AutoComplete" :data="['Semi', 'Semi Design']" />
      </div>
      <Form.Upload
        field="files"
        label="选择本地文件 (Upload)"
        action="/local-demo-unused"
        :upload-trigger="'custom'"
      >
        <Button html-type="button">选择本地文件</Button>
      </Form.Upload>
    </Form.Section>
    <Form.Section text="资源详情">
      <div class="field-grid">
        <Form.TextArea field="description" label="申请理由 (TextArea)" />
        <Form.CheckboxGroup
          field="type"
          label="申请类型 (CheckboxGroup)"
          :init-value="['user', 'admin']"
          :options="['admin', 'user', 'guest', 'root']"
        />
        <Form.RadioGroup field="exclusive" label="独占资源 (RadioGroup)">
          <Form.Radio :value="1">是</Form.Radio>
          <Form.Radio :value="0">否</Form.Radio>
        </Form.RadioGroup>
        <Form.TimePicker field="time" label="时间 (TimePicker)" />
        <Form.InputNumber field="number" label="数量 (InputNumber)" :init-value="20" />
        <Form.Slider field="range" label="报警阈值 (Slider)" :init-value="10" />
        <Form.Switch field="switch" label="Switch" />
        <Form.Rating field="rating" label="Rating" :init-value="2" />
        <Form.PinCode field="code" label="PinCode" />
      </div>
    </Form.Section>
    <Form.Checkbox field="agree" no-label>我已阅读并同意相关条款</Form.Checkbox>
    <Button html-type="submit">提交</Button>
    <Button html-type="reset">重置</Button>
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
