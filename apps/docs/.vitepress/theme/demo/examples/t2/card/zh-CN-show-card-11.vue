<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Text, Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import {
  Skeleton,
  SkeletonTitle,
  SkeletonParagraph,
  SkeletonAvatar,
  SkeletonImage,
} from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { shallowRef } from 'vue';
const loading = shallowRef(true);
</script>
<template>
  <Switch @change="(v: boolean) => (loading = !v)" />
  <br />
  <br />
  <Card :style="{ maxWidth: '300px' }">
    <template #title
      ><CardMeta>
        <template #title
          ><Skeleton :style="{ width: '80px' }" :loading="loading">
            <Title :heading="5"> Semi Doc </Title>
            <template #placeholder><SkeletonTitle /></template></Skeleton></template
        ><template #description
          ><Skeleton :style="{ width: '150px', marginTop: '12px' }" :loading="loading">
            <Text> 全面、易用、优质 </Text>
            <template #placeholder><SkeletonParagraph :rows="1" /></template></Skeleton></template
        ><template #avatar
          ><Skeleton :loading="loading">
            <Avatar alt="Card meta img" size="default" src="/demos/photo.svg" />
            <template #placeholder
              ><SkeletonAvatar /></template></Skeleton></template></CardMeta></template
    ><template #headerExtraContent
      ><Skeleton :style="{ width: '50px' }" :loading="loading">
        <Text link> More </Text>
        <template #placeholder><SkeletonParagraph :rows="1" /></template></Skeleton></template
    ><template #cover
      ><Skeleton :style="{ maxWidth: '100%', height: '220px' }" :loading="loading">
        <img alt="example" src="/demos/poster.svg" />
        <template #placeholder><SkeletonImage /></template></Skeleton></template
  ></Card>
</template>
