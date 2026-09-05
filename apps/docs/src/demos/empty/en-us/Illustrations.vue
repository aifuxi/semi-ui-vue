<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import IllustrationSuccess from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccess';
import IllustrationSuccessDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccessDark';
import IllustrationFailure from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationFailure';
import IllustrationFailureDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationFailureDark';
import IllustrationNoAccess from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoAccess';
import IllustrationNoAccessDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoAccessDark';
import IllustrationNoContent from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContent';
import IllustrationNoContentDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContentDark';
import IllustrationNotFound from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNotFound';
import IllustrationNotFoundDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNotFoundDark';
import IllustrationNoResult from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoResult';
import IllustrationNoResultDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoResultDark';
import IllustrationConstruction from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationConstruction';
import IllustrationConstructionDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationConstructionDark';
import IllustrationIdle from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationIdle';
import IllustrationIdleDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationIdleDark';
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <Empty description="Created successfully" style="padding: 30px">
      <template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationSuccessDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="Failed to load" style="padding: 30px">
      <template #image><IllustrationFailure style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationFailureDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="Permission denied" style="padding: 30px">
      <template #image><IllustrationNoAccess style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoAccessDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="No content, please add" style="padding: 30px">
      <template #image><IllustrationNoContent style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoContentDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="Page 404" style="padding: 30px">
      <template #image><IllustrationNotFound style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNotFoundDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="No search results" style="padding: 30px">
      <template #image><IllustrationNoResult style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationNoResultDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="under construction" style="padding: 30px">
      <template #image><IllustrationConstruction style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationConstructionDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
    <Empty description="Wandering Quartet" style="padding: 30px">
      <template #image><IllustrationIdle style="width: 150px; height: 150px" /></template>
      <template #darkModeImage
        ><IllustrationIdleDark style="width: 150px; height: 150px"
      /></template>
    </Empty>
  </div>
</template>
