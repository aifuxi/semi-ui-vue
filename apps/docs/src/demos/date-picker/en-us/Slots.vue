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
      placeholder="Please select a schedule"
      @update:model-value="change"
      ><template #top
        ><Tabs
          size="small"
          :active-key="activeTab"
          style="padding: 12px 20px 0"
          @change="handleTabChange"
          ><TabPane tab="UED Schedule" item-key="1" /><TabPane
            tab="Test schedule"
            item-key="2" /></Tabs></template></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      placeholder="Please select release time"
      ><template #bottom
        ><Space style="padding: 12px 20px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >Please read before finalizing</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }"
            >Release notice</Text
          ></Space
        ></template
      ></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="month"
      placeholder="Please select month"
      ><template #bottom
        ><Space style="padding: 12px 20px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >please read</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }">Notice</Text></Space
        ></template
      ></DatePicker
    ><br /><br /><DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      density="compact"
      placeholder="Small size"
      dropdown-class-name="components-datepicker-demo-slot"
      ><template #top
        ><Tabs
          size="small"
          :active-key="activeTab"
          style="padding: 8px 12px 0"
          @change="handleTabChange"
          ><TabPane tab="UED Schedule" item-key="1" /><TabPane
            tab="Test schedule"
            item-key="2" /></Tabs></template
      ><template #bottom
        ><Space style="padding: 8px 12px"
          ><IconBulb style="color: rgba(var(--semi-amber-5), 1)" /><Text
            strong
            style="color: var(--semi-color-text-2)"
            >Please read before finalizing</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }"
            >Release notice</Text
          ></Space
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
            >Please read before finalizing</Text
          ><Text :link="{ href: 'https://semi.design/', target: '_blank' }"
            >Release notice</Text
          ></Space
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
