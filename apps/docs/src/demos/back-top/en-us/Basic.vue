<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';

import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconChevronUp } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <span>Scroll down to see the bottom-right gray button.</span
    ><BackTop
      ><Button theme="light" aria-label="Back to top"
        ><template #icon><IconChevronUp /></template></Button
    ></BackTop>
  </div>
</template>
