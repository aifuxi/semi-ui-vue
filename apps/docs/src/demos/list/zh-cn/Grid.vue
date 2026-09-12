<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Descriptions, DescriptionsItem } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
const data = [
  {
    title: 'Semi UI',
    rating: 4.5,
    feedbacks: 124,
  },
  {
    title: 'Semi DSM',
    rating: 4,
    feedbacks: 108,
  },
  {
    title: 'Semi D2C',
    rating: 4.5,
    feedbacks: 244,
  },
];
</script>

<template>
  <div>
    <List :grid="{ gutter: 12, span: 6 }" :data-source="data"
      ><template #item="{ item }"
        ><ListItem
          style="
            border: 1px solid var(--semi-color-border);
            background-color: var(--semi-color-bg-2);
            border-radius: 3px;
            padding-left: 20px;
          "
          ><div>
            <h3 style="color: var(--semi-color-text-0); font-weight: 500">{{ item.title }}</h3>
            <Descriptions align="center" size="small" row
              ><DescriptionsItem item-key="满意度"
                ><Rating allow-half size="small" :value="item.rating" /></DescriptionsItem
              ><DescriptionsItem item-key="反馈数">{{
                item.feedbacks
              }}</DescriptionsItem></Descriptions
            >
            <div style="margin: 12px 0; display: flex; justify-content: flex-end">
              <ButtonGroup theme="borderless" style="margin-top: 8px"
                ><Button>编辑</Button><Button>更多</Button></ButtonGroup
              >
            </div>
          </div></ListItem
        ></template
      ></List
    >
  </div>
</template>
