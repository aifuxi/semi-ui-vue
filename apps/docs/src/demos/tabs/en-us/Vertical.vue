<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { RadioGroup, Radio } from '@aifuxi/semi-ui-vue/radio';
import IconFile from '@aifuxi/semi-icons-vue/icons/IconFile';
import IconGlobe from '@aifuxi/semi-icons-vue/icons/IconGlobe';
import IconHelpCircle from '@aifuxi/semi-icons-vue/icons/IconHelpCircle';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/radio.css';
const type = shallowRef<'line' | 'card' | 'button'>('line');
</script>

<template>
  <RadioGroup
    v-model="type"
    type="button"
    :style="{ display: 'flex', width: '200px', justifyContent: 'center' }"
    ><Radio value="line">Line</Radio><Radio value="card">Card</Radio
    ><Radio value="button">Button</Radio></RadioGroup
  ><br /><br /><Tabs tab-position="left" :type="type">
    <TabPane item-key="1"
      ><template #tab
        ><span>
          <IconFile />
          Document
        </span></template
      >
      <div :style="{ padding: '0 24px' }">Document</div>
    </TabPane>
    <TabPane item-key="2"
      ><template #tab
        ><span>
          <IconGlobe />
          Quick Start
        </span></template
      >
      <div :style="{ padding: '0 24px' }">Quick Start</div>
    </TabPane>
    <TabPane item-key="3"
      ><template #tab
        ><span>
          <IconHelpCircle />
          Help
        </span></template
      >
      <div :style="{ padding: '0 24px' }">Help</div>
    </TabPane>
  </Tabs>
</template>
