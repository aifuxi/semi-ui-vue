---
title: '全局配置'
description: '为组件提供统一的全局化配置。'
locale: 'zh-CN'
slug: 'config-provider'
category: 'other'
order: 95
englishTitle: 'ConfigProvider'
icon: 'doc-configprovider'
upstream: 'other/configprovider'
---

## 使用场景

ConfigProvider 为组件子树统一配置方向、语言、时区、弹层容器和响应式断点。它使用 Vue provide/inject，并保持 Provider 实例隔离。覆盖多个组件公有配置时使用 ConfigProvider；修改整个站点的组件默认 props 时使用 semiGlobal。

## ConfigProvider

### 如何引入

```ts
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
```

### 基本用法

选择 GMT 时区后，日期和时间组件消费同一个 timeZone；初始时间戳固定为 1581599305265。

::demo-block{demo="config-provider/zh-cn/TimeZone" title="时区配置"}
::

### 手动获取值

ConfigConsumer 的默认 scoped slot 接收当前配置；通常由组件自动消费，只在需要手动读取时使用。

::demo-block{demo="config-provider/zh-cn/Consumer" title="手动获取配置"}
::

### 响应式断点监听

`responsiveObserve` 默认 false，开启后首次订阅才注册 matchMedia。`onBreakpoint` 和 `screens` 是 Consumer 提供的值，不是 Provider props。订阅回调立即执行一次，最后一个订阅取消后清理监听。保持 responsiveMap 引用稳定，避免重复注册。

#### 开启监听与自定义断点

```vue
<script setup lang="ts">
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';
import BreakpointSubscriber from './BreakpointSubscriber.vue';
const responsiveMap = ConfigProvider.defaultResponsiveMap;
</script>
<template>
  <ConfigProvider responsive-observe :responsive-map="responsiveMap">
    <ConfigConsumer v-slot="context">
      <BreakpointSubscriber :context="context" />
    </ConfigConsumer>
  </ConfigProvider>
</template>
```

`BreakpointSubscriber.vue` 在客户端订阅，并在卸载前取消；SSR 不访问 window。

```vue
<script setup lang="ts">
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';
import type { ConfigContextValue } from '@aifuxi/semi-ui-vue/config-provider';
const props = defineProps<{ context: ConfigContextValue }>();
const screens = shallowRef(props.context.screens);
let unsubscribe: (() => void) | undefined;
onMounted(() => {
  unsubscribe = props.context.onBreakpoint((next) => {
    screens.value = next;
  });
});
onBeforeUnmount(() => unsubscribe?.());
</script>
<template>
  <span>{{ JSON.stringify(screens) }}</span>
</template>
```

#### 订阅 API

- `onBreakpoint(callback)`：立即收到完整 screens 映射，之后收到断点更新。
- `onBreakpoint(['md', 'lg'], callback)`：按指定顺序立即收到 `(screen, match)`，之后只通知这些断点。

两者都返回取消函数。默认断点是 xs ≤575px、sm ≥576px、md ≥768px、lg ≥992px、xl ≥1200px、xxl ≥1600px。

### RTL/LTR

`direction="rtl"` 添加 `.semi-rtl` 包装；ltr 不新增包装。下例保留上游输入、导航、展示、反馈组合，可切换两个方向。命令式 Modal、Notification、Toast 必须显式传 direction；独立方向性 Icon 由使用方决定是否翻转。固定上游文档注明 Table 树形数据不支持 RTL，固定列从 2.32 支持。

::demo-block{demo="config-provider/zh-cn/Direction" title="RTL/LTR 组件展示"}
::

## API 参考

| 属性              | 类型                | 默认值与说明                                                                   |
| ----------------- | ------------------- | ------------------------------------------------------------------------------ |
| direction         | `'ltr' \| 'rtl'`    | `'ltr'`                                                                        |
| locale            | `SemiLocale`        | 完整固定 zh-CN；优先于 LocaleProvider                                          |
| timeZone          | `string \| number`  | 未设置；由时间类组件消费                                                       |
| getPopupContainer | `() => HTMLElement` | Provider 不指定；浮层通常回退 document.body。自定义容器设置 position: relative |
| responsiveObserve | `boolean`           | false；按需注册监听                                                            |
| responsiveMap     | `ResponsiveMap`     | 固定六断点；可用 ConfigProvider.defaultResponsiveMap 获取                      |

ConfigConsumer 的默认 slot 接收 ConfigContextValue。配置值只读，更新通过 Provider props 完成。

### 时区标识

数字以小时表示 UTC 偏移，可为负数或小数；字符串支持 GMT 偏移和 IANA 名称（如 Asia/Shanghai）。内部将数字或 GMT 偏移映射为 IANA，优先无夏令时区域；-3.5、3.5、10.5、13.75 等可能映射到带夏令时区域。准确指定地区时推荐 IANA 名称。

### FAQ

ConfigProvider 不提供全局 prefixCls。上游 React 的 SemiWebpackPlugin 前缀替换不适用于本项目；首版保留 `.semi-*` 和 `--semi-*` 样式契约。

## semiGlobal

`semiGlobal.config.overrideDefaultProps` 是进程级单例，必须在组件创建前配置；不应在 SSR 请求中用它保存用户配置。局部覆盖使用包装组件和显式 props。

```ts
import { semiGlobal } from '@aifuxi/semi-ui-vue/config-provider';
semiGlobal.config.overrideDefaultProps = {
  Select: { zIndex: 2000 },
  Tooltip: { zIndex: 2001, trigger: 'click' },
};
```

## React → Vue

| React                          | Vue                                                     |
| ------------------------------ | ------------------------------------------------------- |
| Context.Provider / children    | ConfigProvider / 默认 slot                              |
| ConfigConsumer render function | `v-slot="context"`                                      |
| useState / onSelect            | shallowRef / `@select`；公开 v-model 按消费组件契约使用 |
| useEffect 订阅并返回 cleanup   | onMounted 订阅，onBeforeUnmount 清理                    |
| JSX icon / suffix              | 命名 slot；数据 API 中的 VNode 用 h()                   |
| className / ref                | class / 模板 ref 放在子树容器，非 Provider 配置         |

三个 live 示例来自固定 v2.102.0；响应式章节是上游非 live 示例，不重复计入映射。源码、编辑器和运行示例使用同一 SFC。是否完成严格验收以覆盖账本的有效证据为准。
