<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const status = shallowRef('等待操作');
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    Pagination: {
      pageSize: '每页条数：${pageSize}',
      total: '总页数：${total}',
      jumpTo: '跳至',
      page: '页',
    },
  },
  'en-US': {
    code: 'en-US',
    Pagination: {
      pageSize: 'Items per page: ${pageSize}',
      total: 'Total pages: ${total}',
      jumpTo: 'Jump to',
      page: ' page',
    },
  },
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="pagination-scenario" data-testid="pagination-vue">
      <div class="pagination-scenario__section">
        <span class="pagination-scenario__label">基础与截断</span>
        <Pagination
          :default-current-page="4"
          show-total
          :total="200"
          data-parity-target="pagination-basic"
          @page-change="(page) => (status = `页码：${page}`)"
        />
      </div>
      <div class="pagination-scenario__section">
        <span class="pagination-scenario__label">容量与快速跳页</span>
        <Pagination
          :default-current-page="6"
          :page-size-opts="[10, 20, 40, 100]"
          show-quick-jumper
          show-size-changer
          :total="300"
          data-parity-target="pagination-complete"
          @change="(page, size) => (status = `变更：${page}/${size}`)"
        />
      </div>
      <div class="pagination-scenario__section">
        <span class="pagination-scenario__label">迷你与禁用</span>
        <div class="pagination-scenario__row">
          <Pagination
            hover-show-page-select
            size="small"
            :total="90"
            data-parity-target="pagination-small"
          />
          <Pagination disabled :total="30" data-parity-target="pagination-disabled" />
        </div>
      </div>
      <output class="pagination-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
