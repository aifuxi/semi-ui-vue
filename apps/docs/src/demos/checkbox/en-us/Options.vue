<script setup lang="ts">
import { CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
const plainOptions = ['semi', 'vigo', 'helo'];
const options = [
  {
    label: 'Aim for the highest',
    value: '1',
    extra:
      'Raise the bar. Wait for bigger gains. Find the best solutions by widening your perspective. Be attentive. Distill ideas down to their fundamental truths. Keep learning and growing',
  },
  {
    label: 'Be grounded & courageous',
    value: '2',
    extra:
      'Make your own discoveries. Dive deep into facts. Stay level-headed. Focus on impact. Assume ownership, take risks, break the mold. Rapid iterations, multiple possibilities.',
  },
  {
    label: 'Be open & humble',
    value: '3',
    extra:
      'Trust yourself, trust each other. Be willing to offer and ask for help. Collaboration creates value. Approach problems with the big picture in mind. Be mindful and check your ego; stay open to different ideas.',
  },
  {
    label: 'Be candid & clear',
    value: '4',
    extra:
      "Dare to share your honest opinions. It's okay to make mistakes. Own it when you do. Stick to the facts, identify issues, and avoid 'leader-pleasing.' Be accurate and forthright; be methodical and focused.",
  },
];
const optionsWithDisabled = [
  { label: 'Photography', value: 'Photography' },
  { label: 'Movies', value: 'Movies' },
  { label: 'Running', value: 'Running', disabled: false },
];
</script>

<template>
  <div>
    <CheckboxGroup
      :options="plainOptions"
      :default-value="['semi']"
      aria-label="CheckboxGroup demo"
      @change="console.log"
    /><br /><br />
    <CheckboxGroup
      :options="options"
      :default-value="[]"
      aria-label="CheckboxGroup extra demo"
      @change="console.log"
    /><br /><br />
    <CheckboxGroup
      :options="optionsWithDisabled"
      disabled
      :default-value="['Photography']"
      aria-label="Disabled CheckboxGroup demo"
      @change="console.log"
    />
  </div>
</template>
