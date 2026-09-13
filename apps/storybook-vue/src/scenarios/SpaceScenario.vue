<script setup lang="ts">
import { Space, type SpaceAlign, type SpaceSpacingPreset } from '@aifuxi/semi-ui-vue/space';

const spacingPresets: readonly SpaceSpacingPreset[] = ['tight', 'medium', 'loose'];
const alignments: readonly SpaceAlign[] = ['start', 'center', 'end', 'baseline'];
</script>

<template>
  <div class="space-scenario" data-testid="space-vue">
    <section class="space-scenario__section" aria-label="间距尺寸与方向">
      <h3>间距尺寸与方向</h3>
      <div v-for="spacing in spacingPresets" :key="spacing" class="space-scenario__line">
        <span class="space-scenario__label">{{ spacing }}</span>
        <Space :spacing="spacing" :data-parity-target="`space-${spacing}`">
          <span class="space-scenario__item">A</span>
          <span class="space-scenario__item">B</span>
          <span class="space-scenario__item">C</span>
        </Space>
      </div>
      <div class="space-scenario__line">
        <span class="space-scenario__label">12px</span>
        <Space :spacing="12" data-parity-target="space-number">
          <span class="space-scenario__item">A</span>
          <span class="space-scenario__item">B</span>
          <span class="space-scenario__item">C</span>
        </Space>
      </div>
      <div class="space-scenario__line">
        <span class="space-scenario__label">[12, 20]</span>
        <Space
          class="space-scenario__wrap"
          :spacing="[12, 20]"
          wrap
          data-parity-target="space-array-wrap"
        >
          <span class="space-scenario__item">A</span>
          <span class="space-scenario__item">B</span>
          <span class="space-scenario__item">C</span>
          <span class="space-scenario__item">D</span>
          <span class="space-scenario__item">E</span>
        </Space>
      </div>
      <div class="space-scenario__line">
        <span class="space-scenario__label">vertical</span>
        <Space vertical spacing="tight" data-parity-target="space-vertical">
          <span class="space-scenario__item">A</span>
          <span class="space-scenario__item">B</span>
          <span class="space-scenario__item">C</span>
        </Space>
      </div>
    </section>

    <section class="space-scenario__section" aria-label="交叉轴对齐">
      <h3>交叉轴对齐</h3>
      <div v-for="align in alignments" :key="align" class="space-scenario__line">
        <span class="space-scenario__label">{{ align }}</span>
        <Space :align="align" :data-parity-target="`space-align-${align}`">
          <span class="space-scenario__item">A</span>
          <span class="space-scenario__item is-tall">B</span>
          <span class="space-scenario__baseline">Text</span>
        </Space>
      </div>
    </section>
  </div>
</template>
