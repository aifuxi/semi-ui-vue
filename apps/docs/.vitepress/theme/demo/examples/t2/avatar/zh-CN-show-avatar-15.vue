<script setup lang="ts">
import { cloneVNode } from 'vue';
import { Avatar, AvatarGroup } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
</script>

<template>
  <AvatarGroup :max-count="3">
    <Avatar color="red" alt="Lisa LeBlanc">LL</Avatar>
    <Avatar alt="Caroline Xiao">CX</Avatar>
    <Avatar color="amber" alt="Rafal Matin">RM</Avatar>
    <Avatar style="color: #f56a00; background-color: #fde3cf" alt="Zank Lance">ZL</Avatar>
    <Avatar style="background-color: #87d068" alt="Youself Zhang">YZ</Avatar>
    <template #more="{ restNumber, restAvatars }">
      <Popover
        :auto-adjust-overflow="false"
        position="bottomRight"
        style="padding: 12px 8px; padding-bottom: 0"
      >
        <Avatar>+{{ restNumber }}</Avatar>
        <template #content>
          <div v-for="(avatar, index) in restAvatars" :key="index" style="padding-bottom: 12px">
            <component :is="cloneVNode(avatar, { size: 'extra-small' })" />
            <span style="margin-left: 8px; font-size: 14px">这是段文字描述</span>
          </div>
        </template>
      </Popover>
    </template>
  </AvatarGroup>
</template>
