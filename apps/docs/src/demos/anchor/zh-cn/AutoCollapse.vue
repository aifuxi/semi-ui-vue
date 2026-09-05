<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const getContainer = () => scrollContainer.value;
const scrollLabel = '锚点目标内容';
</script>

<template>
  <div style="display: flex; gap: 32px; align-items: flex-start">
    <Anchor
      :auto-collapse="true"
      :get-container="getContainer"
      :target-offset="60"
      :offset-top="100"
    >
      <AnchorLink href="#anchor-autocollapse-zh-0" title="1. 动态展示">
        <AnchorLink href="#anchor-autocollapse-zh-1" title="1.1 组件">
          <AnchorLink href="#anchor-autocollapse-zh-2" title="1.1.1 Avatar" />
          <AnchorLink href="#anchor-autocollapse-zh-3" title="1.1.2 Button" />
          <AnchorLink href="#anchor-autocollapse-zh-4" title="1.1.3 Icon" />
        </AnchorLink>
        <AnchorLink href="#anchor-autocollapse-zh-5" title="1.2 物料" />
        <AnchorLink href="#anchor-autocollapse-zh-6" title="1.3 主题商店" />
      </AnchorLink>
      <AnchorLink href="#anchor-autocollapse-zh-7" title="2. 设计语言" />
    </Anchor>
    <div
      ref="scrollContainer"
      tabindex="0"
      :aria-label="scrollLabel"
      style="
        height: 280px;
        overflow: auto;
        flex: 1;
        min-width: 160px;
        border: 1px solid var(--semi-color-border);
      "
    >
      <section id="anchor-autocollapse-zh-0" style="min-height: 220px; padding: 16px">
        <h3>1. 动态展示</h3>
      </section>
      <section id="anchor-autocollapse-zh-1" style="min-height: 220px; padding: 16px">
        <h3>1.1 组件</h3>
      </section>
      <section id="anchor-autocollapse-zh-2" style="min-height: 220px; padding: 16px">
        <h3>1.1.1 Avatar</h3>
      </section>
      <section id="anchor-autocollapse-zh-3" style="min-height: 220px; padding: 16px">
        <h3>1.1.2 Button</h3>
      </section>
      <section id="anchor-autocollapse-zh-4" style="min-height: 220px; padding: 16px">
        <h3>1.1.3 Icon</h3>
      </section>
      <section id="anchor-autocollapse-zh-5" style="min-height: 220px; padding: 16px">
        <h3>1.2 物料</h3>
      </section>
      <section id="anchor-autocollapse-zh-6" style="min-height: 220px; padding: 16px">
        <h3>1.3 主题商店</h3>
      </section>
      <section id="anchor-autocollapse-zh-7" style="min-height: 220px; padding: 16px">
        <h3>2. 设计语言</h3>
      </section>
      <div style="height: 280px" aria-hidden="true" />
    </div>
  </div>
</template>
