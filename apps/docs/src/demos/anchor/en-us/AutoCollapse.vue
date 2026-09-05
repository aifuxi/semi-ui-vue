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
      :auto-collapse="true"
      :get-container="getContainer"
      :target-offset="60"
      :offset-top="100"
    >
      <AnchorLink href="#anchor-autocollapse-en-0" title="1. Auto Collapse">
        <AnchorLink href="#anchor-autocollapse-en-1" title="1.1 Components">
          <AnchorLink href="#anchor-autocollapse-en-2" title="1.1.1 Avatar" />
          <AnchorLink href="#anchor-autocollapse-en-3" title="1.1.2 Button" />
          <AnchorLink href="#anchor-autocollapse-en-4" title="1.1.3 Icon" />
        </AnchorLink>
        <AnchorLink href="#anchor-autocollapse-en-5" title="1.2 Blocks" />
        <AnchorLink href="#anchor-autocollapse-en-6" title="1.3 Theme" />
      </AnchorLink>
      <AnchorLink href="#anchor-autocollapse-en-7" title="2. Design" />
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
      <section id="anchor-autocollapse-en-0" style="min-height: 220px; padding: 16px">
        <h3>1. Auto Collapse</h3>
      </section>
      <section id="anchor-autocollapse-en-1" style="min-height: 220px; padding: 16px">
        <h3>1.1 Components</h3>
      </section>
      <section id="anchor-autocollapse-en-2" style="min-height: 220px; padding: 16px">
        <h3>1.1.1 Avatar</h3>
      </section>
      <section id="anchor-autocollapse-en-3" style="min-height: 220px; padding: 16px">
        <h3>1.1.2 Button</h3>
      </section>
      <section id="anchor-autocollapse-en-4" style="min-height: 220px; padding: 16px">
        <h3>1.1.3 Icon</h3>
      </section>
      <section id="anchor-autocollapse-en-5" style="min-height: 220px; padding: 16px">
        <h3>1.2 Blocks</h3>
      </section>
      <section id="anchor-autocollapse-en-6" style="min-height: 220px; padding: 16px">
        <h3>1.3 Theme</h3>
      </section>
      <section id="anchor-autocollapse-en-7" style="min-height: 220px; padding: 16px">
        <h3>2. Design</h3>
      </section>
      <div style="height: 280px" aria-hidden="true" />
    </div>
  </div>
</template>
