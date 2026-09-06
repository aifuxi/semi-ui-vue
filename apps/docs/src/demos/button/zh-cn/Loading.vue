<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ref } from 'vue';
import { IconDelete } from '@aifuxi/semi-icons-vue';
const saveLoading = ref(false);
const delLoading = ref(true);
const repLoading = ref(true);
function reset(status: boolean) {
  saveLoading.value = status;
  delLoading.value = status;
  repLoading.value = status;
}
</script>

<template>
  <div>
    <div>
      <div
        class="btn-margin-right"
        style="display: inline-flex; align-items: center; padding-bottom: 14px"
      >
        <Button @click="reset(false)">关闭加载态</Button
        ><Button @click="reset(true)">开启加载态</Button>
      </div>
    </div>
    <hr />
    <Button :loading="saveLoading" style="margin-right: 14px" @click="saveLoading = true"
      >保存</Button
    ><Button
      :loading="delLoading"
      type="danger"
      style="margin-right: 14px"
      @click="delLoading = true"
      ><template #icon><IconDelete /></template>删除</Button
    >
    <div style="width: 200px; display: inline-block">
      <Button :loading="repLoading" type="warning" block theme="solid" @click="repLoading = true"
        >撤销</Button
      >
    </div>
  </div>
</template>
