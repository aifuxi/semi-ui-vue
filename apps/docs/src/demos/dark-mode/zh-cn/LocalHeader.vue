<script setup lang="ts">
import { Layout } from '@aifuxi/semi-ui-vue/layout';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { IconApps, IconBell, IconHelpCircle } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/navigation.css';
import '@aifuxi/semi-theme-default/avatar.css';
</script>
<template>
  <Layout.Header :style="{ backgroundColor: 'var(--semi-color-bg-1)' }"
    ><div>
      <Nav mode="horizontal" :default-selected-keys="['Home']">
        <Nav.Header
          ><IconApps :style="{ width: '96px', height: '36px', fontSize: '36px' }"
        /></Nav.Header>
        <span :style="{ color: 'var(--semi-color-text-2)' }"
          ><span
            :style="{ marginRight: '24px', color: 'var(--semi-color-text-0)', fontWeight: '600' }"
            >模版推荐</span
          ><span :style="{ marginRight: '24px' }">所有模版</span><span>我的模版</span></span
        >
        <Nav.Footer>
          <Button
            theme="borderless"
            :style="{ color: 'var(--semi-color-text-2)', marginRight: '12px' }"
            ><template #icon><IconBell size="large" /></template
          ></Button>
          <Button
            theme="borderless"
            :style="{ color: 'var(--semi-color-text-2)', marginRight: '12px' }"
            ><template #icon><IconHelpCircle size="large" /></template
          ></Button>
          <Avatar color="orange" size="small">YJ</Avatar>
        </Nav.Footer></Nav
      >
    </div></Layout.Header
  >
</template>
