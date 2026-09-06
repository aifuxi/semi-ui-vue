<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconStar } from '@aifuxi/semi-icons-vue';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconUserGroup } from '@aifuxi/semi-icons-vue';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav :body-style="{ height: '320px' }" :default-open-keys="['user', 'union']">
      <Nav.Header :text="'Live Platform'">
        <template #logo>
          <IconApps :style="{ height: '36px', fontSize: '36px' }"></IconApps>
        </template>
      </Nav.Header>
      <Nav.Item :item-key="'union'" :text="'Union Center'">
        <template #icon><IconStar></IconStar></template>
      </Nav.Item>
      <Nav.Sub :item-key="'user'" text="User Management">
        <Nav.Item :item-key="'golder'" :text="'Gold Master Management'"></Nav.Item>
        <Nav.Item :item-key="'ban'" :text="'User Ban'"></Nav.Item>
        <template #icon><IconUser></IconUser></template>
      </Nav.Sub>
      <Nav.Sub :item-key="'union-management'" text="Union Management">
        <Nav.Item :item-key="'notice'" :text="'Announcement Settings'"></Nav.Item>
        <Nav.Item :item-key="'query'" :text="'Union Query'"></Nav.Item>
        <Nav.Item :item-key="'info'" :text="'Entry Information'"></Nav.Item>
        <template #icon><IconUserGroup></IconUserGroup></template>
      </Nav.Sub>
      <Nav.Footer :collapse-button="true"></Nav.Footer>
    </Nav>
  </LocaleProvider>
</template>
