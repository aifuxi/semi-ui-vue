<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@workspace/ui';

const controlled = shallowRef(false);
const lastChange = shallowRef('none');

function handleDefaultChange(checked: boolean): void {
  lastChange.value = `default:${String(checked)}`;
}

function handleControlledChange(checked: boolean): void {
  controlled.value = checked;
  lastChange.value = `controlled:${String(checked)}`;
}
</script>

<template>
  <div class="switch-scenario" data-testid="switch-vue">
    <section class="switch-scenario__section" aria-label="基础与尺寸">
      <h3>基础与尺寸</h3>
      <div class="switch-scenario__row">
        <Switch
          aria-label="默认关闭"
          data-parity-target="switch-default"
          @change="handleDefaultChange"
        />
        <Switch default-checked aria-label="默认开启" data-parity-target="switch-checked" />
        <Switch size="small" aria-label="小尺寸" data-parity-target="switch-small" />
        <Switch
          size="large"
          default-checked
          checked-text="开"
          unchecked-text="关"
          aria-label="大尺寸"
          data-parity-target="switch-large"
        />
      </div>
    </section>

    <section class="switch-scenario__section" aria-label="文本与状态">
      <h3>文本与状态</h3>
      <div class="switch-scenario__row">
        <Switch
          default-checked
          checked-text="ON"
          unchecked-text="OFF"
          aria-label="开启文本"
          data-parity-target="switch-checked-text"
        />
        <Switch
          checked-text="ON"
          unchecked-text="OFF"
          aria-label="关闭文本"
          data-parity-target="switch-unchecked-text"
        />
        <Switch disabled aria-label="禁用关闭" data-parity-target="switch-disabled" />
        <Switch
          disabled
          :checked="true"
          aria-label="禁用开启"
          data-parity-target="switch-disabled-checked"
        />
      </div>
    </section>

    <section class="switch-scenario__section" aria-label="加载与受控">
      <h3>加载与受控</h3>
      <div class="switch-scenario__row">
        <Switch loading aria-label="加载关闭" data-parity-target="switch-loading" />
        <Switch
          loading
          default-checked
          aria-label="加载开启"
          data-parity-target="switch-loading-checked"
        />
        <Switch
          v-model="controlled"
          aria-label="受控开关"
          data-parity-target="switch-controlled"
          @change="handleControlledChange"
        />
      </div>
    </section>

    <output class="switch-scenario__status" aria-live="polite">
      {{ `最近变化：${lastChange}` }}
    </output>
  </div>
</template>
