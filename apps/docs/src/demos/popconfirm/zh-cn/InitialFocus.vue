<script setup lang="ts">
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>
<template>
  <Space
    ><Popconfirm
      title="确定是否要保存此修改？"
      content="此修改将不可逆"
      :ok-button-props="{ autoFocus: true, type: 'danger' }"
      ><Button>确认聚焦</Button></Popconfirm
    ><Popconfirm
      title="确定是否要保存此修改？"
      content="此修改将不可逆"
      :cancel-button-props="{ autoFocus: true }"
      ><Button>取消聚焦</Button></Popconfirm
    ><Popconfirm title="确定是否要保存此修改？"
      ><template #content="{ initialFocusRef }"
        ><input :ref="initialFocusRef" placeholder="focus here" /></template
      ><Button>内容聚焦</Button></Popconfirm
    ></Space
  >
</template>
