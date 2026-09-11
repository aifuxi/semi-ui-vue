<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px"
      >Customized configuration can be made on demand when long text is truncated<template #tooltip
        >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</template
      ></Text
    ><br />
    <Text
      :ellipsis="{ showTooltip: { opts: { className: 'components-typography-demo' } } }"
      style="width: 150px"
      >Customized configuration can be made on demand when long text is truncated<template #tooltip
        >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</template
      ></Text
    ><br />
    <Text
      :ellipsis="{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }"
      style="width: 150px"
      >Customized configuration can be made on demand when long text is truncated<template #tooltip
        >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</template
      ></Text
    ><br />
  </div>
</template>

<style scoped>
/* The popup is teleported outside the scoped preview subtree. */
:global(.components-typography-demo) {
  word-break: break-word;
}
</style>
