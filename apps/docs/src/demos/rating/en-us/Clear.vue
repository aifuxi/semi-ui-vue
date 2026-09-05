<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
</script>

<template>
  <div>
    <span>Clear when clicking</span><br /><Rating
      :allow-clear="true"
      :default-value="3"
    /><br /><br /><span>Unable to clear when clicking</span><br /><Rating
      :allow-clear="false"
      :default-value="3"
    />
  </div>
</template>
