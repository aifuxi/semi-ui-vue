<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px"
      >有问题的超长文本发生截断时可按需进行自定义配置<template #tooltip
        >架构|Semi-inf|graph.cheet.relation</template
      ></Text
    ><br />
    <Text
      :ellipsis="{ showTooltip: { opts: { className: 'components-typography-demo' } } }"
      style="width: 150px"
      >覆盖类名超长文本发生截断时可使用类名覆盖进行自定义配置<template #tooltip
        >架构|Semi-inf|graph.cheet.relation</template
      ></Text
    ><br />
    <Text
      :ellipsis="{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }"
      style="width: 150px"
      >覆盖style超长文本发生截断时可使用style进行自定义配置<template #tooltip
        >架构|Semi-inf|graph.cheet.relation</template
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
