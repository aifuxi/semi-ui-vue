<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import IconFile from '@aifuxi/semi-icons-vue/icons/IconFile';
import IconGlobe from '@aifuxi/semi-icons-vue/icons/IconGlobe';
import IconHelpCircle from '@aifuxi/semi-icons-vue/icons/IconHelpCircle';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs>
    <TabPane item-key="1"
      ><template #tab
        ><span>
          <IconFile />
          文档
        </span></template
      >
      文档
    </TabPane>
    <TabPane item-key="2"
      ><template #tab
        ><span>
          <IconGlobe />
          快速起步
        </span></template
      >
      快速起步
    </TabPane>
    <TabPane item-key="3"
      ><template #tab
        ><span>
          <IconHelpCircle />
          帮助
        </span></template
      >
      帮助
    </TabPane>
  </Tabs>
</template>
