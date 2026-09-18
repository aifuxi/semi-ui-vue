# Modal 模态框

Modal 对齐 Semi Design v2.102.0，保留 `.semi-modal*` DOM/class、Portal、遮罩、滚动锁定、焦点陷阱、动效与命令式 API 契约。公开入口为 `@aifuxi/semi-ui-vue` 根导出与 `@aifuxi/semi-ui-vue/modal` 子路径，命名导出 `Modal`（含静态方法）与 `useModal`，默认导出同一对象。

## 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from '@aifuxi/semi-ui-vue';

const visible = ref(false);
</script>

<template>
  <Modal v-model:visible="visible" title="标题" @ok="visible = false"> 正文内容 </Modal>
</template>
```

`v-model:visible` 绑定 `visible`；关闭路径（遮罩、ESC、关闭按钮、取消按钮）发出 `update:visible(false)`，`ok`/`cancel` 由调用方决定何时关闭。`onOk`/`onCancel` 返回 Promise 时按钮进入 loading，reject 后保持打开。

## 尺寸、全屏与居中

| 需求       | 写法                                               | 说明                                                    |
| ---------- | -------------------------------------------------- | ------------------------------------------------------- |
| 预设尺寸   | `size="small" / "medium" / "large" / "full-width"` | 缺省 `small`；`small\|medium\|large` 映射固定宽度 class |
| 自定义尺寸 | `:width` / `:height`（数字按 px，字符串原样）      | 写到 `.semi-modal` 外层，不改变内容节点结构             |
| 全屏       | `fullScreen`                                       | 覆盖预设尺寸，输出全屏 class                            |
| 垂直居中   | `centered`                                         | 缺省 `false`，居中时容器使用 flex 居中                  |

## 自定义结构

- `title` / `icon` / `header` / `footer` / `closeIcon` 均有同名 slot；slot 优先，函数/VNode prop 仍可用。
- 未提供任何 header 内容时不渲染空 header；`footer` 显式传 `null` 隐藏默认按钮组，移除后又恢复默认按钮。
- `okText` / `cancelText` 缺省取 LocaleProvider 的 `Modal.ok/cancel`；`okButtonProps` / `cancelButtonProps` 透传给 Button，`okType` 缺省 `primary`，`footerFill` 让按钮等宽填充。
- `hasCancel={false}` 只渲染确认按钮；`cancelLoading` / `confirmLoading` 可单独控制按钮 loading；`closable={false}` 隐藏右上角关闭按钮。

## 命令式 API

```ts
import { Modal } from '@aifuxi/semi-ui-vue';

const handle = Modal.confirm({
  title: '确认删除',
  content: '删除后不可恢复',
  onOk: async () => {
    await remove();
  },
});

