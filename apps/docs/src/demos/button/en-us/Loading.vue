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
      <div style="display: inline-flex; align-items: center; padding-bottom: 14px">
        <Button style="margin-right: 8px" @click="reset(false)">Stop loading</Button
        ><Button @click="reset(true)">Start loading</Button>
      </div>
    </div>
    <hr />
    <Button :loading="saveLoading" style="margin-right: 14px" @click="saveLoading = true"
      >Save</Button
    ><Button
      :loading="delLoading"
      type="danger"
      style="margin-right: 14px"
      @click="delLoading = true"
      ><template #icon><IconDelete /></template>Delete</Button
    >
    <div style="width: 200px; display: inline-block">
      <Button :loading="repLoading" type="warning" block theme="solid" @click="repLoading = true"
        >Undo</Button
      >
    </div>
  </div>
</template>
