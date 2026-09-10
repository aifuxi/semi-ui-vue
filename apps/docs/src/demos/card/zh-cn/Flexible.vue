<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>
<template>
  <Card
    :style="{ maxWidth: '340px' }"
    :footer-line="true"
    :footer-style="{ display: 'flex', justifyContent: 'flex-end' }"
  >
    Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统。
    <template #title
      ><CardMeta title="Semi Doc" description="全面、易用、优质">
        <template #avatar
          ><Avatar
            alt="Card meta img"
            size="default"
            src="/demos/photo.svg" /></template></CardMeta></template
    ><template #headerExtraContent><Text link> More </Text></template
    ><template #cover><img alt="example" src="/demos/poster.svg" /></template
    ><template #footer
      ><Space>
        <Button theme="borderless" type="primary"> 精选案例</Button>
        <Button theme="solid" type="primary"> 开始使用</Button>
      </Space></template
    ></Card
  >
</template>
