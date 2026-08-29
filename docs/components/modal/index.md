# Modal 对话框

Modal 用于在当前页面之上承载需要用户确认或补充信息的任务。本实现以本地 Semi Design v2.102.0 为唯一基线，保留 `.semi-modal*`、Portal、焦点、遮罩、动效、RTL 与主题契约。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@workspace/ui';

const visible = ref(false);
</script>

<template>
  <Button @click="visible = true">打开</Button>
  <Modal v-model:visible="visible" title="发布变更" @ok="visible = false">
    确认发布这次变更？
  </Modal>
</template>
```

`#title`、`#header`、`#body`、默认 slot、`#footer`、`#icon`、`#closeIcon` 均可替代对应内容 prop。显式传入 `footer=null` 可移除默认按钮区。

## Promise 与命令式调用

`onOk` / `onCancel` 返回 Promise 时，默认 footer 会在 Promise pending 期间显示 loading；命令式 confirm 只在 resolve 后关闭，reject 时保持打开。

```ts
import { Modal } from '@workspace/ui';

const handle = Modal.confirm({
  title: '删除项目',
  content: '此操作不可恢复。',
  onOk: async () => save(),
});

handle.update({ content: '正在检查依赖…' });
// handle.destroy();
```

在 ConfigProvider 上下文中使用命令式 API 时，使用 `const [modal, ContextHolder] = Modal.useModal()` 并渲染 `ContextHolder`。

## API

| 属性                                                                  | 类型                                             | 默认值          | 说明                             |
| --------------------------------------------------------------------- | ------------------------------------------------ | --------------- | -------------------------------- |
| `visible`                                                             | `boolean`                                        | `false`         | 显示状态，支持 `v-model:visible` |
| `title` / `header` / `footer` / `content`                             | `VNodeChild`                                     | -               | 内容区；均有对应 slot            |
| `closable` / `closeOnEsc` / `mask` / `maskClosable` / `hasCancel`     | `boolean`                                        | `true`          | 关闭、遮罩与默认 footer 行为     |
| `centered` / `fullScreen` / `maskFixed` / `keepDOM` / `preventScroll` | `boolean`                                        | `false`         | 布局、保留 DOM 与滚动控制        |
| `lazyRender` / `motion`                                               | `boolean`                                        | `true`          | 首次懒渲染与动效                 |
| `size`                                                                | `'small' \| 'medium' \| 'large' \| 'full-width'` | `'small'`       | 预设尺寸                         |
| `width` / `height`                                                    | `string \| number`                               | -               | 自定义尺寸                       |
| `okText` / `cancelText`                                               | `string`                                         | Locale          | 按钮文案                         |
| `okType`                                                              | `ButtonType`                                     | `'primary'`     | 确认按钮类型                     |
| `confirmLoading` / `cancelLoading`                                    | `boolean`                                        | `false`         | 显式按钮 loading                 |
| `getPopupContainer`                                                   | `() => HTMLElement`                              | `document.body` | Portal 容器                      |
| `zIndex`                                                              | `number`                                         | `1000`          | Portal 层级                      |
| `modalRender`                                                         | `(dialog) => VNodeChild`                         | -               | 包裹对话框 VNode                 |

事件：`update:visible`、`onOk`、`onCancel`、`afterClose` / `onAfterClose`。静态方法：`confirm`、`info`、`success`、`warning`、`error`、`destroyAll`、`useModal`。

## 无障碍、Portal 与 SSR

对话框保持 `role="dialog"`、`aria-modal`、标题/正文关联；打开后建立焦点陷阱并在关闭后恢复原焦点。ESC、遮罩点击和卸载均清理 document 监听。公共入口 SSR-safe，Teleport 仅在客户端挂载后解析容器并已覆盖 hydration。

完整源码证据、默认值、事件顺序和视觉矩阵见 [对齐矩阵](./alignment.md)。
