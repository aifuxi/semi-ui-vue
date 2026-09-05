<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { IconInfoCircle, IconMoon } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
function close() {
  visible.value = false;
}
const data = [
  {
    title: 'Boost new feature adoption with Integration',
    content:
      'Sample data is prepared for you to demostrate how Integration may be useful for your team',
  },
  {
    title: 'Introducing Dark Mode',
    content:
      'Sample data is prepared for you to demostrate how Integration may be useful for your team',
  },
  {
    title: 'New List Component',
    content:
      'Sample data is prepared for you to demostrate how Integration may be useful for your team',
  },
];
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div>
      <Button @click="visible = true">Customized Modal</Button
      ><Modal v-model:visible="visible" :header="null" :on-ok="close" :on-cancel="close"
        ><h3 style="text-align: center; font-size: 24px; margin: 40px">Semi Design New Features</h3>
        <List :data-source="data" :split="false"
          ><template #item="{ item, index }"
            ><ListItem
              ><template #header
                ><IconInfoCircle v-if="index !== 1" style="font-size: 48px" /><IconMoon
                  v-else
                  style="font-size: 48px" /></template
              ><template #main
                ><div>
                  <h6 style="margin: 0; font-size: 16px">{{ item.title }}</h6>
                  <p style="margin-top: 4px; color: var(--semi-color-text-1)">
                    {{ item.content }}
                  </p>
                </div></template
              ></ListItem
            ></template
          ></List
        ><template #footer
          ><div style="text-align: center">
            <Button
              type="primary"
              theme="solid"
              style="width: 240px; margin: 4px 50px"
              @click="close"
              >Continue</Button
            ><Button
              type="primary"
              theme="borderless"
              style="width: 240px; margin: 4px 50px"
              @click="close"
              >Learn more features</Button
            >
          </div></template
        ></Modal
      >
    </div></ConfigProvider
  >
</template>
