<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
</script>

<template>
  <div>
    <span>允许再次点击清除</span><br /><Rating
      :allow-clear="true"
      :default-value="3"
    /><br /><br /><span>禁止再次点击清除</span><br /><Rating
      :allow-clear="false"
      :default-value="3"
    />
  </div>
</template>
