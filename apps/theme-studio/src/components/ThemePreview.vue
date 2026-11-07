<script setup lang="ts">
import { computed } from 'vue';
import { Tag } from '@aifuxi/semi-ui-vue';
import { typographyVariables, useStudio } from '../studio';
import PreviewCard from './PreviewCard.vue';
import ComponentGallery from './ComponentGallery.vue';
import TypographyPreview from './TypographyPreview.vue';

/** 组件预览与场景切换不会创建新的主题。 */
defineProps<{ scene?: string | undefined; component?: string | undefined }>();

/** 预览仅消费当前应用提供的状态。 */
const studio = useStudio();
/** 关闭局部边界时撤回所有主题声明。 */
const localClass = computed(() =>
  studio.settings.localEnabled
    ? [
        `theme-brand-${studio.local.fixed ? 'fixed' : studio.local.brand.slice(1)}`,
        studio.local.mode === 'dark' ? 'semi-always-dark' : 'semi-always-light',
      ]
    : [],
);
/** 当前品牌十级色阶来自真实公开生成器；固定基线不伪造为生成色盘。 */
const scale = computed(() => studio.globalTheme.value?.palette[studio.global.mode].brand);
</script>

<template>
  <div class="preview-canvas">
    <div class="preview-caption">
      <span>实时预览</span><Tag>{{ studio.global.mode === 'dark' ? 'Dark' : 'Light' }}</Tag>
    </div>
    <section
      class="theme-surface global-preview"
      data-testid="global-scope"
      aria-label="当前主题预览"
    >
      <TypographyPreview v-if="scene === 'typography'" />
      <ComponentGallery
        v-else-if="component || (scene && scene !== 'scopes')"
        :scene="scene"
        :component="component"
      />
      <PreviewCard
        name="global"
        title="主题表单"
        :theme="studio.global"
        :button-style="studio.buttonStyle.value"
        @change="Object.assign(studio.global, $event)"
      />
      <section
        v-if="scene === 'scopes' || studio.settings.category === 'local'"
        class="local-preview theme-surface"
        :data-semi-theme="studio.settings.localEnabled ? 'studio-local' : undefined"
        :theme-mode="studio.settings.localEnabled ? studio.local.mode : undefined"
        :class="localClass"
        :style="
          studio.settings.localEnabled ? typographyVariables(studio.local.typography) : undefined
        "
        data-testid="local-scope"
        aria-label="局部主题预览"
      >
        <div class="scope-caption">
          {{ studio.settings.localEnabled ? '独立局部主题' : '继承外层主题'
          }}<Tag size="small">{{
            studio.settings.localEnabled ? studio.local.mode : studio.global.mode
          }}</Tag>
        </div>
        <PreviewCard
          name="local"
          title="局部主题表单"
          :theme="studio.settings.localEnabled ? studio.local : studio.global"
          compact
          :button-style="studio.buttonStyle.value"
          @change="
            Object.assign(studio.settings.localEnabled ? studio.local : studio.global, $event)
          "
        />
      </section>
    </section>
    <div v-if="scale" class="palette-strip" aria-label="当前品牌十级色阶">
      <div
        v-for="(color, index) in scale"
        :key="index"
        :style="{ background: color }"
        :title="`${index}: ${color}`"
      >
        <span>{{ index }}</span>
      </div>
    </div>
  </div>
</template>
