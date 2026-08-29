# Toast 提示

Toast 用于在操作后给出短暂、及时的结果反馈。Vue 版本以 Semi Design v2.102.0 为基线，保留 `.semi-toast-*` DOM/class、主题 Token、命令式方法、工厂实例和上下文 holder。

## 基本用法

```ts
import { Toast } from '@workspace/ui';
import '@workspace/theme-default/toast.css';

Toast.success('保存成功');

const id = Toast.warning({
  content: '访问凭证即将过期',
  duration: 0,
  theme: 'light',
});

Toast.close(id);
```

`info`、`success`、`warning`、`error` 接受字符串或 options，并返回可用于更新/关闭的 id。同一个 id 再次调用会原位更新内容并重启自动关闭计时。

```ts
const id = Toast.info({ content: '正在同步', duration: 10 });

Toast.success({ id, content: '同步已完成', duration: 3 });
```

## 堆叠与位置

同屏存在多条提示时可启用 `stack`；折叠状态通过 hover 展开。位置支持数字（转成 px）或 CSS 字符串。

```ts
Toast.config({ top: 24, zIndex: 1200 });

Toast.info({ content: '第一条', stack: true });
Toast.warning({ content: '第二条', stack: true });
```

`Toast.config` 应在当前实例首次显示前调用。wrapper 创建后，`zIndex` 与 `getPopupContainer` 不迁移；`top/right/bottom/left` 在后续调用显式提供时仍会更新。

## Vue 上下文 holder

在 `<script setup>` 中调用 `useToast`，并把返回的 holder 渲染到希望继承 ConfigProvider 上下文的位置。

```vue
<script setup lang="ts">
import { useToast } from '@workspace/ui';

const [toast, ToastHolder] = useToast();

function submit() {
  toast.open({ content: '处理中', duration: 0 });
}
</script>

<template>
  <ToastHolder />
  <button type="button" @click="submit">提交</button>
</template>
```

holder API 额外提供 `open(options)`，用于显示 `default` 类型 Toast。

## 独立工厂

需要不同容器或默认配置时使用 `ToastFactory.create`。每个实例拥有独立 wrapper、默认值和销毁边界。

```ts
import { ToastFactory } from '@workspace/ui';

const LocalToast = ToastFactory.create({
  getPopupContainer: () => document.querySelector('#toast-host') as HTMLElement,
  top: 12,
});

LocalToast.info('局部提示');
LocalToast.destroyAll();
```

## API

### Toast options

| 属性                    | 类型                        | 默认值          | 说明                           |
| ----------------------- | --------------------------- | --------------- | ------------------------------ |
| `content`               | `VNodeChild`                | `''`            | 提示内容                       |
| `icon`                  | `VNodeChild`                | 按 type         | 自定义图标                     |
| `showClose`             | `boolean`                   | `true`          | 是否显示关闭按钮               |
| `textMaxWidth`          | `number \| string`          | `450`           | 内容最大宽度                   |
| `duration`              | `number`                    | `3`             | 自动关闭秒数，0 表示不自动关闭 |
| `theme`                 | `'normal' \| 'light'`       | `'normal'`      | 填充样式                       |
| `stack`                 | `boolean`                   | `false`         | 是否堆叠多条 Toast             |
| `direction`             | `'ltr' \| 'rtl'`            | 上下文或 LTR    | 文本方向                       |
| `id`                    | `string \| number`          | 自动生成        | 自定义 id；相同 id 更新        |
| `onClose`               | `() => void`                | -               | 关闭后的回调                   |
| `className`             | Vue class 值                | -               | 单条根节点 class               |
| `style`                 | `StyleValue`                | -               | 单条根节点样式                 |
| `top/right/bottom/left` | `number \| string`          | -               | wrapper 偏移                   |
| `zIndex`                | `number`                    | `1010`          | wrapper 首次创建时的层级       |
| `getPopupContainer`     | `() => HTMLElement \| null` | `document.body` | wrapper 首次创建时的父节点     |

### 静态方法

- `Toast.info(options | string)`
- `Toast.success(options | string)`
- `Toast.warning(options | string)`
- `Toast.error(options | string)`
- `Toast.close(id)`
- `Toast.destroyAll()`
- `Toast.config(config)`
- `ToastFactory.create(config?)`
- `useToast()` / `Toast.useToast()`

## 可访问性与 SSR

每条 Toast 使用 `role="alert"` 与 `{type} type` 的 `aria-label`。关闭按钮复用 Button 的原生键盘和焦点能力；组件不捕获 Escape，也不改变当前焦点。

根入口和 `@workspace/ui/toast` 均可在 SSR 中安全导入。命令式方法只能在浏览器调用；holder 在服务端可安全渲染空列表。
