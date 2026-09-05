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
          Don't know AppKey?
        </div></template
      ><template #description
        ><div>
          You can contact the corresponding R &amp; D students to confirm whether you have applied
          for an application on
          <Text :link="{ href: 'https://semi.design/' }">the application cloud platform</Text> , and
          fill in the corresponding information.
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="warning" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          Don't know AppKey?
        </div></template
      ><template #description
        ><div>
          You can contact the corresponding R &amp; D students to confirm whether you have applied
          for an application on
          <Text :link="{ href: 'https://semi.design/' }">the application cloud platform</Text> , and
          fill in the corresponding information.
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="danger" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          Don't know AppKey?
        </div></template
      ><template #description
        ><div>
          You can contact the corresponding R &amp; D students to confirm whether you have applied
          for an application on
          <Text :link="{ href: 'https://semi.design/' }">the application cloud platform</Text> , and
          fill in the corresponding information.
        </div></template
      ></Banner
    ><br /><Banner :full-mode="false" type="success" bordered :icon="null" :close-icon="null"
      ><template #title
        ><div style="font-weight: 600; font-size: 14px; line-height: 20px">
          Don't know AppKey?
        </div></template
      ><template #description
        ><div>
          You can contact the corresponding R &amp; D students to confirm whether you have applied
          for an application on
          <Text :link="{ href: 'https://semi.design/' }">the application cloud platform</Text> , and
          fill in the corresponding information.
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
