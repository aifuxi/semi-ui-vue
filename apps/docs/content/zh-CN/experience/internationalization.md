---
title: 'Internationalization 国际化'
description: '全球化设计并非针对于某一市场，而是立足于共同点、找寻差异点，创建一种包容性的设计，以便不同国家地区的不同用户能够理解相同的设计语言，保证界面的基础体验。'
type: 'experience'
order: 8
icon: 'doc-internationalization'
---

## 切换组件语言

组件默认使用简体中文。在应用根节点使用 `LocaleProvider`，将语言对象传给 `locale`。语言包从 `@aifuxi/semi-ui-vue/locale/source/*` 导入，例如 `en_GB` 和 `ja_JP`。运行时切换语言时更新 `locale` 即可。

完整示例、语言列表与自定义文案用法见 [LocaleProvider 多语言](../other/locale)。

## 同时配置语言和阅读方向

需要从右向左阅读时，用 [ConfigProvider 全局配置](../other/configprovider) 同时传入语言对象和 `direction="rtl"`。页面自己的布局、文本和日期格式需要应用一并适配。

```vue
<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import ar from '@aifuxi/semi-ui-vue/locale/source/ar';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
</script>

<template>
  <ConfigProvider :locale="ar" direction="rtl">
    <Pagination :total="100" show-total />
  </ConfigProvider>
</template>
```
