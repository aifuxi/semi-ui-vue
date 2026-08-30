# ConfigProvider

ConfigProvider supplies direction, locale, time zone, popup container, and responsive breakpoint settings to a component subtree. The Vue API keeps the Semi Design v2.102.0 prop names and defaults while using instance-scoped provide/inject.

## Basic usage

```vue
<script setup lang="ts">
import { ConfigConsumer, ConfigProvider, Text, type SemiLocale } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/typography.css';

const locale: SemiLocale = {
  code: 'en-US',
  Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
};
</script>

<template>
  <ConfigProvider direction="rtl" time-zone="Asia/Shanghai" :locale="locale">
    <Text copyable>Global configuration</Text>
    <ConfigConsumer v-slot="context">
      <pre>{{ context.direction }} / {{ context.timeZone }}</pre>
    </ConfigConsumer>
  </ConfigProvider>
</template>
```

## Responsive subscriptions

`responsiveObserve` is disabled by default. When enabled, media-query listeners are registered lazily on the first `onBreakpoint` subscription and removed after the last subscriber unsubscribes.

Call `context.onBreakpoint(callback)` inside `onMounted` and invoke its returned cleanup function from `onBeforeUnmount`. Use `context.onBreakpoint(['md', 'lg'], callback)` for filtered change notifications.

## API

| Prop                | Type                | Default                          |
| ------------------- | ------------------- | -------------------------------- |
| `direction`         | `'ltr' \| 'rtl'`    | `'ltr'`                          |
| `locale`            | `SemiLocale`        | current zh-CN component messages |
| `timeZone`          | `string \| number`  | -                                |
| `getPopupContainer` | `() => HTMLElement` | -                                |
| `responsiveObserve` | `boolean`           | `false`                          |
| `responsiveMap`     | `ResponsiveMap`     | the six pinned breakpoints       |

The `ConfigConsumer` default scoped slot receives `ConfigContextValue`. `ConfigProvider.defaultResponsiveMap` exposes the pinned defaults. `semiGlobal.config.overrideDefaultProps` remains the global default-prop configuration entry; each component adopts it according to the fixed v2.102.0 support list in its own slice.

## React → Vue

| React                                             | Vue                                                            |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `<ConfigProvider>{children}</ConfigProvider>`     | `<ConfigProvider><slot /></ConfigProvider>`                    |
| `<ConfigConsumer>{value => ...}</ConfigConsumer>` | `<ConfigConsumer v-slot="value">...</ConfigConsumer>`          |
| `children`                                        | default slot                                                   |
| `className` / React ref                           | not ConfigProvider props; place class/ref on a child container |
