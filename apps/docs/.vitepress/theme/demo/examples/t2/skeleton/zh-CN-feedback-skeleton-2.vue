<script setup lang="ts">
import { shallowRef } from 'vue';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonButton,
} from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const loading = shallowRef(true);
</script>

<template>
  <div>
    <span style="display: flex; align-items: center"
      ><Switch @change="loading = !loading" /><span style="margin-left: 10px"
        >显示加载内容</span
      ></span
    ><br />
    <Skeleton :loading="loading"
      ><template #placeholder><SkeletonAvatar /></template
      ><Avatar color="blue" style="margin-bottom: 10px">U</Avatar></Skeleton
    ><br />
    <Skeleton style="width: 200px; height: 150px" :loading="loading"
      ><template #placeholder><SkeletonImage /></template
      ><img src="/demos/photo.svg" height="150" alt="avatar" /></Skeleton
    ><br />
    <Skeleton style="width: 80px" :loading="loading"
      ><template #placeholder><SkeletonTitle style="margin-bottom: 10px" /></template>
      <h4 style="margin-bottom: 0">Semi UI</h4></Skeleton
    >
    <Skeleton style="width: 240px" :loading="loading"
      ><template #placeholder><SkeletonParagraph :rows="2" /></template>
      <p style="width: 240px">
        精心打磨每一个组件的用户体验，从用户的角度考虑每个组件的使用场景。
      </p></Skeleton
    ><br />
    <Skeleton :loading="loading"
      ><template #placeholder><SkeletonButton /></template><Button>Button</Button></Skeleton
    >
  </div>
</template>
