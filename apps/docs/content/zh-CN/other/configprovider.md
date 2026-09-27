---
title: 'ConfigProvider 全局配置'
description: '为组件提供统一的全局化配置。'
type: 'other'
order: 95
icon: 'doc-configprovider'
---

## 使用场景

覆盖配置分为两种场景

- 需要覆盖多个组件公有 Props 配置（例如 `timezone`、`rtl`），使用 `ConfigProvider`
- 当 `ConfigProvider` 暴露参数未能满足，希望修改全局修改某个组件的 某类 Props（例如期望将所有`Button`的 `theme` 都配置为 `solid` 或所有 `Popover`的 `zIndex`），使用 `semiGlobal`

## ConfigProvider

ConfigProvider 通过 Vue provide/inject 实现，因此它能影响 Vue 组件树中的子组件。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/config-provider` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-other-configprovider-1" title="如何引入" kind="import" />

### 基本用法

通过传入 timeZone 参数，用户可以为时间类组件配置时区：

<DemoBlock id="zh-CN-other-configprovider-2" title="基本用法" kind="live" />

### 手动获取值

通常情况下，组件内部会自动获取 ConfigProvider 的值自动消费，无需关心。但是一些特殊场景，你可能需要手动获取值来进行其他操作。

使用 ConfigConsumer 获取 ConfigProvider 的值

<DemoBlock id="zh-CN-other-configprovider-3" title="手动获取值" kind="live" />

### 响应式断点监听

ConfigProvider 支持配置响应式断点，并在断点变化时进行订阅回调。

#### 开启监听与自定义断点

- 通过 `responsiveObserve` 开启断点监听（建议只在确实需要订阅的场景开启）
- 通过 `responsiveMap` 自定义断点（未传入时使用默认断点）

<DemoBlock id="zh-CN-other-configprovider-4" title="开启监听与自定义断点" kind="code" />

#### 订阅 API

`onBreakpoint` 支持两种签名，均会返回取消订阅函数：

- `onBreakpoint((screens) => void)`：回调拿到完整的 screens 映射
- `onBreakpoint(['md', 'lg'], (screen, match) => void)`：只监听指定断点，回调拿到单个断点变化

### RTL/LTR

全局配置 `direction` 可以改变组件的文本方向（1.8.0）。

`rtl` 表示从右到左 (类似希伯来语或阿拉伯语)， `ltr` 表示从左到右 (类似中文、英语等大部分语言)。

特殊组件：

- Modal，Notification，Toast 的命令式调用需要通过 prop 传 `direction`。
- 如果你想对有方向性的 Icon 做 RTL 国际化，需要自己单独进行处理。我们认为对 Icon 进行 RTL 会让它变得难以理解和维护。其他组件内的 icon Semi 已经做了 RTL 适配。
- Table 的树形数据暂不支持 RTL（[Chrome、Safari 浏览器表现与 Firefox 表现不同](https://codesandbox.io/s/table-rtl-treedata-uy7gzl?file=/src/App.jsx)），固定列在 v2.32 版本支持 RTL。

<DemoBlock id="zh-CN-other-configprovider-5" title="RTL/LTR" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/config-provider/types.ts`、`packages/ui/src/config-provider/index.ts` 的公开类型为准。

#### Vue 用法

- ConfigProvider 通过 Vue `provide/inject` 向组件子树提供配置。
- ConfigConsumer 的默认作用域插槽接收 `ConfigContextValue`；`onBreakpoint` 是上下文订阅函数，不是组件事件。
- 默认断点可从 `ConfigProvider.defaultResponsiveMap` 读取；组件默认 props 可通过 `semiGlobal.config.overrideDefaultProps` 覆盖。

#### Vue 插槽

**ConfigProvider**

| 插槽    | 作用域参数 | 说明                   |
| ------- | ---------- | ---------------------- |
| default | {}         | 使用全局配置的组件子树 |

**ConfigConsumer**

| 插槽    | 作用域参数                                                                                                  | 说明             |
| ------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| default | { direction, timeZone, locale, getPopupContainer, responsiveObserve, responsiveMap, onBreakpoint, screens } | 读取当前全局配置 |

| 属性              | 说明                                                                                                                                                                 | 类型                 | 默认值                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------- |
| direction         | 设置文本的方向                                                                                                                                                       | ConfigDirection      | `ltr`                                 |
| timeZone          | [时区标识](#时区标识)                                                                                                                                                | string \| number     | —                                     |
| locale            | 多语言配置，同`LocaleProvider`中`locale`参数的[用法](/zh-CN/other/locale#使用)（如果同时在`ConfigProvider`和`LocaleProvider`中配置`locale`，前者优先级高于后者）     | SemiLocale           | `zh_CN`                               |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                         | () =&gt; HTMLElement | —                                     |
| responsiveObserve | 是否开启响应式断点监听。默认关闭以避免全局注册 `matchMedia` 带来的性能开销；开启后在首次订阅时懒注册监听，无订阅时会自动注销，**&gt;=2.97.0**                        | boolean              | false                                 |
| responsiveMap     | 自定义断点配置，key 为 `xs/sm/md/lg/xl/xxl`，value 为 media query 字符串；未传入时使用默认断点（可通过 `ConfigProvider.defaultResponsiveMap` 获取），**&gt;=2.97.0** | ResponsiveMap        | `ConfigProvider.defaultResponsiveMap` |

### 时区标识

- 数字，例如 `1`、`-9.5`，代表距离 UTC 的时间偏移，单位为小时，可以为负数或小数；
- 字符串，例如`GMT-09:30`、`GMT+08:00`这样的以 `"GMT"` 开头的表征偏移字符串，也可以为 [IANA](https://time.is/time_zones) 标识，如`Asia/Shanghai`、`America/Los_Angeles`等。

当你使用数字或 `GMT-09:00` 类似写法时，Semi 内部会将这些时区标识转换为 IANA 标识。

- 如设置 `-9` 或 `GMT-09:00` 时，会转换成 `Pacific/Gambier`。某些数字对应的 IANA 标识可能有多个，Semi 首选无夏令时的 IANA 标识；

- 如果该数字没有对应的无夏令时 IANA 标识，如 `-3.5`、`3.5`、`10.5`、`13.75`，这时我们映射的就是一个有夏令时的 IANA 标识，有夏令时的时区会在偏移量上进行调整，如 `-3.5` 会在进入夏令时后在标准时间上增加 1h。

如果你想准确设置一个地区的时区，推荐使用 IANA 标识而不是前面的用法。这里可以查看 [IANA 标识列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)，以及时区是否有夏令时。

### FAQ

- ConfigProvider 不提供全局 `prefixCls`。本项目固定保留 `.semi-*` / `--semi-*` 兼容契约；需要隔离时请在业务作用域中覆盖样式。

<DemoBlock id="zh-CN-other-configprovider-6" title="FAQ" kind="code" />

## semiGlobal

除了 ConfigProvider外，你还可以通过 semiGlobal 配置覆盖全局组件的默认 Props。该能力在 v2.59.0后提供

在 `semiGlobal.config.overrideDefaultProps` 可配置组件默认 Props，你需要将你的配置放到整个站点的入口处，即优先于所有 Semi 组件执行。

比如下方配置就是将所有的 Button 默认设置为 warning，Select 的 zIndex 默认设置为 2000 等

<DemoBlock id="zh-CN-other-configprovider-7" title="semiGlobal" kind="code" />
