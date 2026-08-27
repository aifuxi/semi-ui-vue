<script setup lang="ts">
import { IconSearch } from '@workspace/icons';
import { AutoComplete, type AutoCompleteDataItem, type AutoCompleteItem } from '@workspace/ui';
import { onMounted, shallowRef } from 'vue';

const domains = ['gmail.com', '163.com', 'qq.com'];
const people: AutoCompleteDataItem[] = [
  { value: '夏可漫', label: 'xiakeman@example.com', team: 'Design' },
  { value: '申悦', label: 'shenyue@example.com', team: 'Engineering' },
  { value: '曲晨一', label: 'quchenyi@example.com', team: 'Product' },
];
const host = shallowRef<HTMLElement | null>(null);
const ready = shallowRef(false);
const data = shallowRef(domains.map((domain) => `semi@${domain}`));
const value = shallowRef('semi');
const lastValue = shallowRef('none');

onMounted(() => {
  ready.value = true;
});
function getPopupContainer(): HTMLElement {
  return host.value ?? document.body;
}
function search(input: string): void {
  data.value = input ? domains.map((domain) => `${input}@${domain}`) : [];
}
function changed(next: string | number): void {
  lastValue.value = String(next);
}
function person(item: AutoCompleteItem): AutoCompleteDataItem {
  return item as AutoCompleteDataItem;
}
</script>

<template>
  <div ref="host" class="auto-complete-scenario" data-testid="auto-complete-vue">
    <template v-if="ready">
      <section class="auto-complete-scenario__section" aria-label="基础自动完成">
        <h3>基础自动完成</h3>
        <div class="auto-complete-scenario__row">
          <AutoComplete
            v-model="value"
            :data="data"
            show-clear
            placeholder="搜索..."
            :style="{ width: '220px' }"
            data-parity-target="auto-complete-basic"
            dropdown-class-name="auto-complete-target-basic-options"
            :get-popup-container="getPopupContainer"
            :motion="false"
            @search="search"
            @change="changed"
          >
            <template #prefix><IconSearch /></template>
          </AutoComplete>
          <AutoComplete
            :data="[1, 2, 3]"
            disabled
            placeholder="禁用"
            :style="{ width: '160px' }"
            data-parity-target="auto-complete-disabled"
            :get-popup-container="getPopupContainer"
          />
          <AutoComplete
            :data="[1, 2, 3]"
            default-value="warning"
            size="large"
            validate-status="warning"
            :style="{ width: '180px' }"
            data-parity-target="auto-complete-large"
            :get-popup-container="getPopupContainer"
          />
        </div>
      </section>
      <section class="auto-complete-scenario__section" aria-label="候选项与浮层">
        <h3>候选项与浮层</h3>
        <AutoComplete
          :data="people"
          default-open
          default-active-first-option
          :style="{ width: '280px' }"
          data-parity-target="auto-complete-custom"
          dropdown-class-name="auto-complete-target-options"
          :get-popup-container="getPopupContainer"
          :motion="false"
          :render-selected-item="(option) => String(option.label)"
          @change="changed"
        >
          <template #option="{ item }">
            <span class="auto-complete-scenario__person">
              <strong>{{ person(item).value }}</strong>
              <span>{{ person(item).label }}</span>
            </span>
          </template>
        </AutoComplete>
      </section>
      <output class="auto-complete-scenario__status" aria-live="polite">{{
        `最近输入：${lastValue}`
      }}</output>
    </template>
  </div>
</template>
