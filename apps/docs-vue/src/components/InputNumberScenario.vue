<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue';
import { shallowRef } from 'vue';

const lastValue = shallowRef('none');
</script>

<template>
  <div class="input-number-scenario" data-testid="input-number-vue">
    <section class="input-number-scenario__section" aria-label="数字输入框">
      <h3>数字输入框</h3>
      <div class="input-number-scenario__grid">
        <label>
          基础
          <InputNumber
            :default-value="1"
            class-name="input-number-target-basic"
            data-parity-target="input-number-basic"
            aria-label="基础数字输入框"
            @change="(value) => (lastValue = String(value))"
          />
        </label>
        <label>
          上下界
          <InputNumber
            :default-value="1"
            :min="1"
            :max="10"
            :step="2"
            class-name="input-number-target-bounds"
            data-parity-target="input-number-bounds"
            aria-label="有上下界的数字输入框"
          />
        </label>
        <label>
          精度
          <InputNumber
            :default-value="1.234"
            :precision="2"
            class-name="input-number-target-precision"
            data-parity-target="input-number-precision"
            aria-label="精度数字输入框"
          />
        </label>
        <label>
          内置按钮
          <InputNumber
            :default-value="5"
            inner-buttons
            suffix="小时"
            class-name="input-number-target-inner"
            data-parity-target="input-number-inner"
            aria-label="内置按钮数字输入框"
          />
        </label>
        <label>
          禁用
          <InputNumber
            :default-value="2"
            disabled
            class-name="input-number-target-disabled"
            data-parity-target="input-number-disabled"
            aria-label="禁用数字输入框"
          />
        </label>
        <label>
          隐藏按钮
          <InputNumber
            :default-value="8"
            hide-buttons
            class-name="input-number-target-hidden"
            data-parity-target="input-number-hidden"
            aria-label="隐藏按钮数字输入框"
          />
        </label>
        <label>
          美元
          <InputNumber
            :default-value="1234.5"
            currency="USD"
            locale-code="en-US"
            class-name="input-number-target-currency"
            data-parity-target="input-number-currency"
            aria-label="美元数字输入框"
          />
        </label>
        <label>
          科学计数
          <InputNumber
            :default-value="123456789012345"
            scientific-notation
            class-name="input-number-target-scientific"
            data-parity-target="input-number-scientific"
            aria-label="科学计数数字输入框"
          />
        </label>
      </div>
    </section>
    <output class="input-number-scenario__status" aria-live="polite">
      {{ `最近变化：${lastValue}` }}
    </output>
  </div>
</template>
