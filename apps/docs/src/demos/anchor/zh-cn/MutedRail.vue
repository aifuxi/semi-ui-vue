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
    <Anchor rail-theme="muted" :get-container="getContainer" :target-offset="60" :offset-top="100">
      <AnchorLink href="#anchor-mutedrail-zh-0" title="尺寸" />
      <AnchorLink href="#anchor-mutedrail-zh-1" title="滑轨主题" />
      <AnchorLink href="#anchor-mutedrail-zh-2" title="设计语言" />
      <AnchorLink href="#anchor-mutedrail-zh-3" title="物料平台" />
      <AnchorLink href="#anchor-mutedrail-zh-4" title="主题商店" />
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
      <section id="anchor-mutedrail-zh-0" style="min-height: 220px; padding: 16px">
        <h3>尺寸</h3>
      </section>
      <section id="anchor-mutedrail-zh-1" style="min-height: 220px; padding: 16px">
        <h3>滑轨主题</h3>
      </section>
      <section id="anchor-mutedrail-zh-2" style="min-height: 220px; padding: 16px">
        <h3>设计语言</h3>
      </section>
      <section id="anchor-mutedrail-zh-3" style="min-height: 220px; padding: 16px">
        <h3>物料平台</h3>
      </section>
      <section id="anchor-mutedrail-zh-4" style="min-height: 220px; padding: 16px">
        <h3>主题商店</h3>
      </section>
      <div style="height: 280px" aria-hidden="true" />
    </div>
  </div>
</template>
