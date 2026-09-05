<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/banner.css';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div style="width: 640px" class="components-banner-demo">
    <Banner :full-mode="false" type="info" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          不知道 AppKey？
        </div></template
      ><template #description
        ><div>
          你可先联系对应的研发同学，确认是否已在
          <Text :link="{ href: 'https://semi.design/' }">应用云平台</Text>
          申请了应用，并填写对应的信息。
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="warning" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          不知道 AppKey？
        </div></template
      ><template #description
        ><div>
          你可先联系对应的研发同学，确认是否已在
          <Text :link="{ href: 'https://semi.design/' }">应用云平台</Text>
          申请了应用，并填写对应的信息。
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="danger" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          不知道 AppKey？
        </div></template
      ><template #description
        ><div>
          你可先联系对应的研发同学，确认是否已在
          <Text :link="{ href: 'https://semi.design/' }">应用云平台</Text>
          申请了应用，并填写对应的信息。
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="success" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          不知道 AppKey？
        </div></template
      ><template #description
        ><div>
          你可先联系对应的研发同学，确认是否已在
          <Text :link="{ href: 'https://semi.design/' }">应用云平台</Text>
          申请了应用，并填写对应的信息。
        </div></template
      ></Banner
    >
  </div>
</template>

<style scoped>
.components-banner-demo :deep(.semi-banner-info.semi-banner-bordered) {
  border: 1px solid var(--semi-color-primary-disabled);
}
.components-banner-demo :deep(.semi-banner-warning.semi-banner-bordered) {
  border: 1px solid var(--semi-color-warning-light-active);
}
.components-banner-demo :deep(.semi-banner-danger.semi-banner-bordered) {
  border: 1px solid var(--semi-color-danger-light-active);
}
.components-banner-demo :deep(.semi-banner-success.semi-banner-bordered) {
  border: 1px solid var(--semi-color-success-light-active);
}
</style>
