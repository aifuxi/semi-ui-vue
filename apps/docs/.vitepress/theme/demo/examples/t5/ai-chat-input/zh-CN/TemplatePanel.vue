<script setup lang="ts">
import { ref } from 'vue';
import { IconTemplateStroked } from '@aifuxi/semi-icons-vue';
const emit = defineEmits<{ select: [content: string] }>();
const groups = [
  {
    groupKey: 'value',
    group: '工作',
    children: [
      {
        bg: 'var(--semi-color-primary)',
        icon: null,
        title: '总结汇报',
        desc: '凝练你的工作成效',
        content:
          '我的职业是<input-slot placeholder="[请输入职业]"></input-slot>，帮我写一份关于<input-slot placeholder="[输入目的：项目进展总结、团队工作成果或其他]"></input-slot>的总结汇报',
      },
      {
        bg: 'var(--semi-color-warning)',
        icon: null,
        title: '话术',
        desc: '满足不同场景表达需求',
        content:
          '我是一名<select-slot value="打工人" options=\'["打工人","学生"]\'></select-slot> ，帮我写一段面向<input-slot placeholder="[输入对象]">陌生同事</input-slot>的话术内容',
      },
    ],
  },
  {
    groupKey: 'marketing',
    group: '商业营销',
    children: [
      {
        bg: 'var(--semi-color-primary)',
        icon: null,
        title: '宣传文案',
        desc: '撰写各平台的推广文案',
        content:
          '帮我写一篇面向<input-slot placeholder="[输入目标人群]"></input-slot>职场人士，关于<input-slot placeholder="[输入产品]"></input-slot>的宣传文案，需要直击痛点，吸引用户点击。',
      },
      {
        bg: 'var(--semi-color-warning)',
        icon: null,
        title: '方案策划',
        desc: '量身定制各种方案',
        content:
          '我是一名<input-slot placeholder="[输入职业]"></input-slot>职业策划人 ，帮我写一个<input-slot placeholder="[方案类型：如线下读书会活动方案等]"></input-slot>线下读书会活动 的方案，需要包含但不限于策划目标、详细计划、所需资源和预算、效果评估、风险应对等。',
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
