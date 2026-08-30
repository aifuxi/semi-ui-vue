<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapse, CollapsePanel, type CollapseActiveKey } from '@aifuxi/semi-ui-vue';

const controlledKeys = shallowRef<string[]>(['controlled-1']);
const status = shallowRef('基础面板：overview');

function keyList(value: CollapseActiveKey): string[] {
  return Array.isArray(value) ? value : [value];
}

function handleBasicChange(keys: CollapseActiveKey): void {
  status.value = `基础面板：${keyList(keys).join(',') || 'none'}`;
}
</script>

<template>
  <div class="collapse-scenario" data-testid="collapse-vue">
    <section class="collapse-scenario__section collapse-scenario__section--wide">
      <div class="collapse-scenario__heading">
        <div><strong>交付信息</strong><span>多面板 + keepDOM / lazyRender</span></div>
      </div>
      <Collapse
        :default-active-key="['overview']"
        keep-d-o-m
        lazy-render
        :motion="false"
        data-parity-target="collapse-basic"
        @change="handleBasicChange"
      >
        <CollapsePanel item-key="overview" header="版本基线" extra="v2.102.0">
          <p>固定源码、组件行为与视觉证据同步交付。</p>
        </CollapsePanel>
        <CollapsePanel item-key="quality" header="质量门禁">
          <p data-lazy-content>类型、单元、SSR、Chromium 与真实 tarball 全部通过。</p>
        </CollapsePanel>
        <CollapsePanel item-key="release" header="发布状态" :show-arrow="false">
          <p>独立样式入口与公开声明保持稳定。</p>
        </CollapsePanel>
      </Collapse>
    </section>

    <div class="collapse-scenario__grid">
      <section class="collapse-scenario__section">
        <div class="collapse-scenario__heading">
          <div><strong>手风琴</strong><span>单项 + disabled</span></div>
        </div>
        <Collapse
          accordion
          default-active-key="design"
          :motion="false"
          data-parity-target="collapse-accordion"
        >
          <CollapsePanel item-key="design" header="设计对齐">
            <p>关键样式与几何逐项相等。</p>
          </CollapsePanel>
          <CollapsePanel item-key="runtime" header="运行时对齐">
            <p>受控状态与事件顺序保持一致。</p>
          </CollapsePanel>
          <CollapsePanel item-key="blocked" header="暂不可用" disabled>
            <p>禁用面板不会响应点击。</p>
          </CollapsePanel>
        </Collapse>
      </section>

      <section class="collapse-scenario__section">
        <div class="collapse-scenario__heading">
          <div><strong>左侧图标</strong><span>仅图标触发 + 自定义图标</span></div>
        </div>
        <Collapse
          default-active-key="left-1"
          expand-icon-position="left"
          :click-header-to-expand="false"
          :motion="false"
          data-parity-target="collapse-left"
        >
          <template #expandIcon><span class="collapse-scenario__custom-icon">+</span></template>
          <template #collapseIcon><span class="collapse-scenario__custom-icon">−</span></template>
          <CollapsePanel item-key="left-1" header="仅点击图标切换" extra="icon only">
            <p>标题文本保持稳定，图标热区负责切换。</p>
          </CollapsePanel>
          <CollapsePanel item-key="left-2">
            <template #header
              ><span class="collapse-scenario__node-header">VNode header</span></template
            >
            <p>节点标题不自动插入 extra 区域。</p>
          </CollapsePanel>
        </Collapse>
      </section>

      <section class="collapse-scenario__section">
        <div class="collapse-scenario__heading">
          <div><strong>受控面板</strong><span>controlled activeKey</span></div>
        </div>
        <Collapse
          v-model:active-key="controlledKeys"
          :motion="false"
          data-parity-target="collapse-controlled"
        >
          <CollapsePanel item-key="controlled-1" header="受控状态一">
            <p>父级回传后更新展开状态。</p>
          </CollapsePanel>
          <CollapsePanel item-key="controlled-2" header="受控状态二">
            <p>事件值仍保持 key 数组。</p>
          </CollapsePanel>
        </Collapse>
      </section>
    </div>

    <output class="collapse-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
