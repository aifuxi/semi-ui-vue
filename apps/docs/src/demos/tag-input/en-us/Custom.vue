<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { IconClose } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
import { avatarImages, fallbackAvatar } from '../assets';
const value = shallowRef(['xiakeman']);
const names = ['xiakeman', 'shenyue', 'quchenyi', 'wenjiamao'];
const avatars = new Map(names.map((name, index) => [name, avatarImages[index]]));
</script>

<template>
  <TagInput v-model="value"
    ><template #tag="{ value: tag, close }"
      ><div style="display: flex; align-items: center; font-size: 14px; margin-right: 10px">
        <Avatar alt="avatar" :src="avatars.get(tag) ?? fallbackAvatar" size="extra-small" /><span
          style="margin-left: 8px"
          >{{ `${tag}@semi.com` }}</span
        ><IconClose @click="close" /></div></template
  ></TagInput>
</template>
