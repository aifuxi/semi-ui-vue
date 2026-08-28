# Avatar 头像

Avatar 用图片、图标或字符展示用户/实体身份；`AvatarGroup` 用于重叠展示一组头像。本实现以 Semi Design v2.102.0 固定源码为唯一基线。

## 引入

```ts
import { Avatar, AvatarGroup } from '@workspace/ui';
import '@workspace/theme-default/avatar.css';
```

## 尺寸

首个示例与固定中文文档一致，覆盖七种预设尺寸。`size` 也接受 `6rem` 等任意 CSS 长度。

```vue
<script setup lang="ts">
import { Avatar } from '@workspace/ui';
</script>

<template>
  <div>
    <Avatar size="extra-extra-small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="extra-small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="small" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="default" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="large" :style="{ margin: '4px' }" alt="User">U</Avatar>
    <Avatar size="extra-large" :style="{ margin: '4px' }" alt="User">U</Avatar>
  </div>
</template>
```

## 颜色、形状、图片和 fallback

```vue
<template>
  <Avatar color="red" alt="Alice">A</Avatar>
  <Avatar color="light-blue" shape="square" alt="Bob">B</Avatar>
  <Avatar src="/avatar.webp" src-set="/avatar@2x.webp 2x" alt="Carol">C</Avatar>
</template>
```

图片加载失败时默认回退到默认 slot；`onError` 返回 `false` 可保留图片并关闭默认 fallback。`imgAttr` 传递原生 img 属性。

## Hover、点击和键盘

```vue
<Avatar color="purple" alt="Profile" @click="openProfile">
  P
  <template #hoverMask>
    <span class="avatar-mask">编辑</span>
  </template>
</Avatar>
```

存在 `@click` 时文字或图片获得 `tabindex="0"`；Enter 触发点击，Escape 取消焦点。`#hoverMask` 优先于 `hoverMask` prop。

## 顶部、底部和附加边框

```vue
<Avatar
  size="large"
  color="amber"
  :border="{ color: '#fe2c55', motion: true }"
  content-motion
  :top-slot="{ text: '直播', gradientStart: '#ff1764', gradientEnd: '#ed3494' }"
  :bottom-slot="{ shape: 'circle', bgColor: '#fe2c55', text: '+' }"
  alt="Live"
>
  T
</Avatar>
```

也可用 `#topSlot="{ config }"` 和 `#bottomSlot="{ config }"` 完全自定义装饰节点。

## 头像组

```vue
<AvatarGroup :max-count="3" overlap-from="start" size="medium">
  <Avatar color="red" alt="Alice">A</Avatar>
  <Avatar color="orange" alt="Bob">B</Avatar>
  <Avatar color="green" alt="Carol">C</Avatar>
  <Avatar color="blue" alt="David">D</Avatar>
  <Avatar color="purple" alt="Eve">E</Avatar>
  <template #more="{ restNumber }">
    <span>还有 {{ restNumber }} 人</span>
  </template>
</AvatarGroup>
```

Group 的 `size`、`shape` 覆盖直接子 Avatar；`overlapFrom` 控制层叠方向。未提供 `#more` 或 `renderMore` 时自动生成 `+N` Avatar。

## API

### Avatar props

| 名称                     | 类型                             | 默认值   | 说明                     |
| ------------------------ | -------------------------------- | -------- | ------------------------ |
| `size`                   | 七种预设或 CSS 长度字符串        | `medium` | 头像尺寸                 |
| `shape`                  | `circle \| square`               | `circle` | 形状                     |
| `color`                  | `AvatarColor`                    | `grey`   | 无有效图片时的背景色     |
| `src` / `srcSet` / `alt` | `string`                         | -        | 图片与替代文本           |
| `imgAttr`                | `ImgHTMLAttributes`              | -        | 原生图片属性             |
| `gap`                    | `number`                         | `3`      | 文字头像两侧最小间距     |
| `hoverMask`              | `VNodeChild`                     | -        | hover 覆盖层             |
| `topSlot` / `bottomSlot` | 配置对象                         | -        | 顶部/底部装饰            |
| `border`                 | `boolean \| { color?, motion? }` | `false`  | 附加边框                 |
| `contentMotion`          | `boolean`                        | `false`  | 内容缩放动效             |
| `className` / `style`    | Vue class/style                  | -        | Semi 兼容样式入口        |
| `onError`                | `(event) => boolean \| void`     | -        | 返回 false 阻止 fallback |

事件：`click`、`mouseenter`、`mouseleave`。Slots：默认、`hoverMask`、`topSlot`、`bottomSlot`。

### AvatarGroup props

| 名称          | 类型                                      | 默认值   | 说明                   |
| ------------- | ----------------------------------------- | -------- | ---------------------- |
| `size`        | `AvatarSize`                              | `medium` | 覆盖直接子 Avatar 尺寸 |
| `shape`       | `circle \| square`                        | `circle` | 覆盖直接子 Avatar 形状 |
| `overlapFrom` | `start \| end`                            | `start`  | 层叠方向               |
| `maxCount`    | `number`                                  | -        | 最大可见头像数         |
| `renderMore`  | `(restNumber, restAvatars) => VNodeChild` | -        | 函数式自定义 more      |

Slots：默认、`more`。

## 无障碍与 SSR

Avatar 保留 `role="listitem"`，文字使用 `role="img"` 和 aria-label，Group 使用 `role="list"`。组件导入与 SSR render 不访问 DOM；字符宽度、图片预加载和 focus-visible 只在客户端生命周期内执行。
