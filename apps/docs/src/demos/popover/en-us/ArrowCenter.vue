<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
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
  <ConfigProvider :locale="enUS"
    ><div :style="{ paddingLeft: '40px' }" class="tag-margin-right">
      <div :style="{ marginLeft: '40px', whiteSpace: 'nowrap' }">
        <template v-for="(pos, index) in tops" :key="index"
          ><Popover show-arrow arrow-point-at-center :position="pos[0]">
            <Tag>{{ pos[1] }}</Tag>
            <template #content
              ><article>
                Hi ByteDancer, this is a popover.
                <br />
                We have 2 lines.
              </article></template
            ></Popover
          ></template
        >
      </div>
      <div :style="{ width: '40px', float: 'left' }">
        <template v-for="(pos, index) in lefts" :key="index"
          ><Popover show-arrow arrow-point-at-center :position="pos[0]">
            <Tag>{{ pos[1] }}</Tag>
            <template #content
              ><article>
                Hi ByteDancer, this is a popover.
                <br />
                We have 2 lines.
              </article></template
            ></Popover
          ></template
        >
      </div>
      <div :style="{ width: '40px', marginLeft: '180px' }">
        <template v-for="(pos, index) in rights" :key="index"
          ><Popover show-arrow arrow-point-at-center :position="pos[0]">
            <Tag>{{ pos[1] }}</Tag>
            <template #content
              ><article>
                Hi ByteDancer, this is a popover.
                <br />
                We have 2 lines.
              </article></template
            ></Popover
          ></template
        >
      </div>
      <div :style="{ marginLeft: '40px', clear: 'both', whiteSpace: 'nowrap' }">
        <template v-for="(pos, index) in bottoms" :key="index"
          ><Popover show-arrow arrow-point-at-center :position="pos[0]">
            <Tag>{{ pos[1] }}</Tag>
            <template #content
              ><article>
                Hi ByteDancer, this is a popover.
                <br />
                We have 2 lines.
              </article></template
            ></Popover
          ></template
        >
      </div>
    </div></ConfigProvider
  >
</template>

<style scoped>
.tag-margin-right :deep(.semi-tag) {
  margin-right: 8px;
}
</style>
