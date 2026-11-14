<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { ConfigProvider, type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import { modalReview } from '../../../../packages/test-infra/src/root-theme-review';

/** 审查尺寸、全屏和确定按钮加载，不改变默认场景。 */
const review = modalReview(window.location.search);

/** 回归入口：provider 为零高组织宿主，explicit 为有尺寸的局部弹窗。 */
const containerMode = new URLSearchParams(window.location.search).get('modalContainer');
/** 宿主追加到 body，确保与业务场景一样位于应用之后。 */
const popupHost = containerMode ? document.createElement('div') : undefined;
if (popupHost) {
  popupHost.dataset.testid = 'modal-popup-host';
  popupHost.style.cssText =
    containerMode === 'provider'
      ? 'position:relative;margin-top:100vh'
      : 'position:relative;width:640px;height:480px;margin:120px 40px';
  document.body.appendChild(popupHost);
}
/** 默认场景不提供 getter，保持既有 body 行为与视觉基线。 */
const getPopupContainer = popupHost ? () => popupHost : undefined;
/** 缺省时省略参数，遵守公开可选 prop 的 exactOptionalPropertyTypes 契约。 */
const providerProps =
  containerMode === 'provider' && getPopupContainer ? { getPopupContainer } : {};
/** 显式容器仅用于局部定位对照，默认不改变既有审查参数。 */
const modalProps = {
  ...review,
  ...(containerMode === 'explicit' && getPopupContainer ? { getPopupContainer } : {}),
};
/** 场景卸载只移除自己创建的宿主。 */
onBeforeUnmount(() => popupHost?.remove());

defineProps<{ direction: ConfigDirection }>();
/** 控制默认打开和按钮再次打开。 */
const visible = ref(true);

/** 页尾确认关闭本次弹窗。 */
function closeModal(): void {
  visible.value = false;
}
</script>

<template>
  <ConfigProvider v-bind="providerProps" :direction="direction">
    <div class="modal-scenario" data-testid="modal-vue">
      <Button data-action="open-modal" @click="visible = true">打开发布确认</Button>
      <Modal
        v-bind="modalProps"
        v-model:visible="visible"
        data-parity-target="modal-basic"
        title="发布变更"
        :motion="false"
        ok-text="确认发布"
        cancel-text="稍后处理"
        @ok="closeModal"
      >
        <p class="modal-scenario__content">确认将 3 项变更发布到生产环境？</p>
      </Modal>
    </div>
  </ConfigProvider>
</template>
