<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/checkbox.css';
const optionList = [
  { value: 'douyin', label: 'Semi', otherKey: 0 },
  { value: 'capcut', label: 'Capcut', disabled: true, otherKey: 1 },
  { value: 'cam', label: 'UlikeCam', otherKey: 2 },
  { value: 'buzz', label: 'Buzz', otherKey: 3 },
];
</script>
<template>
  <div>
    <Select
      filter
      default-open
      default-value="douyin"
      dropdown-class-name="components-select-demo-renderOptionItem"
      :option-list="optionList"
      style="width: 180px"
      ><template #option="option"
        ><div
          :style="option.style"
          :class="[
            'custom-option-render',
            option.class,
            {
              'custom-option-render-focused': option.focused,
              'custom-option-render-disabled': option.disabled,
              'custom-option-render-selected': option.selected,
            },
          ]"
          role="option"
          :aria-selected="option.selected"
          :aria-disabled="option.disabled"
          @click="option.onClick"
          @mouseenter="option.onMouseenter"
        >
          <Checkbox :checked="option.selected" :disabled="option.disabled" />
          <div class="option-right">{{ option.label }}</div>
        </div></template
      ></Select
    ><br /><br /><Select
      filter
      placeholder="multiple"
      multiple
      dropdown-class-name="components-select-demo-renderOptionItem"
      :option-list="optionList"
      style="width: 320px; margin-top: 180px"
      ><template #option="option"
        ><div
          :style="option.style"
          :class="[
            'custom-option-render',
            option.class,
            {
              'custom-option-render-focused': option.focused,
              'custom-option-render-disabled': option.disabled,
              'custom-option-render-selected': option.selected,
            },
          ]"
          role="option"
          :aria-selected="option.selected"
          :aria-disabled="option.disabled"
          @click="option.onClick"
          @mouseenter="option.onMouseenter"
        >
          <Checkbox :checked="option.selected" :disabled="option.disabled" />
          <div class="option-right">{{ option.label }}</div>
        </div></template
      ></Select
    >
  </div>
</template>

<style>
.components-select-demo-renderOptionItem .custom-option-render {
  display: flex;
  font-size: 14px;
  line-height: 20px;
  word-break: break-all;
  padding: 8px 12px;
  color: var(--semi-color-text-0);
  position: relative;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
.components-select-demo-renderOptionItem .option-right {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
}
.components-select-demo-renderOptionItem .custom-option-render:active {
  background-color: var(--semi-color-fill-1);
}
.components-select-demo-renderOptionItem .custom-option-render-focused {
  background-color: var(--semi-color-fill-0);
}
.components-select-demo-renderOptionItem .custom-option-render-disabled {
  color: var(--semi-color-disabled-text);
  cursor: not-allowed;
}
.components-select-demo-renderOptionItem .custom-option-render:first-of-type {
  margin-top: 4px;
}
.components-select-demo-renderOptionItem .custom-option-render:last-of-type {
  margin-bottom: 4px;
}
</style>
