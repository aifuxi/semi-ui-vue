<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
import { IconLikeHeart } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Rating style="color: red" :default-value="3"
      ><template #character><IconLikeHeart size="extra-large" /></template></Rating
    ><br /><br />
    <Rating style="color: red" :size="48" allow-half :default-value="3"
      ><template #character><IconLikeHeart style="font-size: 48px" /></template></Rating
    ><br /><br />
    <Rating character="S" :size="18" :default-value="3" /><br /><br /><Rating
      :count="10"
      :default-value="6"
    />
  </div>
</template>
