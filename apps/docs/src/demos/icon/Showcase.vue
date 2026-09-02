<script setup lang="ts">
import {
  IconAIFilledLevel2,
  IconAIWandLevel3,
  IconEmoji,
  IconHome,
  IconLikeHeart,
  IconSpin,
} from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon.css';
</script>

<template>
  <ul aria-label="Icon variants">
    <li><IconHome size="small" aria-label="Home" /> small</li>
    <li><IconEmoji :rotate="180" aria-label="Rotated emoji" /> rotate</li>
    <li><IconSpin spin aria-label="Loading" /> spin</li>
    <li><IconLikeHeart size="extra-large" aria-label="Favorite" /> color</li>
    <li><IconAIFilledLevel2 fill="#15c39a" size="extra-large" aria-label="AI" /> bicolor</li>
    <li>
      <IconAIWandLevel3
        :fill="['#f93920', '#15c39a', '#0064fa', '#ffb219']"
        size="extra-large"
        aria-label="AI wand"
      />
      multicolor
    </li>
  </ul>
</template>
