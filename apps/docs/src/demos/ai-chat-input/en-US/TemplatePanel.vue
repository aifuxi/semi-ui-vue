<script setup lang="ts">
import { ref } from 'vue';
import { IconTemplateStroked } from '@aifuxi/semi-icons-vue';
const emit = defineEmits<{ select: [content: string] }>();
const groups = [
  {
    groupKey: 'value',
    group: 'Work',
    children: [
      {
        bg: 'var(--semi-color-primary)',
        icon: null,
        title: 'Summary report',
        desc: 'Condensate your work results',
        content:
          'My occupation is <input-slot placeholder="[Please enter your occupation]"></input-slot>. Please help me write a summary report on <input-slot placeholder="[Purpose: Project Progress Summary, Team Work Results, or Other]"></input-slot>',
      },
      {
        bg: 'var(--semi-color-warning)',
        icon: null,
        title: 'Speech skills',
        desc: 'Meet the expression needs of different scenarios',
        content:
          'I am a <select-slot value="Worker" options=\'["Worker","Student"]\'></select-slot>, please help me write a paragraph for <input-slot placeholder="[input object]">unfamiliar colleagues</input-slot>',
      },
    ],
  },
  {
    groupKey: 'marketing',
    group: 'Marketing',
    children: [
      {
        bg: 'var(--semi-color-primary)',
        icon: null,
        title: 'Promotional copy',
        desc: 'Write promotional copy for each platform',
        content:
          'Please help me write a promotional copy for <input-slot placeholder="[Enter target group]"></input-slot> professionals about <input-slot placeholder="[Enter product]"></input-slot>. It needs to directly hit the pain points and attract users to click.',
      },
      {
        bg: 'var(--semi-color-warning)',
        icon: null,
        title: 'Program planning',
        desc: 'Tailor-made solutions',
        content:
          'I am a <input-slot placeholder="[Enter occupation]"></input-slot> professional planner. Please help me write a <input-slot placeholder="[Plan type: such as offline book club activity plan, etc.]"></input-slot> offline book club activity plan, which should include but not be limited to planning goals, detailed plans, required resources and budget, effect evaluation, risk response, etc.',
      },
    ],
  },
];
const groupIndex = ref(0);
</script>
<template>
  <div class="template-panel">
    <div role="tablist">
      <button
        v-for="(group, index) in groups"
        :key="group.groupKey"
        role="tab"
        :aria-selected="index === groupIndex"
        @click="groupIndex = index"
      >
        {{ group.group }}
      </button>
    </div>
    <div class="template-cards">
      <button
        v-for="item in groups[groupIndex]?.children"
        :key="item.title"
        @click="emit('select', item.content)"
      >
        <IconTemplateStroked :style="{ background: item.bg }" /><strong>{{ item.title }}</strong
        ><small>{{ item.desc }}</small>
      </button>
    </div>
  </div>
</template>
<style scoped>
.template-panel {
  padding: 12px;
}
.template-panel [role='tablist'] {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--semi-color-border);
}
.template-panel button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 8px;
  text-align: left;
}
.template-panel [aria-selected='true'] {
  color: var(--semi-color-primary);
}
.template-cards {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}
.template-cards button {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 16px;
  border: 1px solid var(--semi-color-border);
  border-radius: 8px;
}
.template-cards .semi-icon {
  color: white;
  padding: 8px;
  box-sizing: content-box;
  border-radius: 8px;
}
.template-cards small {
  color: var(--semi-color-text-2);
}
</style>
