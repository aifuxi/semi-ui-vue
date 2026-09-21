<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
  IllustrationFailure,
  IllustrationFailureDark,
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationNoAccess,
  IllustrationNoAccessDark,
  IllustrationNoContent,
  IllustrationNoContentDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
  IllustrationNotFound,
  IllustrationNotFoundDark,
  IllustrationSuccess,
  IllustrationSuccessDark,
} from '@aifuxi/semi-illustrations-vue';
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <Empty description="创建成功" style="padding: 30px">
      <template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationSuccessDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="加载失败" style="padding: 30px">
      <template #image><IllustrationFailure style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationFailureDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="没有权限" style="padding: 30px">
      <template #image><IllustrationNoAccess style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoAccessDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="暂无内容，请添加" style="padding: 30px">
      <template #image><IllustrationNoContent style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoContentDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="页面404" style="padding: 30px">
      <template #image><IllustrationNotFound style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNotFoundDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="搜索无结果" style="padding: 30px">
      <template #image><IllustrationNoResult style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoResultDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="建设中" style="padding: 30px">
      <template #image><IllustrationConstruction style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationConstructionDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="神游四方" style="padding: 30px">
      <template #image><IllustrationIdle style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationIdleDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
  </div>
</template>
