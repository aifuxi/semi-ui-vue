<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { ConfigProvider, type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import { sheetReview } from '../../../../packages/test-infra/src/root-theme-review';

/** 只有尺寸审查时才撤回原场景自定义宽度，让固定 size 真正生效。 */
const review = sheetReview(window.location.search);
/** 脱离演示容器审查完整视口中的内置尺寸与四方位。 */
const bodyPortal = new URLSearchParams(window.location.search).has('reviewSheetBody');

defineProps<{ direction: ConfigDirection }>();
const container = useTemplateRef<HTMLDivElement>('container');
const mounted = ref(false);
const visible = ref(true);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="side-sheet-scenario">
      <button
        type="button"
        class="side-sheet-scenario__open"
        data-action="open-side-sheet"
        @click="visible = true"
      >
        打开资源详情
      </button>
      <div ref="container" class="side-sheet-scenario__stage" data-testid="side-sheet-vue">
        <span class="side-sheet-scenario__backdrop-label">项目工作台</span>
        <SideSheet
          v-if="mounted"
          v-bind="{
            ...review,
            ...(review.size ? {} : { width: '72%' }),
            ...(bodyPortal ? {} : { getPopupContainer: () => container! }),
          }"
          v-model:visible="visible"
          data-parity-target="side-sheet-basic"
          title="资源详情"
          :motion="false"
        >
          <p class="side-sheet-scenario__body-title">生产环境</p>
          <p>3 项配置等待确认，提交后立即生效。</p>
          <template #footer>
            <button type="button" class="side-sheet-scenario__footer">保存变更</button>
          </template>
        </SideSheet>
      </div>
    </div>
  </ConfigProvider>
</template>
