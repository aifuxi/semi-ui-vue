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
          Document
        </span></template
      >
      Document
    </TabPane>
    <TabPane item-key="2"
      ><template #tab
        ><span>
          <IconGlobe />
          Quick Start
        </span></template
      >
      Quick Start
    </TabPane>
    <TabPane item-key="3"
      ><template #tab
        ><span>
          <IconHelpCircle />
          Help
        </span></template
      >
      Help
    </TabPane>
  </Tabs>
</template>
