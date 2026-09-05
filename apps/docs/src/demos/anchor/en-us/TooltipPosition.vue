<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const getContainer = () => scrollContainer.value;
const scrollLabel = 'Anchor targets';
</script>

<template>
  <div style="display: flex; gap: 32px; align-items: flex-start">
    <Anchor
      :show-tooltip="true"
      position="right"
      :get-container="getContainer"
      :target-offset="60"
      :offset-top="100"
    >
      <AnchorLink
        href="#anchor-tooltipposition-en-0"
        title="Tooltip is a useful tool that displays the entire content when text is abbreviated."
      />
      <AnchorLink href="#anchor-tooltipposition-en-1" title="Components" />
      <AnchorLink href="#anchor-tooltipposition-en-2" title="Design" />
      <AnchorLink href="#anchor-tooltipposition-en-3" title="Blocks" />
      <AnchorLink href="#anchor-tooltipposition-en-4" title="Theme" />
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
      <section id="anchor-tooltipposition-en-0" style="min-height: 220px; padding: 16px">
        <h3>Tooltip is a useful tool that displays the entire content when text is abbreviated.</h3>
      </section>
      <section id="anchor-tooltipposition-en-1" style="min-height: 220px; padding: 16px">
        <h3>Components</h3>
      </section>
      <section id="anchor-tooltipposition-en-2" style="min-height: 220px; padding: 16px">
        <h3>Design</h3>
      </section>
      <section id="anchor-tooltipposition-en-3" style="min-height: 220px; padding: 16px">
        <h3>Blocks</h3>
      </section>
      <section id="anchor-tooltipposition-en-4" style="min-height: 220px; padding: 16px">
        <h3>Theme</h3>
      </section>
      <div style="height: 280px" aria-hidden="true" />
    </div>
  </div>
</template>
