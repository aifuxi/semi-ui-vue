<script setup lang="ts">
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { FloatButton } from '@aifuxi/semi-ui-vue/float-button';
import IconAIBellLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIBellLevel1';
import IconAIEditLevel2 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel2';
import IconAIFileLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIFileLevel3';
import IconAIFilledLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIFilledLevel3';
import IconAIImageLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIImageLevel3';
import IconAISearchLevel3 from '@aifuxi/semi-icons-vue/icons/IconAISearchLevel3';
import IconAIStrokedLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIStrokedLevel3';
import IconAIWandLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIWandLevel3';
import IconAILoading from '@aifuxi/semi-icons-vue/icons/IconAILoading';
import IconAIFilledLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIFilledLevel1';
import IconAIEditLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel1';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
<template>
  <div style="display: flex; flex-direction: column; row-gap: 20px">
    <div style="display: flex; flex-direction: column; row-gap: 10px">
      <Typography.Title :heading="5">AI Token</Typography.Title>
      <div
        v-for="palette in ['Purple', 'General']"
        :key="palette"
        style="display: flex; align-items: center; column-gap: 10px"
      >
        <span>{{ palette }}</span>
        <div style="display: inline-flex; column-gap: 4px">
          <div
            v-for="n in 10"
            :key="n"
            :style="{
              width: '40px',
              height: '40px',
              background:
                palette === 'Purple'
                  ? 'rgba(var(--semi-ai-purple-' + (n - 1) + '), 1)'
                  : 'var(--semi-ai-general-' + (n - 1) + ')',
              borderRadius: '50%',
            }"
          />
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; row-gap: 10px">
      <Typography.Title :heading="5">AI Icon</Typography.Title>
      <div style="display: flex; column-gap: 10px">
        <IconAIBellLevel1 size="extra-large" /><IconAIEditLevel2
          size="extra-large"
        /><IconAIFileLevel3 size="extra-large" /><IconAIFilledLevel3
          size="extra-large"
        /><IconAIImageLevel3 size="extra-large" /><IconAISearchLevel3
          size="extra-large"
        /><IconAIStrokedLevel3 size="extra-large" /><IconAIWandLevel3
          size="extra-large"
          :fill="[
            'var(--semi-color-danger)',
            'var(--semi-color-success)',
            'var(--semi-color-primary)',
            'var(--semi-color-warning)',
          ]"
        /><IconAILoading size="extra-large" />
      </div>
    </div>
    <div style="display: flex; flex-direction: column; row-gap: 10px">
      <Typography.Title :heading="5">AI Button</Typography.Title>
      <div style="display: flex; row-gap: 16px; flex-direction: column">
        <div
          v-for="type in ['primary', 'tertiary'] as const"
          :key="type"
          style="display: flex; column-gap: 16px"
        >
          <Button colorful theme="solid" :type="type"
            ><template #icon
              ><IconAIFilledLevel1 v-if="type === 'primary'" /><IconAIFilledLevel3
                v-else /></template
            >Colorful</Button
          ><Button colorful theme="solid" :type="type" loading>Colorful</Button
          ><Button colorful theme="solid" :type="type" disabled
            ><template #icon
              ><IconAIFilledLevel1 v-if="type === 'primary'" /><IconAIFilledLevel3
                v-else /></template
            >Colorful</Button
          >
        </div>
        <div style="display: flex; column-gap: 16px">
          <template v-for="type in ['primary', 'tertiary'] as const" :key="type"
            ><Button colorful theme="solid" :type="type" aria-label="AI"
              ><template #icon
                ><IconAIFilledLevel1 v-if="type === 'primary'" /><IconAIFilledLevel3
                  v-else /></template></Button
            ><Button colorful theme="solid" :type="type" loading aria-label="AI loading" /><Button
              colorful
              theme="solid"
              :type="type"
              :disabled="type === 'primary'"
              aria-label="AI"
              ><template #icon
                ><IconAIFilledLevel1 v-if="type === 'primary'" /><IconAIFilledLevel3
                  v-else /></template></Button
          ></template>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; row-gap: 10px">
      <Typography.Title :heading="5" style="margin-top: 10px">AI Tag</Typography.Title>
      <div
        style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: fit-content"
      >
        <template v-for="gradient in [true, false]" :key="String(gradient)"
          ><Tag
            v-for="type in ['solid', 'light', 'ghost'] as const"
            :key="type"
            colorful
            :type="type"
            shape="circle"
            :gradient="gradient"
            ><template #prefixIcon
              ><IconAIFilledLevel3
                v-if="gradient && type !== 'solid'"
                size="small" /><IconAIFilledLevel1 v-else size="small" /></template
            >AI</Tag
          ></template
        >
      </div>
    </div>
    <div style="display: flex; flex-direction: column; row-gap: 10px">
      <Typography.Title :heading="5" style="margin-top: 10px">AI FloatButton</Typography.Title>
      <div
        style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: fit-content"
      >
        <FloatButton
          colorful
          size="large"
          :badge="{ count: 'VIP', type: 'danger' }"
          style="position: static"
          aria-label="AI edit"
          ><template #icon><IconAIEditLevel1 /></template
        ></FloatButton>
      </div>
    </div>
  </div>
</template>
