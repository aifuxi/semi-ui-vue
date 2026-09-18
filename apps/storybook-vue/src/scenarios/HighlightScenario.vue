<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
</script>

<template>
  <div class="highlight-scenario" data-testid="highlight-vue">
    <section class="highlight-scenario__item">
      <span class="highlight-scenario__label">基础与默认主题</span>
      <p class="highlight-scenario__text" data-parity-target="highlight-basic">
        <Highlight
          source-string="从 Semi Design 到 Any Design，快速定义你的设计系统"
          :search-words="['Semi Design', '设计系统']"
        />
      </p>
    </section>

    <section class="highlight-scenario__item">
      <span class="highlight-scenario__label">统一 class 与 style</span>
      <p class="highlight-scenario__text" data-parity-target="highlight-custom">
        <Highlight
          component="span"
          source-string="Semi connects design and code"
          :search-words="['Semi', 'design', 'code']"
          highlight-class-name="highlight-scenario__custom"
          :highlight-style="{
            backgroundColor: 'rgba(var(--semi-teal-5), 1)',
            borderRadius: '4px',
            color: 'rgba(var(--semi-white), 1)',
            padding: '3px 5px',
          }"
        />
      </p>
    </section>

    <section class="highlight-scenario__item">
      <span class="highlight-scenario__label">大小写与正则</span>
      <p class="highlight-scenario__text" data-parity-target="highlight-regex">
        <Highlight
          source-string="Semi semi · Design   System"
          :search-words="['semi', 'Design\\s+System']"
          case-sensitive
          :auto-escape="false"
        />
      </p>
    </section>

    <section class="highlight-scenario__item">
      <span class="highlight-scenario__label">重叠词与自定义标签</span>
      <p class="highlight-scenario__text" data-parity-target="highlight-overlap">
        <Highlight
          component="strong"
          source-string="design system for design teams"
          :search-words="['design', 'design system', 'system']"
          highlight-class-name="highlight-scenario__strong"
        />
      </p>
    </section>
  </div>
</template>
