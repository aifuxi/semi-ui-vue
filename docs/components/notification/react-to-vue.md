# Notification React → Vue 迁移

| Semi React v2.102.0                                    | Vue 对齐 API                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| `Notification.info(options)`                           | `Notification.info(options)`                                    |
| `Notification.open/success/warning/error`              | 同名静态方法                                                    |
| `Notification.close(id)`                               | 同名静态方法                                                    |
| `Notification.config(options)`                         | 同名静态方法                                                    |
| `Notification.destroyAll()`                            | 同名静态方法                                                    |
| `const [api, holder] = Notification.useNotification()` | 同样的 tuple；holder 是 Vue `Component`                         |
| `ReactNode` title/content/icon                         | Vue `VNodeChild`                                                |
| JSX `<>{holder}</>`                                    | 模板 `<NotificationHolder />` 或 render `h(NotificationHolder)` |
| React context inherited at holder                      | Vue provide/inject context inherited at holder                  |

命令式 API 不转换成 `v-model` 或组件 slots，因为固定公开入口本身就是静态服务。局部 holder 是 ReactElement → Vue Component 的框架原生映射。

```tsx
// React
const [notification, holder] = Notification.useNotification();
return (
  <>
    {holder}
    <Button onClick={() => notification.info(options)}>Show</Button>
  </>
);
```

```vue
<script setup lang="ts">
const [notification, NotificationHolder] = Notification.useNotification();
</script>

<template>
  <NotificationHolder />
  <Button @click="notification.info(options)">Show</Button>
</template>
```

`onCloseClick(id)` 先于 `onClose()`；关闭按钮会阻止卡片 `onClick` 冒泡。调用 `close(id)` 和 `destroyAll()` 是外部移除，不额外触发单条通知的 `onClose`，与固定 Adapter 一致。
