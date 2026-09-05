---
title: 'Internationalization'
englishTitle: 'Internationalization'
description: 'Configure component language with LocaleProvider.'
slug: 'internationalization'
locale: 'en-US'
category: 'experience'
order: 1
upstream: 'experience/internationalization'
---

## Locale configuration

```vue
<script setup lang="ts">
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>
<template>
  <LocaleProvider :locale="enUS"><Pagination :total="100" /></LocaleProvider>
</template>
```

All 57 locale sources are available through public subpaths. Application business text remains the responsibility of your own localization system.

## Nesting and switching

Provider instances remain isolated. Nested providers can localize a subtree independently, and changing the locale prop updates consumers. See [LocaleProvider](../../components/locale/) for precedence with ConfigProvider.

## Dates and time zones

Language and time zone are separate settings. Verify locale, input formats and time zone together. Changing display language should not silently change stored data.

## RTL

Verify layout, keyboard direction, icons and overlay placement for direction-sensitive components. See [ConfigProvider](../../components/config-provider/).
