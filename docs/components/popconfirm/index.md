# Popconfirm 气泡确认框

当操作会产生不可逆或高风险结果时，先用 Popconfirm 向用户确认。实现对齐本地 Semi Design v2.102.0，并复用 `Popover` 的 Portal、定位、键盘和焦点能力。

## 基础用法

```vue
<script setup lang="ts">
import { Button, Popconfirm } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/popconfirm.css';

function confirm(): void {
  console.log('confirmed');
}
</script>

<template>
  <Popconfirm title="确定保存此修改？" content="此修改将不可逆" @confirm="confirm">
    <Button>保存</Button>
  </Popconfirm>
</template>
```

## Promise 与加载状态

`confirm`、`cancel` 监听器可以返回 Promise。resolve 后面板关闭；reject 时面板保持打开，对应按钮结束 loading。

```vue
<Popconfirm
  title="删除记录？"
  content="删除后无法恢复"
  :on-confirm="() => removeRecord()"
  ok-type="danger"
>
  <Button type="danger">删除</Button>
</Popconfirm>
```

模板中的 `@confirm="removeRecord"` 与 `:on-confirm="removeRecord"` 都是 Vue 事件监听方式；需要返回 Promise 时不要在模板中使用不返回值的包装表达式。

## 受控显示

```vue
<Popconfirm v-model:visible="visible" trigger="custom" title="继续？" content="请确认操作">
  <Button @click="visible = !visible">切换</Button>
</Popconfirm>
```

## 自定义内容和焦点

```vue
<Popconfirm title="提交备注" :cancel-button-props="{ autoFocus: true }">
  <template #content="{ initialFocusRef }">
    <input :ref="initialFocusRef" placeholder="备注" />
  </template>
  <Button>打开</Button>
</Popconfirm>
```

操作按钮的 `autoFocus` 优先级是 cancel 后 ok；内容 slot 的 `initialFocusRef` 由底层焦点守卫管理。非受控 click 模式关闭后焦点返回 trigger；显式 `visible` 会像 React 基线一样强制使用 custom trigger，不自动恢复 trigger 焦点。

## API

| Prop                                  | 类型                    | 默认值                               | 说明                              |
| ------------------------------------- | ----------------------- | ------------------------------------ | --------------------------------- |
| `visible`                             | `boolean`               | -                                    | 受控显示；支持 `v-model:visible`  |
| `defaultVisible`                      | `boolean`               | `false`                              | 非受控初始显示                    |
| `disabled`                            | `boolean`               | `false`                              | 禁用确认层，直接渲染 trigger      |
| `title` / `content` / `icon`          | `VNodeChild`            | - / - / 警示图标                     | 内容 props；也可使用同名 slots    |
| `okText` / `cancelText`               | `string`                | locale                               | 操作文本                          |
| `okType` / `cancelType`               | `ButtonType`            | `primary` / `tertiary`               | 按钮类型                          |
| `okButtonProps` / `cancelButtonProps` | `PopconfirmButtonProps` | -                                    | 透传按钮配置，支持 `autoFocus`    |
| `showCloseIcon`                       | `boolean`               | `true`                               | 是否显示右上角关闭按钮            |
| `position`                            | `PopoverPosition`       | LTR `bottomLeft` / RTL `bottomRight` | 浮层方向                          |
| `trigger`                             | `PopoverTrigger`        | `click`                              | 触发方式；受控时内部使用 custom   |
| `showArrow`                           | `boolean`               | `false`                              | 是否显示箭头                      |
| `motion`                              | `boolean`               | `true`                               | 是否启用动效                      |
| `getPopupContainer`                   | `() => HTMLElement`     | `document.body`                      | Portal 容器，容器应设置定位上下文 |
| `zIndex`                              | `number`                | `1030`                               | Portal 层级                       |

事件：`confirm(event)`、`cancel(event)`、`visibleChange(visible)`、`update:visible`、`clickOutside(event)`、`escKeydown(event)`。

Slots：默认 slot 为 trigger；`title`、`icon`；`content` 接收 `{ initialFocusRef }`。

## 可访问性

- trigger 使用 `aria-haspopup="dialog"`、`aria-expanded` 和 `aria-controls`。
- Enter/Space 可触发确认框；Escape 可关闭，焦点守卫和非受控 click 模式的焦点恢复沿用 Popover 契约。
- 删除等不可逆动作建议把 `cancelButtonProps.autoFocus` 设为 `true`。

## SSR

服务端只渲染 trigger，不创建 Portal。模块导入和 SSR render 不访问 DOM；hydration 后再按 visible/trigger 创建确认层。
