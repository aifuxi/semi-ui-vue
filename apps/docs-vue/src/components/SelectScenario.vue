<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { Select, SelectOption, SelectOptionGroup } from '@workspace/ui';
import type { SelectModelValue } from '@workspace/ui';

const host = shallowRef<HTMLElement | null>(null);
const ready = shallowRef(false);
const lastValue = shallowRef('none');

onMounted(() => {
  ready.value = true;
});
function getPopupContainer(): HTMLElement {
  return host.value ?? document.body;
}
function handleChange(value: SelectModelValue): void {
  lastValue.value = String(value);
}
</script>

<template>
  <div ref="host" class="select-scenario" data-testid="select-vue">
    <template v-if="ready">
      <section class="select-scenario__section" aria-label="基础选择">
        <h3>基础选择</h3>
        <div class="select-scenario__row">
          <Select
            default-value="douyin"
            :style="{ width: '160px' }"
            data-parity-target="select-basic"
            :get-popup-container="getPopupContainer"
          >
            <SelectOption value="douyin">抖音</SelectOption
            ><SelectOption value="ulikecam">轻颜相机</SelectOption
            ><SelectOption value="jianying" disabled>剪映</SelectOption
            ><SelectOption value="xigua">西瓜视频</SelectOption>
          </Select>
          <Select
            default-value="douyin"
            disabled
            :style="{ width: '160px' }"
            data-parity-target="select-disabled"
            :get-popup-container="getPopupContainer"
          >
            <SelectOption value="douyin">抖音</SelectOption
            ><SelectOption value="ulikecam">轻颜相机</SelectOption>
          </Select>
          <Select
            placeholder="请选择业务线"
            show-clear
            :style="{ width: '160px' }"
            data-parity-target="select-placeholder"
            :get-popup-container="getPopupContainer"
          >
            <SelectOption value="douyin">抖音</SelectOption
            ><SelectOption value="ulikecam">轻颜相机</SelectOption>
          </Select>
        </div>
      </section>
      <section class="select-scenario__section" aria-label="多选与搜索">
        <h3>多选与搜索</h3>
        <div class="select-scenario__row">
          <Select
            multiple
            :default-value="['douyin', 'ulikecam', 'jianying']"
            :max-tag-count="2"
            :style="{ width: '300px' }"
            data-parity-target="select-multiple"
            :get-popup-container="getPopupContainer"
          >
            <SelectOption value="douyin">抖音</SelectOption
            ><SelectOption value="ulikecam">轻颜相机</SelectOption
            ><SelectOption value="jianying">剪映</SelectOption
            ><SelectOption value="xigua">西瓜视频</SelectOption>
          </Select>
          <Select
            filter
            default-open
            placeholder="搜索国家"
            :style="{ width: '220px' }"
            data-parity-target="select-filter"
            :get-popup-container="getPopupContainer"
            :motion="false"
            @change="handleChange"
          >
            <SelectOptionGroup label="Asia"
              ><SelectOption value="china">China</SelectOption
              ><SelectOption value="korea">Korea</SelectOption></SelectOptionGroup
            >
            <SelectOptionGroup label="Europe"
              ><SelectOption value="france">France</SelectOption
              ><SelectOption value="germany">Germany</SelectOption></SelectOptionGroup
            >
          </Select>
        </div>
      </section>
      <output class="select-scenario__status" aria-live="polite">{{
        `最近选择：${lastValue}`
      }}</output>
    </template>
  </div>
</template>
