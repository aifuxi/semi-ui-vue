# ConfigProvider 全局配置

ConfigProvider 为组件子树提供方向、语言、时区、弹层容器与响应式断点配置。Vue 版本保持 Semi Design v2.102.0 的 prop 名和默认值，并使用 provide/inject 建立实例隔离。

## 基本用法

```vue
<script setup lang="ts">
import { ConfigConsumer, ConfigProvider, Text, type SemiLocale } from '@workspace/ui';
import '@workspace/theme-default/config-provider.css';
import '@workspace/theme-default/typography.css';

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

## 响应式订阅

`responsiveObserve` 默认关闭。开启后，只有 Consumer 首次调用 `onBreakpoint` 时才注册监听，取消最后一个订阅会自动清理。

```vue
<ConfigProvider responsive-observe>
  <ConfigConsumer v-slot="context">
    <BreakpointView :context="context" />
  </ConfigConsumer>
</ConfigProvider>
```

在 `BreakpointView` 的 `onMounted` 中调用 `context.onBreakpoint(callback)`，并在 `onBeforeUnmount` 调用返回的取消函数。也可以用 `context.onBreakpoint(['md', 'lg'], callback)` 只接收指定断点变更。

## API

| 属性                | 类型                | 默认值             |
| ------------------- | ------------------- | ------------------ |
| `direction`         | `'ltr' \| 'rtl'`    | `'ltr'`            |
| `locale`            | `SemiLocale`        | zh-CN 当前组件文案 |
| `timeZone`          | `string \| number`  | -                  |
| `getPopupContainer` | `() => HTMLElement` | -                  |
| `responsiveObserve` | `boolean`           | `false`            |
| `responsiveMap`     | `ResponsiveMap`     | 六个固定断点       |

`ConfigConsumer` 的默认 scoped slot 接收 `ConfigContextValue`。`ConfigProvider.defaultResponsiveMap` 暴露固定默认断点。`semiGlobal.config.overrideDefaultProps` 保留全局默认值配置入口，具体组件会按其固定 v2.102.0 支持范围逐个接入。

## React → Vue

| React                                             | Vue                                                        |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `<ConfigProvider>{children}</ConfigProvider>`     | `<ConfigProvider><slot /></ConfigProvider>`                |
| `<ConfigConsumer>{value => ...}</ConfigConsumer>` | `<ConfigConsumer v-slot="value">...</ConfigConsumer>`      |
| `children`                                        | 默认 slot                                                  |
| `className` / React ref                           | Provider 不提供这两个公开配置；把 class/ref 放在子树容器上 |
