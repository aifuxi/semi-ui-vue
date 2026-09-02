<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue';
import { shallowRef } from 'vue';

const lastValue = shallowRef('none');
</script>

<template>
  <div class="pin-code-scenario" data-testid="pin-code-vue">
    <section class="pin-code-scenario__section" aria-label="验证码输入">
      <h3>验证码输入</h3>
      <div class="pin-code-scenario__grid">
        <label>
          小尺寸
          <PinCode
            class-name="pin-code-target-small"
            size="small"
            default-value="123456"
            @change="lastValue = $event"
          />
        </label>
        <label>
          默认尺寸
          <PinCode
            class-name="pin-code-target-default"
            default-value="123456"
            @change="lastValue = $event"
          />
        </label>
        <label>
          大尺寸
          <PinCode
            class-name="pin-code-target-large"
            size="large"
            default-value="123456"
            @change="lastValue = $event"
          />
        </label>
        <label>
          四位混合码
          <PinCode
            :auto-focus="false"
            class-name="pin-code-target-mixed"
            :count="4"
            format="mixed"
            default-value="A1b2"
            @change="lastValue = $event"
          />
        </label>
        <label>
          禁用
          <PinCode
            :auto-focus="false"
            class-name="pin-code-target-disabled"
            default-value="654321"
            disabled
          />
        </label>
        <label>
          空值
          <PinCode
            :auto-focus="false"
            class-name="pin-code-target-empty"
            @change="lastValue = $event"
          />
        </label>
      </div>
    </section>
    <output class="pin-code-scenario__status" aria-live="polite">
      {{ `最近变化：${lastValue}` }}
    </output>
  </div>
</template>
