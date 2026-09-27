---
title: 'Steps 步骤'
description: '将复杂任务或存在先后关系的任务分解，使用步骤组件引导用户按规定流程操作，并让其知道其当前的进度'
type: 'navigation'
order: 59
icon: 'doc-steps'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/steps` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-steps-1" title="如何引入" kind="import" />

### 默认步骤条（旧版）

建议使用简易版 steps（新版），旧版后续会逐渐 deprecate

<DemoBlock id="zh-CN-navigation-steps-2" title="默认步骤条（旧版）" kind="live" />

### 简单步骤条（新版）

通过设置 type="basic" 显示为简洁风格步骤条

<DemoBlock id="zh-CN-navigation-steps-3" title="简单步骤条（新版）" kind="live" />

### 导航步骤条

通过设置 type="nav" 显示为导航风格步骤条。导航风格的步骤条有以下特点：

1. 步骤条不支持交互。

2. 适用于步骤间互相关联较小，内容互不影响，且需要突出页面视觉元素时使用。

3. 步骤条的宽度按照内容物撑开。

4. Steps.Step 仅支持title、className、style 属性。

<DemoBlock id="zh-CN-navigation-steps-4" title="导航步骤条" kind="live" />

### 迷你尺寸步骤条

通过设置 size="small" 显示迷你尺寸步骤条

<DemoBlock id="zh-CN-navigation-steps-5" title="迷你尺寸步骤条" kind="live" />

<DemoBlock id="zh-CN-navigation-steps-6" title="迷你尺寸步骤条" kind="live" />

### 处理进度

配合内容及按钮使用，表示一个流程的处理进度

<DemoBlock id="zh-CN-navigation-steps-7" title="处理进度" kind="live" />

### 竖直方向的步骤条

通过设置 `direction`，使用竖直方向的步骤条

<DemoBlock id="zh-CN-navigation-steps-8" title="竖直方向的步骤条" kind="live" />

<DemoBlock id="zh-CN-navigation-steps-9" title="竖直方向的步骤条" kind="live" />

### 指定步骤状态

步骤运行错误，使用 Steps 的 `status` 属性来指定当前步骤的状态。

<DemoBlock id="zh-CN-navigation-steps-10" title="指定步骤状态" kind="live" />

### 自定义图标/状态

通过设置 Steps.Step 的 `icon` 属性，可以启用自定义图标
通过设置 Steps.Step 的 `status` 属性，可以自定义每个 step 的状态

<DemoBlock id="zh-CN-navigation-steps-11" title="自定义图标/状态" kind="live" />

### change 事件

从 1.29.0 版本开始支持 `change` 事件，可以使用它来实现处理进度。事件接收一个 number 类型的参数，该参数等于 initial + current。

<DemoBlock id="zh-CN-navigation-steps-12" title="change 事件" kind="live" />

## Accessibility

### ARIA

- Steps、Step组件支持传入`aria-label`属性，来表示Steps和Step的描述
- Step组件具有 `aria-current` `step` 属性，表示这是步骤条内的一步

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/steps/types.ts`、`packages/ui/src/steps/index.ts` 的公开类型为准。

#### Vue 事件

**Steps**

| 事件   | 参数              | 说明         |
| ------ | ----------------- | ------------ |
| change | [current: number] | 当前步骤变化 |

**Steps.Step**

| 事件    | 参数                   | 说明             |
| ------- | ---------------------- | ---------------- |
| click   | [event: MouseEvent]    | 点击步骤         |
| keyDown | [event: KeyboardEvent] | 步骤触发键盘事件 |

#### Vue 插槽

**Steps**

| 插槽    | 作用域参数 | 说明              |
| ------- | ---------- | ----------------- |
| default | {}         | Steps.Step 子组件 |

**Steps.Step**

| 插槽        | 作用域参数 | 说明     |
| ----------- | ---------- | -------- |
| description | {}         | 步骤描述 |
| icon        | {}         | 步骤图标 |
| title       | {}         | 步骤标题 |

### Steps

整体步骤条。

| 参数      | 说明                                                                          | 类型                    | 默认值     | 版本   |
| --------- | ----------------------------------------------------------------------------- | ----------------------- | ---------- | ------ |
| ariaLabel | —                                                                             | string                  | —          |        |
| class     | —                                                                             | HTMLAttributes['class'] | —          |        |
| className | 类名                                                                          | string                  | —          |        |
| current   | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态 | number                  | 0          |        |
| direction | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向      | StepsDirection          | horizontal |        |
| hasLine   | 步骤条类型为basic时，可控制是否显示连接线                                     | boolean                 | true       | 1.18.0 |
| initial   | 起始序号，从 0 开始记数                                                       | number                  | 0          |        |
| prefixCls | —                                                                             | string                  | —          |        |
| size      | 对于简单步骤条和导航步骤条，可选尺寸尺寸，值为`small`、`default`              | StepsSize               | `default`  | 1.18.0 |
| status    | 指定当前步骤的状态，可选 `wait`、`process`、`finish`、`error`、`warning`      | StepsStatus             | process    |        |
| style     | 样式                                                                          | CSSProperties           | —          |        |
| type      | 步骤条类型，可选 `fill`、`basic`、`nav`                                       | StepsType               | fill       | 1.18.0 |

### Steps.Step

步骤条内的每一个步骤。

| 参数        | 说明                                                                                                                        | 类型                    | 默认值 | 版本 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ | ---- |
| ariaLabel   | 容器aria-label                                                                                                              | string                  | —      |      |
| class       | —                                                                                                                           | HTMLAttributes['class'] | —      |      |
| className   | 类名                                                                                                                        | string                  | —      |      |
| description | 步骤的详情描述，可选                                                                                                        | VNodeChild              | -      |      |
| icon        | 步骤图标的类型，可选                                                                                                        | VNodeChild              | -      |      |
| role        | 容器role                                                                                                                    | HTMLAttributes['role']  | -      |      |
| status      | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait`、`process`、`finish`、`error`、`warning` | StepsStatus             | wait   |      |
| style       | 样式                                                                                                                        | CSSProperties           | —      |      |
| title       | 标题                                                                                                                        | VNodeChild              | -      |      |

## 文案规范

- 步骤标题
- 标题应保持简洁，避免截断和换行；
- 使用句子大小写书写；
- 不要包含标点符号
- 描述
- 为标题补充上下文信息
- 不要以标点符号结尾
