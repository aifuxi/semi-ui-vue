---
title: '快捷键'
description: '用于方便用户自定义快捷键及相关操作'
locale: 'zh-CN'
slug: 'hot-keys'
category: 'plus'
order: 33
englishTitle: 'HotKeys'
icon: 'doc-configprovider'
upstream: 'plus/hotkeys'
---

HotKeys 用固定 Semi Design v2.102.0 的组合键状态机监听键盘事件，同时渲染一致的
快捷键提示。组合中必须恰好有一个普通键，并可搭配 Meta、Shift、Alt、Control。

```ts
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
```

## 代码演示

### 基本用法

按 Control+Shift+A 打开弹窗，默认监听 document.body。未配置的修饰键必须释放。

::demo-block{demo="hot-keys/zh-CN/Basic" title="基本用法"}
::

### 自定义内容

content 只替换显示为 Ctrl、Shift、B，不改变实际监听的 Control+Shift+B。

::demo-block{demo="hot-keys/zh-CN/Content" title="自定义内容"}
::

### 自定义渲染

默认 slot 替代 React render，通过 Tag 显示 Control+R 的提示。保留上游未阻止默认行为的设置；浏览器可能同时执行自己的快捷键。

::demo-block{demo="hot-keys/zh-CN/Render" title="自定义渲染"}
::

### 阻止默认事件

分别声明 Meta+S 与 Control+S 并设置 preventDefault。

::demo-block{demo="hot-keys/zh-CN/PreventDefault" title="阻止默认事件"}
::

### 修改监听挂载 DOM

Input 组件通过公开 input 属性提供真实 DOM；输入框获得焦点后按 Control+Q，焦点在外部时不触发。

::demo-block{demo="hot-keys/zh-CN/ListenerTarget" title="修改监听挂载 DOM"}
::

## 基础用法

普通键按 `KeyboardEvent.code` 匹配，因此字母大小写不影响组合。未声明的修饰键也必须
处于未按下状态，例如配置 Control+S 时，Control+Shift+S 不会触发。

## 自定义监听目标

缺省监听 `document.body`。目标只在挂载时确定；运行中改变 getter 不会重绑，与固定
v2.102.0 Adapter 一致。组件卸载时会从实际注册目标清理监听。

## 自定义显示

默认 slot 是 React `render` prop 的 Vue 原生映射；使用 slot 后不再生成键帽结构，
但保留 `.semi-hotKeys` 根容器。

```vue
<HotKeys :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.K]">
  <strong>打开命令面板</strong>
</HotKeys>
```

## API

| 属性                  | 说明                                           | 类型                                     | 默认值          |
| --------------------- | ---------------------------------------------- | ---------------------------------------- | --------------- |
| `hotKeys`             | 合法组合键；恰好一个普通键                     | `HotKeysKey[]`                           | 必填            |
| `content`             | 覆盖键帽显示文本，不改变实际组合               | `string[]`                               | `hotKeys`       |
| `getListenerTarget`   | 返回 keydown 监听目标                          | `() => HTMLElement \| null \| undefined` | `document.body` |
| `preventDefault`      | 命中时阻止默认行为                             | `boolean`                                | `false`         |
| `mergeMetaCtrl`       | v2.102.0 兼容 prop；固定 Foundation 中为 no-op | `boolean`                                | `false`         |
| `class` / `className` | 根 class                                       | `HTMLAttributes['class']`                | -               |
| `style`               | 根内联样式                                     | `StyleValue`                             | -               |

事件：`hotKey(event: KeyboardEvent)`、`click(event: MouseEvent)`。默认 slot 覆盖键帽
显示。组件不自动获得焦点或 ARIA role；可按业务语义透传 `role`、`aria-*`、`data-*`。

完整事件顺序、SSR、暗色、RTL 与 accepted deviation 见[对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/hot-keys/alignment.md)，
React 迁移见[迁移说明](#react-vue)。

## React → Vue

| React v2.102.0                              | Vue 3                                         | 说明                                      |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `<HotKeys hotKeys={keys} onHotKey={run} />` | `<HotKeys :hot-keys="keys" @hot-key="run" />` | 组合值、事件 payload 和严格修饰键语义不变 |
| `content={['Ctrl', 'K']}`                   | `:content="['Ctrl', 'K']"`                    | 只改变显示文本                            |
| `render={<Tag>...</Tag>}`                   | 默认 slot                                     | ReactNode 映射为 Vue slot                 |
| `render={() => node}`                       | 默认 slot                                     | slot 只求值一次                           |
| `onClick={run}`                             | `@click="run"`                                | Vue 回调接收原生 `MouseEvent`             |
| `className` / `style`                       | `class` / `style`，也兼容 `className`         | Vue 原生 attrs 可继续透传                 |
| `HotKeys.Keys.Control`                      | `HotKeys.Keys.Control`                        | 静态键表保持同名                          |

`hotKeys` 在上游类型中可选，但固定 Foundation 在 mounted 时要求合法组合；Vue 声明
将它标为必填，以便在编译期表达真实运行时契约。

固定 v2.102.0 Foundation 虽读取 `mergeMetaCtrl`，但没有使用该值。因此即使设为
`true`，Meta 也不会匹配 Control 组合，Vue 版本不擅自引入更新版本语义。

组件默认监听 `document.body`，也可用 `getListenerTarget` 限定到某个 HTMLElement。
它不自动聚焦目标，不增加 role/tabindex；需要可聚焦局部快捷键区时由调用方设置。

## Vue 补充示例

以下示例补充 Vue API 使用方式，不计入上游示例映射。

::demo-block{demo="hot-keys/zh-CN/Example1" title="Example1"}
::

::demo-block{demo="hot-keys/zh-CN/Example2" title="Example2"}
::
