<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
const data = [
  { title: 'Title 1', color: 'light-blue' },
  { title: 'Title 2', color: 'grey' },
  { title: 'Title 3', color: 'light-green' },
] as const;
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div style="padding: 12px; border: 1px solid var(--semi-color-border); margin: 12px">
      <List layout="horizontal" :data-source="data"
        ><template #item="{ item }"
          ><ListItem
            ><template #header><Avatar :color="item.color">SE</Avatar></template
            ><template #main
              ><div>
                <span style="color: var(--semi-color-text-0); font-weight: 500">{{
                  item.title
                }}</span>
                <p style="color: var(--semi-color-text-2); margin: 4px 0">
                  Life's but a walking shadow, a poor player, that struts and frets his hour upon
                  the stage, and then is heard no more; it is a tale told by an idiot, full of sound
                  and fury, signifying nothing.
                </p>
              </div></template
            ></ListItem
          ></template
        ></List
      >
    </div></ConfigProvider
  >
</template>
