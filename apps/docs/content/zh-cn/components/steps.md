---
title: '步骤'
description: '将复杂任务或存在先后关系的任务分解，使用步骤组件引导用户按规定流程操作，并让其知道其当前的进度'
locale: 'zh-CN'
slug: 'steps'
category: 'navigation'
order: 59
englishTitle: 'Steps'
icon: 'doc-steps'
upstream: 'navigation/steps'
---

## 代码演示

### 如何引入

```ts
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
```

### 默认步骤条（旧版）

建议使用简易版 steps（新版），旧版后续会逐渐 deprecate

::demo-block{demo="steps/zh-cn/Fill" title="默认步骤条（旧版）"}
::

### 简单步骤条（新版）

通过设置 type="basic" 显示为简洁风格步骤条

::demo-block{demo="steps/zh-cn/Basic" title="简单步骤条（新版）"}
::

### 导航步骤条

通过设置 type="nav" 显示为导航风格步骤条。导航风格的步骤条有以下特点：

1. 导航步骤条支持点击与 Enter 激活，并通过 change 回调通知调用方。

2. 适用于步骤间互相关联较小，内容互不影响，且需要突出页面视觉元素时使用。

3. 步骤条的宽度按照内容物撑开。

4. 导航样式只展示 title，不展示 description 和 icon；支持样式、ARIA 与事件。

::demo-block{demo="steps/zh-cn/Navigation" title="导航步骤条"}
::

### 迷你尺寸步骤条

通过设置 size="small" 显示迷你尺寸步骤条

::demo-block{demo="steps/zh-cn/Small" title="迷你尺寸步骤条"}
::

::demo-block{demo="steps/zh-cn/SmallNavigation" title="迷你尺寸步骤条"}
::

### 处理进度

配合内容及按钮使用，表示一个流程的处理进度

::demo-block{demo="steps/zh-cn/Progress" title="处理进度"}
::

### 竖直方向的步骤条

通过设置 `direction`，使用竖直方向的步骤条

::demo-block{demo="steps/zh-cn/VerticalFill" title="竖直方向的步骤条"}
::

::demo-block{demo="steps/zh-cn/VerticalBasic" title="竖直方向的步骤条"}
::

### 指定步骤状态

步骤运行错误，使用 Steps 的 `status` 属性来指定当前步骤的状态。

::demo-block{demo="steps/zh-cn/Status" title="指定步骤状态"}
::

### 自定义图标/状态

通过设置 Steps.Step 的 `icon` 属性，可以启用自定义图标  
通过设置 Steps.Step 的 `status` 属性，可以自定义每个 step 的状态

::demo-block{demo="steps/zh-cn/Icons" title="自定义图标/状态"}
::

### onChange 回调

从 1.29.0 版本开始支持 onChange，可以使用它来实现处理进度。onChange 接收一个 number 类型的参数，该参数等于 initial + current。

::demo-block{demo="steps/zh-cn/Controlled" title="onChange 回调"}
::

## Accessibility

### ARIA

- Steps、Step组件支持传入`aria-label`属性，来表示Steps和Step的描述
- Step组件具有 `aria-current` `step` 属性，表示这是步骤条内的一步

## API 参考

### Steps

整体步骤条。

| 参数      | 说明                                                                          | 类型                    | 默认值     | 版本   |
| --------- | ----------------------------------------------------------------------------- | ----------------------- | ---------- | ------ |
| class     | 类名                                                                          | string                  |            |        |
| current   | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态 | number                  | 0          |        |
| direction | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向      | string                  | horizontal |        |
| hasLine   | 步骤条类型为basic时，可控制是否显示连接线                                     | boolean                 | true       | 1.18.0 |
| initial   | 起始序号，从 0 开始记数                                                       | number                  | 0          |        |
| status    | 指定当前步骤的状态，可选 `wait`、`process`、`finish`、`error`、`warning`      | string                  | process    |        |
| size      | 对于简单步骤条和导航步骤条，可选尺寸尺寸，值为`small`、`default`              | string                  | `default`  | 1.18.0 |
| style     | 样式                                                                          | CSSProperties           |            |        |
| type      | 步骤条类型，可选 `fill`、`basic`、`nav`                                       | string                  | fill       | 1.18.0 |
| @change   | 改变步骤条的回调                                                              | (index: number) => void | -          | 1.29.0 |

### Steps.Step

步骤条内的每一个步骤。

| 参数        | 说明                                                                                                                        | 类型                   | 默认值 | 版本 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ | ---- |
| aria-label  | 容器aria-label                                                                                                              | string                 |        |      |
| class       | 类名                                                                                                                        | string                 |        |      |
| description | 步骤的详情描述，可选                                                                                                        | VNodeChild             | -      |      |
| icon        | 步骤图标的类型，可选                                                                                                        | VNodeChild             | -      |      |
| role        | 容器role                                                                                                                    | HTMLAttributes["role"] | -      |      |
| status      | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait`、`process`、`finish`、`error`、`warning` | string                 | wait   |      |
| style       | 样式                                                                                                                        | CSSProperties          |        |      |
| title       | 标题                                                                                                                        | VNodeChild             | -      |      |
| @click      | 点击回调                                                                                                                    | function               | -      |      |
| @key-down   | 回车事件回调                                                                                                                | function               | -      |      |

## 文案规范

- 步骤标题
  - 标题应保持简洁，避免截断和换行；
  - 使用句子大小写书写；
  - 不要包含标点符号
- 描述
  - 为标题补充上下文信息
  - 不要以标点符号结尾

## 设计变量

::token-table{component="steps"}
::

## React → Vue 迁移

| React                                | Vue                                      |
| ------------------------------------ | ---------------------------------------- |
| `Steps.Step`                         | `Step`，也保留组合成员                   |
| `children`                           | Steps 默认插槽                           |
| title / description / icon ReactNode | 同名插槽或 VNodeChild prop               |
| `onChange(index)`                    | `@change="onChange"`；自行更新 `current` |
| `onClick` / `onKeyDown`              | Step 的 `@click` / `@key-down`           |
| `aria-label`                         | `aria-label`，也支持 ariaLabel prop      |
| `className`                          | 原生 `class`，兼容保留 className         |

Steps 不提供 v-model；使用 current 和 change 管理受控状态。change 的参数为被激活子项下标加 initial。`prefixCls` 默认 `semi-steps`。未显式设置子项 status 时，状态由 current、initial 和整体 status 推导。

固定 v2.102.0 的 navStep 已包含 click 与 Enter 处理，因此导航样式同样会触发 change；本页依据源码修正上游「不支持交互」的陈旧说明。nav 样式不展示 description 或 icon，但保留 title、样式、ARIA 与事件。键盘回调只在 Enter 时触发。各步骤均保留 aria-current=step；请通过 current 和清晰标题表达当前进度。
