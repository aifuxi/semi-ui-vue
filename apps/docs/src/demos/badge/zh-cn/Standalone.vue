<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
</script>

<template>
  <div>
    <Badge :count="5" /><br /><br />
    <Badge count="NEW" theme="light" /><br /><br />
    <Badge :count="99" :overflow-count="10" type="danger" /><br /><br />
    <span><Badge dot type="primary" /> 进行中</span><br />
    <span><Badge dot type="tertiary" /> 信息</span><br />
    <span><Badge dot type="success" /> 成功</span><br />
    <span><Badge dot type="warning" /> 提醒</span><br />
    <span><Badge dot type="danger" /> 错误</span>
  </div>
</template>
