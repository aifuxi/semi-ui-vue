<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/tooltip.css';
</script>
<template>
  <DatePicker :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
    ><template #date="{ dayNumber }"
      ><Tooltip v-if="dayNumber === 1" content="Always Day 1"
        ><div
          style="
            width: 100%;
            height: 100%;
            border: 1px solid var(--semi-color-primary);
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          {{ dayNumber }}
        </div></Tooltip
      ><template v-else>{{ dayNumber }}</template></template
    ></DatePicker
  >
</template>