handle.update({ title: '已更新' });
handle.destroy();
Modal.destroyAll();
```

`Modal.confirm / info / success / warning / error` 返回 `{ destroy(), update(config) }`；`Modal.useModal()` 返回 `[methods, holder]`，把 `holder` 渲染到组件树内即可让命令式弹窗继承当前 ConfigProvider/Locale 上下文。

## Portal、遮罩与滚动

- `getPopupContainer` 指定挂载容器，缺省 `document.body`；非 body 容器不锁定 body 滚动。
- `mask` / `maskClosable` / `maskFixed` 控制遮罩渲染、点击关闭与固定定位；`maskStyle` 自定义遮罩样式。
- `closeOnEsc` 缺省 `true`；`preventScroll` 传递给聚焦调用；`zIndex` 缺省 `1000`。
- `keepDOM` 保留关闭后的 DOM，`lazyRender` 缺省 `true` 且只在首次可见后渲染内容，`afterClose`/`onAfterClose` 在隐藏终态后触发。

## API

### Modal Props

| Prop                                                             | 类型                                             | 默认值                              |
| ---------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| `visible`                                                        | `boolean`                                        | `false`                             |
| `size`                                                           | `'small' \| 'medium' \| 'large' \| 'full-width'` | `'small'`                           |
| `width` / `height`                                               | `string \| number`                               | -                                   |
| `centered` / `fullScreen`                                        | `boolean`                                        | `false`                             |
| `title` / `icon` / `header` / `footer` / `content` / `closeIcon` | `VNodeChild`                                     | -                                   |
| `closable` / `closeOnEsc`                                        | `boolean`                                        | `true`                              |
| `mask` / `maskClosable` / `maskFixed`                            | `boolean`                                        | `true` / `true` / `false`           |
| `maskStyle` / `bodyStyle` / `modalContentClass`                  | style / class                                    | -                                   |
| `hasCancel` / `footerFill`                                       | `boolean`                                        | `true` / `false`                    |
| `okText` / `cancelText` / `okType`                               | `string` / `string` / `ButtonType`               | Locale / Locale / `'primary'`       |
| `okButtonProps` / `cancelButtonProps`                            | `ButtonProps`                                    | -                                   |
| `confirmLoading` / `cancelLoading`                               | `boolean`                                        | -                                   |
| `motion` / `keepDOM` / `lazyRender` / `preventScroll`            | `boolean`                                        | `true` / `false` / `true` / `false` |
| `getPopupContainer` / `getContainerContext`                      | `() => HTMLElement` / `() => unknown`            | `document.body` / -                 |
| `modalRender`                                                    | `(dialog: VNodeChild) => VNodeChild`             | -                                   |
| `zIndex`                                                         | `number`                                         | `1000`                              |
| `direction`                                                      | `'ltr' \| 'rtl'`                                 | ConfigProvider                      |
| `class` / `className` / `style`                                  | Vue 原生 class/style 与兼容 prop                 | -                                   |
| `onOk` / `onCancel` / `onAfterClose` / `afterClose`              | 回调                                             | -                                   |

### Slots

`default`（正文）、`body`、`title`、`header`、`footer`、`icon`、`closeIcon`。

### Events

`update:visible(visible)`。

### 静态方法与 useModal

| API                                            | 签名                                         | 说明                                                      |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `Modal.confirm`                                | `(config: ModalConfirmProps) => ModalHandle` | 确认弹窗，支持 `type: success/info/warning/error/confirm` |
| `Modal.info` / `success` / `warning` / `error` | `(config) => ModalHandle`                    | 对应确认类型                                              |
| `Modal.destroyAll`                             | `() => void`                                 | 关闭全部命令式弹窗                                        |
| `Modal.useModal`                               | `() => [ModalMethods, Component]`            | 组件内命令式 API，`holder` 继承上下文                     |
| `ModalHandle`                                  | `{ destroy(): void; update(config): void }`  | 单个命令式实例的句柄                                      |

## 可访问性、焦点与键盘

- 对话框保留 `role="dialog"`、`aria-modal="true"`、`aria-labelledby="semi-modal-title"` 与 `aria-describedby="semi-modal-body"`；无标题时不制造不可见的空 header。
- 打开时记录先前 `activeElement`、锁定 body 滚动（仅 body portal）并建立焦点陷阱：优先聚焦 `autofocus` 元素或默认取消按钮，`Tab`/`Shift+Tab` 循环，关闭终态恢复焦点。
- `closeOnEsc={false}` 不创建 ESC 关闭路径；遮罩、关闭按钮与取消按钮分别由 `maskClosable`/`closable`/`hasCancel` 控制。

## 主题、RTL 与 SSR

- class 与 Token 沿用固定 `.semi-modal*`；逐组件样式入口为 `@aifuxi/semi-theme-default/modal.css`。
- 关闭动画为固定 keyframe（mask fade、content zoom）；`motion={false}` 直接进入隐藏终态。
- RTL 由 ConfigProvider 的 `.semi-modal-rtl` 驱动，关闭按钮与内容方向翻转；`direction` prop 可显式覆盖。
- import 与 SSR render 不访问 DOM；Teleport 目标、滚动锁定、焦点陷阱与 Observer 只在客户端创建，卸载全部清理。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、视觉与发布证据见[对齐矩阵](./alignment.md)。
