---
title: '国际化'
englishTitle: 'Internationalization'
description: '使用 LocaleProvider 配置组件语言。'
slug: 'internationalization'
locale: 'zh-CN'
category: 'experience'
order: 1
upstream: 'experience/internationalization'
---

## 语言配置

```vue
<script setup lang="ts">
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import zhCN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>
<template>
  <LocaleProvider :locale="zhCN"><Pagination :total="100" /></LocaleProvider>
</template>
```

全部 57 个语言源通过公开子路径导出。应用业务文本仍由应用自己的国际化方案维护。

## 嵌套与切换

LocaleProvider 的实例彼此隔离。嵌套 provider 可为局部组件提供不同语言；切换 locale prop 会更新上下文消费者。ConfigProvider 与 LocaleProvider 的优先级详见 [LocaleProvider](../../components/locale/)。

## 日期与时区

语言与时区属于不同配置。日期选择和格式化场景需要同时确认 locale、输入格式和时区，不应仅切换界面语言就改变存储数据。

## RTL

方向敏感组件需要同时核对排列、键盘方向、图标和浮层定位。相关配置与限制参见 [ConfigProvider](../../components/config-provider/)。
