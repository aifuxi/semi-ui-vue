<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/calendar.css';
import '@aifuxi/semi-theme-default/avatar.css';
const displayValue = new Date(2023, 4, 14);
const colors = ['amber', 'blue', 'cyan', 'green', 'grey', 'indigo', 'lime'] as const;
</script>
<template>
  <Calendar :height="400" mode="week" :display-value="displayValue"
    ><template #dateDisplay="{ date }"
      ><div>
        <Avatar :color="colors[date.getDay()]!" size="small">{{ date.getDate() }}</Avatar>
      </div></template
    ></Calendar
  >
</template>
