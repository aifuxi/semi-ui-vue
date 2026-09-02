<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';

const basicOpen = shallowRef(true);
const lazyOpen = shallowRef(false);
const adaptiveRows = shallowRef(2);
const status = shallowRef('基础面板：展开');

function toggleBasic(): void {
  basicOpen.value = !basicOpen.value;
  status.value = `基础面板：${basicOpen.value ? '展开' : '收起'}`;
}
</script>

<template>
  <div class="collapsible-scenario" data-testid="collapsible-vue">
    <section class="collapsible-scenario__section collapsible-scenario__section--wide">
      <div class="collapsible-scenario__heading">
        <div><strong>产品交付说明</strong><span>默认动效与 fade</span></div>
        <button type="button" data-action="toggle-basic" @click="toggleBasic">
          {{ basicOpen ? '收起' : '展开' }}
        </button>
      </div>
      <Collapsible
        id="collapsible-basic-content"
        :is-open="basicOpen"
        fade
        data-parity-target="collapsible-basic"
        @motion-end="status = '基础面板：动效结束'"
      >
        <div class="collapsible-scenario__content collapsible-scenario__content--hero">
          <strong>从设计到交付</strong>
          <p>统一结构、行为与视觉证据，让每次展开都保持确定。</p>
          <span>v2.102.0 fixed source</span>
        </div>
      </Collapsible>
    </section>

    <div class="collapsible-scenario__grid">
      <section class="collapsible-scenario__section">
        <div class="collapsible-scenario__heading">
          <div><strong>保留摘要</strong><span>collapseHeight 72</span></div>
        </div>
        <Collapsible :collapse-height="72" data-parity-target="collapsible-preview">
          <div class="collapsible-scenario__content">
            <p>第一行保留在折叠窗口内。</p>
            <p>第二行展示被裁剪的内容。</p>
            <p>第三行仍保留在 DOM 中。</p>
          </div>
        </Collapsible>
      </section>

      <section class="collapsible-scenario__section">
        <div class="collapsible-scenario__heading">
          <div>
            <strong>自适应高度</strong><span>动态重测 {{ adaptiveRows }}</span>
          </div>
          <button type="button" data-action="add-row" @click="adaptiveRows += 1">增加</button>
        </div>
        <Collapsible
          :collapse-height="140"
          collapse-height-adaptive
          :re-calc-key="adaptiveRows"
          data-parity-target="collapsible-adaptive"
        >
          <div class="collapsible-scenario__content collapsible-scenario__content--compact">
            <p v-for="row in adaptiveRows" :key="row">动态内容 {{ row }}</p>
          </div>
        </Collapsible>
      </section>

      <section class="collapsible-scenario__section">
        <div class="collapsible-scenario__heading">
          <div><strong>懒渲染保留</strong><span>keepDOM + lazyRender</span></div>
          <button type="button" data-action="toggle-lazy" @click="lazyOpen = !lazyOpen">
            {{ lazyOpen ? '关闭' : '首次打开' }}
          </button>
        </div>
        <Collapsible
          :is-open="lazyOpen"
          keep-d-o-m
          lazy-render
          :motion="false"
          data-parity-target="collapsible-lazy"
        >
          <div class="collapsible-scenario__content">
            <p data-lazy-content>已创建并保留的内容</p>
          </div>
        </Collapsible>
      </section>
    </div>

    <output class="collapsible-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
