<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { provide } from 'vue';
import { EN_US_TYPOGRAPHY_LOCALE, typographyLocaleKey } from '@aifuxi/semi-ui-vue/typography';
provide(typographyLocaleKey, EN_US_TYPOGRAPHY_LOCALE);
</script>

<template>
  <div>
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      Customized configuration can be made on demand when long text is truncated
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div>
            <span class="semi-tooltip-content"
              >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</span
            >
          </div>
        </div></template
      > </Text
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      Customized configuration can be made on demand when long text is truncated
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div class="wrapping-tooltip">
            <span class="semi-tooltip-content"
              >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</span
            >
          </div>
        </div></template
      > </Text
    ><br />
    <Text :ellipsis="{ showTooltip: true }" style="width: 150px">
      Customized configuration can be made on demand when long text is truncated
      <template #tooltip
        ><div class="semi-tooltip-wrapper semi-tooltip-wrapper-show" role="tooltip">
          <div style="word-break: break-all">
            <span class="semi-tooltip-content"
              >Insfrastructure|Data-inf|bytegraph.cheetah.user_relation</span
            >
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
