<script setup lang="ts">
import { ref } from 'vue';
import { Button, ConfigProvider, Modal } from '@aifuxi/semi-ui-vue';
import type { ConfigDirection } from '@aifuxi/semi-ui-vue';

defineProps<{ direction: ConfigDirection }>();
const visible = ref(true);

function closeModal(): void {
  visible.value = false;
}
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="modal-scenario" data-testid="modal-vue">
      <Button data-action="open-modal" @click="visible = true">打开发布确认</Button>
      <Modal
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
