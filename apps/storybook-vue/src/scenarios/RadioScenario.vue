<script setup lang="ts">
import { Radio, RadioGroup, type RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
import { shallowRef } from 'vue';

const lastValue = shallowRef('none');

function singleChanged(event: RadioChangeEvent): void {
  lastValue.value = `single:${String(event.target.checked)}`;
}

function groupChanged(event: RadioChangeEvent): void {
  lastValue.value = `group:${String(event.target.value)}`;
}
</script>

<template>
  <div class="radio-scenario" data-testid="radio-vue">
    <section class="radio-scenario__section" aria-label="基础单选框">
      <h3>基础与状态</h3>
      <div class="radio-scenario__row">
        <Radio
          value="basic"
          aria-label="基础单选框"
          data-parity-target="radio-basic"
          @change="singleChanged"
        >
          Semi Design
        </Radio>
        <Radio default-checked aria-label="默认选中" data-parity-target="radio-checked">
          默认选中
        </Radio>
        <Radio checked disabled aria-label="选中禁用" data-parity-target="radio-disabled">
          选中禁用
        </Radio>
      </div>
      <Radio
        default-checked
        extra="适用于需要补充说明的单选项"
        :style="{ width: '280px' }"
        aria-label="带辅助文本"
        data-parity-target="radio-extra"
      >
        带辅助文本
      </Radio>
    </section>

    <section class="radio-scenario__section" aria-label="单选框组">
      <h3>组合与样式</h3>
      <RadioGroup
        :options="['Semi UI', 'Semi DSM', 'Semi D2C']"
        default-value="Semi D2C"
        name="radio-horizontal"
        aria-label="水平单选框组"
        data-parity-target="radio-group"
        @change="groupChanged"
      />
      <RadioGroup
        type="button"
        button-size="large"
        default-value="即时推送"
        name="radio-button"
        aria-label="按钮单选框组"
        data-parity-target="radio-button"
        :options="['即时推送', '定时推送', '动态推送']"
      />
      <div class="radio-scenario__cards">
        <RadioGroup
          type="card"
          direction="vertical"
          default-value="card-a"
          name="radio-card"
          aria-label="卡片单选框组"
          data-parity-target="radio-card"
        >
          <Radio value="card-a" extra="卡片辅助信息" :style="{ width: '240px' }"> 卡片选中 </Radio>
          <Radio value="card-b" disabled extra="禁用辅助信息" :style="{ width: '240px' }">
            卡片禁用
          </Radio>
        </RadioGroup>
        <RadioGroup
          type="pureCard"
          direction="vertical"
          default-value="pure-a"
          name="radio-pure-card"
          aria-label="纯卡片单选框组"
          data-parity-target="radio-pure-card"
        >
          <Radio value="pure-a" extra="无可见圆点" :style="{ width: '240px' }"> 纯卡片选中 </Radio>
          <Radio value="pure-b" extra="保留原生焦点" :style="{ width: '240px' }">
            纯卡片未选
          </Radio>
        </RadioGroup>
      </div>
    </section>
    <output class="radio-scenario__status" aria-live="polite">
      {{ `最近变化：${lastValue}` }}
    </output>
  </div>
</template>
