---
title: 'HotKeys 快捷键'
description: '用于方便用户自定义快捷键及相关操作'
type: 'plus'
order: 33
icon: 'doc-configprovider'
---

## 使用场景

需要向用户表达快捷键组合的使用方式时，使用 Hotkeys 组件可快速渲染出对应的 UI 元素且自动获得事件绑定

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/hot-keys` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

HotKeys 从 2.66.0 开始支持

<DemoBlock id="zh-CN-plus-hotkeys-1" title="如何引入" kind="import" />

### 说明

快捷键仅支持修饰键组合`Shift`,`Control`,`Meta`,`Alt`与其他键的组合。

> [Meta](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/metaKey) 在MacOS中为`Command`，在Windows中为`Win`

当设定快捷键与常用快捷键如`Ctrl/Meta + C`相同时，可以通过设置`preventDefault`控制默认事件是否触发。

### 基本用法

基本使用，通过 `hotKeys` 传入快捷键组合，通过 `@hot-key` 监听快捷键并作出响应。

按下 Ctrl + Shift + A， 唤起modal。默认在 body.document 监听，全局生效。

[hotKeys取值参考](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)，也可以使用`HotKeys.Keys`进行设置

<DemoBlock id="zh-CN-plus-hotkeys-2" title="基本用法" kind="live" />

### 自定义内容

通过`content`传入渲染的字符

<DemoBlock id="zh-CN-plus-hotkeys-3" title="自定义内容" kind="live" />

通过默认插槽传入自定义展示内容

<DemoBlock id="zh-CN-plus-hotkeys-4" title="自定义内容" kind="live" />

### 阻止默认事件

通过设置`preventDefault`控制默认事件是否触发。

<DemoBlock id="zh-CN-plus-hotkeys-5" title="阻止默认事件" kind="live" />

### 修改监听挂载DOM

快捷键默认在 body 监听，通过`getListenerTarget`修改快捷键监听挂载的DOM

<DemoBlock id="zh-CN-plus-hotkeys-6" title="修改监听挂载DOM" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/hot-keys/types.ts`、`packages/ui/src/hot-keys/index.ts` 的公开类型为准。

#### Vue 用法

- 通过 `@hot-key` 监听快捷键，通过 `@click` 监听点击；`getListenerTarget` 是配置监听目标的 prop。
- 快捷键常量可从 `HotKeys.Keys` 或具名导出 `HOT_KEYS` 读取。

#### Vue 事件

**HotKeys**

| 事件   | 参数                   | 说明                     |
| ------ | ---------------------- | ------------------------ |
| click  | [event: MouseEvent]    | 点击快捷键展示内容时触发 |
| hotKey | [event: KeyboardEvent] | 匹配快捷键组合时触发     |

#### Vue 插槽

**HotKeys**

| 插槽    | 作用域参数 | 说明                   |
| ------- | ---------- | ---------------------- |
| default | {}         | 覆盖默认快捷键展示内容 |

### HotKeys

| 属性              | 说明                                           | 类型                                      | 默认值          |
| ----------------- | ---------------------------------------------- | ----------------------------------------- | --------------- |
| hotKeys           | 合法组合键；恰好一个普通键                     | HotKeysKey[]（必填）                      | -               |
| class             | Vue 原生类名                                   | HTMLAttributes['class']                   | —               |
| className         | 类名                                           | HTMLAttributes['class']                   | —               |
| content           | 覆盖键帽显示文本，不改变实际组合               | string[]                                  | `hotKeys`       |
| getListenerTarget | 用于设置监听器挂载的DOM                        | () =&gt; HTMLElement \| null \| undefined | `document.body` |
| mergeMetaCtrl     | v2.102.0 兼容 prop；固定 Foundation 中为 no-op | boolean                                   | false           |
| preventDefault    | 是否阻止快捷键默认行为                         | boolean                                   | false           |
| style             | 样式                                           | StyleValue                                | —               |
