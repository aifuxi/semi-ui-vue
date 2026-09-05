<script setup lang="ts">
import { type CSSProperties } from 'vue';
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
const displayValue = new Date(2019, 6, 23, 8, 32, 0);
const target = new Date(2019, 6, 23).toString();
const dailyEventStyle: CSSProperties = {
  position: 'absolute',
  left: '0',
  right: '0',
  borderRadius: '3px',
  boxSizing: 'border-box',
  border: 'var(--semi-color-primary) 1px solid',
  padding: '10px',
  backgroundColor: 'var(--semi-color-primary-light-default)',
  overflow: 'hidden',
};
</script>
<template>
  <Calendar :height="700" mode="week" :display-value="displayValue" :show-curr-time="false"
    ><template #dateGrid="{ dateString }"
      ><template v-if="dateString === target"
        ><div :style="{ ...dailyEventStyle, top: '500px', height: '50px' }">吃饭 🍰</div>
        <div :style="{ ...dailyEventStyle, top: '0px', height: '400px' }">睡觉 😪</div>
        <div :style="{ ...dailyEventStyle, top: '700px', height: '100px' }">
          打豆豆 🎮
        </div></template
      ></template
    ></Calendar
  >
</template>
