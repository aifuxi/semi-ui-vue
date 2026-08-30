<script setup lang="ts">
import {
  IconAIFilledLevel2,
  IconAIWandLevel3,
  IconEmoji,
  IconHome,
  IconLikeHeart,
  IconSpin,
} from '@aifuxi/semi-icons-vue';
import { IconAvatar } from '@aifuxi/semi-icons-lab-vue';
import { Icon } from '@aifuxi/semi-ui-vue';

const sizes = ['extra-small', 'small', 'default', 'large', 'extra-large'] as const;
</script>

<template>
  <div class="icon-scenario" data-testid="icon-vue">
    <section class="icon-scenario__section" aria-label="图标尺寸">
      <h3>尺寸</h3>
      <div class="icon-scenario__row">
        <IconHome
          v-for="size in sizes"
          :key="size"
          :size="size"
          :data-parity-target="`icon-size-${size}`"
          :aria-label="`首页图标 ${size}`"
        />
      </div>
    </section>

    <section class="icon-scenario__section" aria-label="旋转与动画">
      <h3>旋转与动画</h3>
      <div class="icon-scenario__row">
        <IconEmoji :rotate="180" data-parity-target="icon-rotate" aria-label="旋转表情" />
        <IconSpin spin data-parity-target="icon-spin" aria-label="加载中" />
      </div>
    </section>

    <section class="icon-scenario__section" aria-label="颜色与图标集">
      <h3>颜色与图标集</h3>
      <div class="icon-scenario__row">
        <IconLikeHeart
          class="icon-scenario__color"
          size="extra-large"
          data-parity-target="icon-color"
          aria-label="喜欢"
        />
        <IconAIFilledLevel2
          :fill="['#15c39a', '#0064fa']"
          size="extra-large"
          data-parity-target="icon-bicolor"
          aria-label="双色 AI"
        />
        <IconAIWandLevel3
          :fill="['#f93920', '#15c39a', '#0064fa', '#ffb219']"
          size="extra-large"
          data-parity-target="icon-multicolor"
          aria-label="多色 AI"
        />
        <IconAvatar size="extra-large" data-parity-target="icon-lab" aria-label="Lab 头像" />
        <Icon type="custom-dot" aria-label="自定义圆点">
          <svg width="1em" height="1em" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="currentColor" />
          </svg>
        </Icon>
      </div>
    </section>
  </div>
</template>
