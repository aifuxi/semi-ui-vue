<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconForm } from '@aifuxi/semi-icons-lab-vue';
import { IconTree } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav :body-style="{ height: '300px' }" :default-open-keys="['user', 'union']">
      <Nav.Header :text="'组件运营后台'">
        <template #logo>
          <IconApps :style="{ height: '36px', fontSize: '36px' }"></IconApps>
        </template>
      </Nav.Header>
      <Nav.Item :item-key="'union'" :text="'活动管理'">
        <template #icon><IconForm></IconForm></template>
      </Nav.Item>
      <Nav.Sub :item-key="'user'" text="用户管理">
        <Nav.Item :item-key="'active'" :text="'活跃用户'"></Nav.Item>
        <Nav.Item :item-key="'negative'" :text="'非活跃用户'"></Nav.Item>
        <template #icon><IconBadge></IconBadge></template>
      </Nav.Sub>
      <Nav.Sub :item-key="'union-management'" text="任务管理">
        <Nav.Item :item-key="'notice'" :text="'任务设置'"></Nav.Item>
        <Nav.Item :item-key="'query'" :text="'任务查询'"></Nav.Item>
        <Nav.Item :item-key="'info'" :text="'信息录入'"></Nav.Item>
        <template #icon><IconTree></IconTree></template>
      </Nav.Sub>
      <Nav.Footer :collapse-button="true"></Nav.Footer>
    </Nav>
  </LocaleProvider>
</template>
