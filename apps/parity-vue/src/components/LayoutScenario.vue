<script setup lang="ts">
import { computed, shallowReactive } from 'vue';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from '@aifuxi/semi-ui-vue';
import type { LayoutBreakpoint } from '@aifuxi/semi-ui-vue';

const headerFooterStyle = {
  height: 42,
  lineHeight: '42px',
  background: 'var(--harness-surface)',
};
const contentStyle = {
  height: 92,
  lineHeight: '92px',
  background: 'var(--harness-panel)',
};
const breakpoints = shallowReactive({ xs: false, md: false });
const breakpointLabel = computed(
  () => `xs:${String(breakpoints.xs)} · md:${String(breakpoints.md)}`,
);

function handleBreakpoint(screen: LayoutBreakpoint, match: boolean): void {
  if (screen === 'xs' || screen === 'md') breakpoints[screen] = match;
}
</script>

<template>
  <div class="layout-scenario" data-testid="layout-vue">
    <section class="layout-scenario__section" aria-label="三行布局">
      <h3>三行布局</h3>
      <Layout class="layout-scenario__demo" data-parity-target="layout-vertical">
        <LayoutHeader :style="headerFooterStyle" data-parity-target="layout-header">
          Header
        </LayoutHeader>
        <LayoutContent :style="contentStyle" data-parity-target="layout-content">
          Content
        </LayoutContent>
        <LayoutFooter :style="headerFooterStyle" data-parity-target="layout-footer">
          Footer
        </LayoutFooter>
      </Layout>
    </section>

    <section class="layout-scenario__section" aria-label="侧边栏布局">
      <h3>侧边栏布局</h3>
      <Layout class="layout-scenario__demo" data-parity-target="layout-with-sider">
        <LayoutSider
          aria-label="演示侧边栏"
          :breakpoint="['xs', 'md']"
          data-breakpoint-source="layout"
          data-parity-target="layout-sider"
          :style="{ width: '96px', background: 'var(--harness-surface)' }"
          @breakpoint="handleBreakpoint"
        >
          Sider
        </LayoutSider>
        <Layout data-parity-target="layout-nested">
          <LayoutHeader :style="headerFooterStyle">Header</LayoutHeader>
          <LayoutContent :style="contentStyle">Content</LayoutContent>
          <LayoutFooter :style="headerFooterStyle">Footer</LayoutFooter>
        </Layout>
      </Layout>
      <output class="layout-scenario__breakpoints" aria-live="polite">
        {{ breakpointLabel }}
      </output>
    </section>

    <section class="layout-scenario__section" aria-label="自定义语义标签">
      <h3>自定义语义标签</h3>
      <Layout
        aria-label="文章布局"
        class="layout-scenario__semantic"
        data-parity-target="layout-semantic"
        role="region"
        tag-name="article"
      >
        <LayoutContent tag-name="div">自定义 article / div 标签</LayoutContent>
      </Layout>
    </section>
  </div>
</template>
