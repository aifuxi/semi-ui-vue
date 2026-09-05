<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      有问题的超长文本发生截断时可按需进行自定义配置
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div><span class="semi-tooltip-content">架构|Semi-inf|graph.cheet.relation</span></div>
        </div></template
      > </Text
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      覆盖类名超长文本发生截断时可使用类名覆盖进行自定义配置
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div class="wrapping-tooltip">
            <span class="semi-tooltip-content">架构|Semi-inf|graph.cheet.relation</span>
          </div>
        </div></template
      > </Text
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      覆盖 style 超长文本发生截断时可使用 style 进行自定义配置
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div style="word-break: break-all">
            <span class="semi-tooltip-content">架构|Semi-inf|graph.cheet.relation</span>
          </div>
        </div></template
      > </Text
    ><br />
  </div>
</template>

<style scoped>
.wrapping-tooltip {
  word-break: break-word;
}
</style>
