<script setup lang="ts">
import { defineComponent, type PropType, type VNodeChild } from 'vue';
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import IconInfoCircle from '@aifuxi/semi-icons-vue/icons/IconInfoCircle';
import '@aifuxi/semi-theme-default/image.css';
import '@aifuxi/semi-theme-default/divider.css';
import '@aifuxi/semi-theme-default/tooltip.css';
const srcList = ['/demos/image-abstract.svg', '/demos/image-sky.svg', '/demos/image-greenleaf.svg'];
const MenuNodes = defineComponent({
  props: { nodes: { type: Array as PropType<VNodeChild[]>, required: true } },
  setup(props) {
    return () => props.nodes;
  },
});
</script>
<template>
  <ImagePreview
    ><template #previewMenu="{ menuItems }"
      ><div
        style="
          display: flex;
          background-color: rgba(0, 0, 0, 0.75);
          align-items: center;
          padding: 5px 16px;
          border-radius: 4px;
        "
      >
        <MenuNodes :nodes="menuItems.slice(0, 3)" /><Divider layout="vertical" /><MenuNodes
          :nodes="menuItems.slice(3, 7)"
        /><Divider layout="vertical" /><MenuNodes :nodes="menuItems.slice(7)" /><Divider
          layout="vertical"
        /><Tooltip content="我是一个自定义操作"
          ><IconInfoCircle size="large"
        /></Tooltip></div></template
    ><Image
      v-for="(src, index) in srcList"
      :key="index"
      :src="src"
      :width="200"
      :alt="`lamp${index + 1}`"
  /></ImagePreview>
</template>
