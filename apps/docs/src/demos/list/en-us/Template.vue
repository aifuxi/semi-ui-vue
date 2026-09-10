<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
const data = [
  "Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.",
  'Come what come may, time and the hour run through the roughest day.',
  "Where shall we three meet again in thunder, lightning, or in rain? When the hurlyburly's done, when the battle's lost and won",
];
</script>

<template>
  <ConfigProvider :locale="enUS"
    ><div style="padding: 12px; border: 1px solid var(--semi-color-border); margin: 12px">
      <List :data-source="data"
        ><template #item="{ item, index }"
          ><ListItem
            ><template #header><Avatar color="blue">SE</Avatar></template
            ><template #main
              ><div>
                <span style="color: var(--semi-color-text-0); font-weight: 500">Example</span>
                <p
                  :style="{
                    color: 'var(--semi-color-text-2)',
                    margin: '4px 0',
                    width: index === 0 ? '420px' : '500px',
                    ...(index === 0
                      ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                      : {}),
                  }"
                >
                  {{ item }}
                </p>
              </div></template
            ><template #extra
              ><ButtonGroup theme="borderless"
                ><Button>Edit</Button><Button>More</Button></ButtonGroup
              ></template
            ></ListItem
          ></template
        ></List
      >
    </div></ConfigProvider
  >
</template>
