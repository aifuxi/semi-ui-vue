<script setup lang="ts">
import { Image, ImagePreview } from '@workspace/ui';

const blueImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100"%3E%3Crect width="160" height="100" rx="12" fill="%230066ff"/%3E%3Ccircle cx="122" cy="28" r="13" fill="%23fff" fill-opacity=".82"/%3E%3Cpath d="M16 84l38-40 25 25 18-17 47 32z" fill="%23d9f0ff"/%3E%3C/svg%3E';
const greenImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100"%3E%3Crect width="160" height="100" rx="12" fill="%2300a870"/%3E%3Ccircle cx="38" cy="30" r="14" fill="%23fff" fill-opacity=".8"/%3E%3Cpath d="M14 84l46-33 29 21 19-14 38 26z" fill="%23d7f5e8"/%3E%3C/svg%3E';
</script>

<template>
  <div class="image-scenario" data-testid="image-vue">
    <section class="image-scenario__cell">
      <span class="image-scenario__label">单图与原生属性</span>
      <Image
        alt="蓝色山景"
        class-name="image-scenario__image"
        data-parity-target="image-basic"
        :height="100"
        :preview="false"
        :src="blueImage"
        :width="160"
      />
    </section>

    <section class="image-scenario__cell image-scenario__cell--wide">
      <span class="image-scenario__label">分组预览与标题</span>
      <ImagePreview :lazy-load="false">
        <Image
          alt="分组蓝色山景"
          class-name="image-scenario__image"
          data-parity-target="image-group-first"
          :height="100"
          :preview="{ previewTitle: '蓝色山景' }"
          :src="blueImage"
          :width="160"
        />
        <Image
          alt="分组绿色山景"
          class-name="image-scenario__image"
          :height="100"
          :preview="{ previewTitle: '绿色山景' }"
          :src="greenImage"
          :width="160"
        />
      </ImagePreview>
    </section>
  </div>
</template>
