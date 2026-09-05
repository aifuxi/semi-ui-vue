<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const tops = [
  ['topLeft', 'TL'],
  ['top', 'Top'],
  ['topRight', 'TR'],
] as const;
const lefts = [
  ['leftTop', 'LT'],
  ['left', 'Left'],
  ['leftBottom', 'LB'],
] as const;
const rights = [
  ['rightTop', 'RT'],
  ['right', 'Right'],
  ['rightBottom', 'RB'],
] as const;
const bottoms = [
  ['bottomLeft', 'BL'],
  ['bottom', 'Bottom'],
  ['bottomRight', 'BR'],
] as const;
</script>
<template>
  <div>
    <div :style="{ marginLeft: '80px', whiteSpace: 'nowrap' }">
      <template v-for="(pos, index) in tops" :key="index"
        ><Tooltip :arrow-point-at-center="false" :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px' }"> {{ pos[1] }}</Tag>
          <template #content
            ><article>
              <p>hi bytedance</p>
              <p>hi bytedance</p>
            </article></template
          ></Tooltip
        ></template
      >
    </div>
    <div :style="{ width: '80px', float: 'left' }">
      <template v-for="(pos, index) in lefts" :key="index"
        ><Tooltip :arrow-point-at-center="false" :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }"> {{ pos[1] }}</Tag>
          <template #content
            ><article>
              <p>hi bytedance</p>
              <p>hi bytedance</p>
            </article></template
          ></Tooltip
        ></template
      >
    </div>
    <div :style="{ width: '40px', marginLeft: '300px' }">
      <template v-for="(pos, index) in rights" :key="index"
        ><Tooltip :arrow-point-at-center="false" :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }"> {{ pos[1] }}</Tag>
          <template #content
            ><article>
              <p>hi bytedance</p>
              <p>hi bytedance</p>
            </article></template
          ></Tooltip
        ></template
      >
    </div>
    <div :style="{ marginLeft: '80px', clear: 'both', whiteSpace: 'nowrap' }">
      <template v-for="(pos, index) in bottoms" :key="index"
        ><Tooltip :arrow-point-at-center="false" :position="pos[0]">
          <Tag :style="{ margin: '8px', padding: '20px', width: '60px' }"> {{ pos[1] }}</Tag>
          <template #content
            ><article>
              <p>hi bytedance</p>
              <p>hi bytedance</p>
            </article></template
          ></Tooltip
        ></template
      >
    </div>
  </div>
</template>
