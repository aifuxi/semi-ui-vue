<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconAIFilledLevel1, IconAIFilledLevel2, IconAIFilledLevel3 } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div
    v-for="content in ['Colorful', '']"
    :key="content"
    style="
      display: flex;
      row-gap: 16px;
      margin-top: 20px;
      margin-left: 10px;
      flex-direction: column;
    "
  >
    <div style="display: flex; column-gap: 16px">
      <Button colorful theme="solid" type="primary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel1 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="solid" type="primary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="solid" type="primary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel1 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="solid" type="tertiary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="solid" type="tertiary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="solid" type="tertiary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      >
    </div>
    <div style="display: flex; column-gap: 16px">
      <Button colorful theme="light" type="primary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="light" type="primary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="light" type="primary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="light" type="tertiary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="light" type="tertiary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="light" type="tertiary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      >
    </div>
    <div style="display: flex; column-gap: 16px">
      <Button colorful theme="outline" type="primary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel1 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="outline" type="primary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="outline" type="primary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel1 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="outline" type="tertiary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="outline" type="tertiary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="outline" type="tertiary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      >
    </div>
    <div style="display: flex; column-gap: 16px">
      <Button colorful theme="borderless" type="primary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="borderless" type="primary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="borderless" type="primary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel3 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="borderless" type="tertiary" :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="borderless" type="tertiary" loading :aria-label="content || 'AI'"
        ><template v-if="content" #default>{{ content }}</template></Button
      ><Button colorful theme="borderless" type="tertiary" disabled :aria-label="content || 'AI'"
        ><template #icon><IconAIFilledLevel2 /></template
        ><template v-if="content" #default>{{ content }}</template></Button
      >
    </div>
  </div>
</template>
