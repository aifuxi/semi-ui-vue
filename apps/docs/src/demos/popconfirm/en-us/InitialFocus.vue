<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Space
      ><Popconfirm
        title="Are you sure you want to save this edit?"
        content="This modification will be irreversible"
        :ok-button-props="{ autoFocus: true, type: 'danger' }"
        ><Button>Confirm focus</Button></Popconfirm
      ><Popconfirm
        title="Are you sure you want to save this edit?"
        content="This modification will be irreversible"
        :cancel-button-props="{ autoFocus: true }"
        ><Button>Cancel focus</Button></Popconfirm
      ><Popconfirm title="Are you sure you want to save this edit?"
        ><template #content="{ initialFocusRef }"
          ><input :ref="initialFocusRef" placeholder="focus here" /></template
        ><Button>Content focus</Button></Popconfirm
      ></Space
    ></ConfigProvider
  >
</template>
