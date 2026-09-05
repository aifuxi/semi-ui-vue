<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { Tabs } from '@aifuxi/semi-ui-vue/tabs';
import { TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Space } from '@aifuxi/semi-ui-vue/space';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/space.css';
import '@aifuxi/semi-theme-default/typography.css';
import { IconBulb } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
import type { DatePickerValue } from '@aifuxi/semi-ui-vue/date-picker';
const activeTab = shallowRef('1');
const date = shallowRef<DatePickerValue>([]);
function handleTabChange(tab: string) {
  activeTab.value = tab;
  date.value = [];
}
function change(value: Date | Date[] | undefined) {
  date.value = value ?? [];
}
function disabledDate(current?: Date) {
  if (!current) return false;
  const day = current.getDate();
  return activeTab.value === '1' ? day > 10 && day < 15 : day > 15 && day < 25;
}
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      :value="date"
      :disabled-date="disabledDate"
      dropdown-class-name="components-datepicker-demo-slot"
      placeholder="请选择排期"
      @update:model-value="change"
      ><template #top
        ><Tabs
          size="small"
          :active-key="activeTab"
          style="padding: 12px 20px 0"
          @change="handleTabChange"
          ><TabPane tab="UED 排期" item-key="1" /><TabPane
            tab="测试排期"
            item-key="2" /></Tabs></template></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      placeholder="请选择发版时间"
      ><template #bottom
        ><Space style="padding: 12px 20px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >定版前请阅读</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }">发版须知</Text></Space
        ></template
      ></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="month"
      placeholder="请选择年月"
      ><template #bottom
        ><Space style="padding: 12px 20px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >请阅读</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }">须知</Text></Space
        ></template
      ></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      density="compact"
      placeholder="小尺寸"
      dropdown-class-name="components-datepicker-demo-slot"
      ><template #top
        ><Tabs
          size="small"
          :active-key="activeTab"
          style="padding: 8px 12px 0"
          @change="handleTabChange"
          ><TabPane tab="UED 排期" item-key="1" /><TabPane
            tab="测试排期"
            item-key="2" /></Tabs></template
      ><template #bottom
        ><Space style="padding: 8px 12px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >定版前请阅读</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }">发版须知</Text></Space
        ></template
      ></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTimeRange"
      style="width: 400px"
      ><template #bottom
        ><Space style="padding: 12px 20px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >定版前请阅读</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }">发版须知</Text></Space
        ></template
      ></DatePicker
    ><br /><br />
  </div>
</template>

<style>
.components-datepicker-demo-slot .semi-tabs-content {
  padding: 0;
}
.components-datepicker-demo-slot .semi-tabs-bar-line.semi-tabs-bar-top {
  border-bottom: none;
}
</style>
