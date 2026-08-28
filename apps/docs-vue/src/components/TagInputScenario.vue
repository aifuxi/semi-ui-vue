<script setup lang="ts">
import { TagInput } from '@workspace/ui';
import { shallowRef } from 'vue';

const status = shallowRef('none');
</script>

<template>
  <div class="tag-input-scenario" data-testid="tag-input-vue">
    <section class="tag-input-scenario__section" aria-label="基础标签输入">
      <h3>基础、尺寸与状态</h3>
      <div class="tag-input-scenario__stack">
        <TagInput
          :default-value="['抖音', '火山', '西瓜视频']"
          placeholder="请输入..."
          :show-content-tooltip="false"
          data-parity-target="tag-input-basic"
          @change="status = `change:${$event.join('|')}`"
        />
        <div class="tag-input-scenario__row">
          <TagInput
            size="small"
            :default-value="['small']"
            :show-content-tooltip="false"
            data-parity-target="tag-input-small"
          />
          <TagInput
            size="large"
            :default-value="['large']"
            :show-content-tooltip="false"
            data-parity-target="tag-input-large"
          />
        </div>
        <div class="tag-input-scenario__row">
          <TagInput
            disabled
            :default-value="['disabled']"
            :show-content-tooltip="false"
            data-parity-target="tag-input-disabled"
          />
          <TagInput
            validate-status="warning"
            :default-value="['warning']"
            :show-content-tooltip="false"
            data-parity-target="tag-input-warning"
          />
        </div>
      </div>
    </section>

    <section class="tag-input-scenario__section" aria-label="折叠与装饰">
      <h3>折叠、前后缀与清空</h3>
      <div class="tag-input-scenario__stack">
        <TagInput
          prefix="平台"
          suffix="标签"
          :default-value="['Semi', 'Vue']"
          show-clear
          :show-content-tooltip="false"
          data-parity-target="tag-input-affix"
        />
        <TagInput
          :max-tag-count="2"
          :default-value="['Semi', 'Design', 'Vue', 'Parity']"
          :show-content-tooltip="false"
          data-parity-target="tag-input-collapsed"
        />
      </div>
    </section>

    <output class="tag-input-scenario__status" aria-live="polite">
      {{ `最近变化：${status}` }}
    </output>
  </div>
</template>
