<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import { Button } from '@aifuxi/semi-ui-vue/button';
import IconChevronLeft from '@aifuxi/semi-icons-vue/icons/IconChevronLeft';
import IconChevronRight from '@aifuxi/semi-icons-vue/icons/IconChevronRight';
import IconMinus from '@aifuxi/semi-icons-vue/icons/IconMinus';
import IconPlus from '@aifuxi/semi-icons-vue/icons/IconPlus';
import IconRealSizeStroked from '@aifuxi/semi-icons-vue/icons/IconRealSizeStroked';
import IconRotate from '@aifuxi/semi-icons-vue/icons/IconRotate';
import IconDownload from '@aifuxi/semi-icons-vue/icons/IconDownload';
import IconWindowAdaptionStroked from '@aifuxi/semi-icons-vue/icons/IconWindowAdaptionStroked';
import '@aifuxi/semi-theme-default/image.css';
import '@aifuxi/semi-theme-default/button.css';
const srcList = ['/demos/photo.svg', '/demos/one.svg', '/demos/two.svg'];
</script>
<template>
  <ImagePreview
    ><template #previewMenu="menu"
      ><div
        style="
          background: grey;
          height: 40px;
          width: 280px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border-radius: 3px;
        "
      >
        <Button type="tertiary" aria-label="Prev" :disabled="menu.disabledPrev" @click="menu.onPrev"
          ><template #icon><IconChevronLeft size="large" /></template></Button
        ><Button
          type="tertiary"
          aria-label="Next"
          :disabled="menu.disabledNext"
          @click="menu.onNext"
          ><template #icon><IconChevronRight size="large" /></template></Button
        ><Button
          type="tertiary"
          aria-label="ZoomOut"
          :disabled="menu.disabledZoomOut"
          @click="menu.onZoomOut"
          ><template #icon><IconMinus size="large" /></template></Button
        ><Button
          type="tertiary"
          aria-label="ZoomIn"
          :disabled="menu.disabledZoomIn"
          @click="menu.onZoomIn"
          ><template #icon><IconPlus size="large" /></template></Button
        ><Button type="tertiary" aria-label="RatioClick" @click="menu.onRatioClick"
          ><template #icon
            ><IconRealSizeStroked
              v-if="menu.ratio === 'adaptation'"
              size="large" /><IconWindowAdaptionStroked v-else size="large" /></template></Button
        ><Button type="tertiary" aria-label="RotateLeft" @click="menu.onRotateLeft"
          ><template #icon><IconRotate size="large" /></template></Button
        ><Button
          type="tertiary"
          aria-label="Download"
          :disabled="menu.disableDownload"
          @click="menu.onDownload"
          ><template #icon><IconDownload size="large" /></template
        ></Button></div></template
    ><Image
      v-for="(src, index) in srcList"
      :key="index"
      :src="src"
      :width="200"
      :alt="`Sample image ${index + 1}`"
      style="margin-right: 5px"
  /></ImagePreview>
</template>
