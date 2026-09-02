<script setup lang="ts">
import { shallowRef } from 'vue';
import { TabPane, Tabs } from '@aifuxi/semi-ui-vue/tabs';

const status = shallowRef('等待操作');
const labels = ['文档', '快速起步', '帮助'];
</script>

<template>
  <div class="tabs-scenario" data-testid="tabs-vue">
    <div class="tabs-scenario__section">
      <span class="tabs-scenario__label">Line / 文档首例</span>
      <Tabs data-parity-target="tabs-line" @change="(key: string) => (status = `Line：${key}`)">
        <TabPane
          v-for="(label, index) in labels"
          :key="`line${index + 1}`"
          :item-key="`line${index + 1}`"
          :tab="label"
        >
          {{ label }}内容
        </TabPane>
      </Tabs>
    </div>
    <div class="tabs-scenario__types">
      <div
        v-for="type in ['card', 'button', 'slash'] as const"
        :key="type"
        class="tabs-scenario__section"
      >
        <span class="tabs-scenario__label">{{ type }}</span>
        <Tabs :data-parity-target="`tabs-${type}`" :type="type">
          <TabPane
            v-for="(label, index) in labels"
            :key="`${type}${index + 1}`"
            :item-key="`${type}${index + 1}`"
            :tab="label"
          >
            {{ label }}内容
          </TabPane>
        </Tabs>
      </div>
    </div>
    <div class="tabs-scenario__section tabs-scenario__left">
      <span class="tabs-scenario__label">Left / disabled / closable</span>
      <Tabs
        data-parity-target="tabs-left"
        default-active-key="behavior1"
        tab-position="left"
        type="card"
        @change="(key: string) => (status = `Left：${key}`)"
        @tab-close="(key: string) => (status = `关闭：${key}`)"
      >
        <template #tabBarExtraContent><span class="tabs-scenario__extra">操作</span></template>
        <TabPane item-key="behavior1" tab="文档">文档内容</TabPane>
        <TabPane disabled item-key="behavior2" tab="快速起步">快速起步内容</TabPane>
        <TabPane closable item-key="behavior3" tab="帮助">帮助内容</TabPane>
      </Tabs>
    </div>
    <div class="tabs-scenario__types">
      <div class="tabs-scenario__section">
        <span class="tabs-scenario__label">More</span>
        <Tabs data-parity-target="tabs-more" :more="2" type="card">
          <TabPane v-for="index in 6" :key="index" :item-key="`more${index}`" :tab="`Tab-${index}`">
            More content {{ index }}
          </TabPane>
        </Tabs>
      </div>
      <div class="tabs-scenario__section tabs-scenario__collapsed">
        <span class="tabs-scenario__label">Collapsible</span>
        <Tabs collapsible data-parity-target="tabs-collapsible" type="card">
          <TabPane
            v-for="index in 7"
            :key="index"
            :item-key="`scroll${index}`"
            :tab="`Long Tab ${index}`"
          >
            Scroll content {{ index }}
          </TabPane>
        </Tabs>
      </div>
    </div>
    <output class="tabs-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
