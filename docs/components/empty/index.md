# Empty 空状态

Empty 用图片、标题、描述和操作区表达当前区域没有可展示内容。本实现以固定 Semi Design v2.102.0 Adapter、Foundation SCSS 和文档为唯一基线。

## 引入

```ts
import { Empty } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/empty.css';
```

也可使用子路径：

```ts
import Empty, { type EmptyProps } from '@aifuxi/semi-ui-vue/empty';
```

## 基本用法

```vue
<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@aifuxi/semi-illustrations-vue';
import '@aifuxi/semi-theme-default/empty.css';
</script>

<template>
  <Empty title="功能建设中" description="当前功能暂未开放，敬请期待。">
    <template #image>
      <IllustrationConstruction :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationConstructionDark :style="{ width: '150px', height: '150px' }" />
    </template>
  </Empty>
</template>
```

当存在 `darkModeImage` 时，组件在客户端监听 `document.body` 的 `theme-mode` 属性；值为 `dark` 时显示暗色图片，切换时即时更新，卸载时断开 observer。SSR 始终先输出 light `image`，hydration 后再同步当前主题。

## 自定义图片、文案与操作

`image`、`title` 和 `description` 同时支持 prop 与同名 slot；slot 优先。默认 slot 是固定 Adapter 的 children/footer 落点。

```vue
<script setup lang="ts">
import { Button, Empty } from '@aifuxi/semi-ui-vue';
import { IllustrationNoContent, IllustrationNoContentDark } from '@aifuxi/semi-illustrations-vue';
</script>

<template>
  <Empty title="暂无仪表盘" description="创建第一个仪表盘开始分析数据。">
    <template #image>
      <IllustrationNoContent :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationNoContentDark :style="{ width: '150px', height: '150px' }" />
    </template>
    <Button type="primary" theme="solid">创建仪表盘</Button>
  </Empty>
</template>
```

字符串图片输出原生 `<img>`。其 `alt` 在最终 description 是字符串时取该字符串，否则固定为 `empty`。传入 `{ id: 'symbol-id' }` 会按上游固定行为输出：

```vue
<Empty :image="{ id: 'empty-symbol' }" description="暂无内容" />
```

```html
<svg aria-hidden="true"><use xlink:href="#empty-symbol" /></svg>
```

公开类型仍保留 `viewBox` 和 `url`，但固定 v2.102.0 Adapter 只读取 `id`。

## 无图片与水平布局

```vue
<template>
  <Empty title="暂未找到匹配结果" description="请尝试重置筛选条件。" />

  <Empty
    layout="horizontal"
    image="/images/success.svg"
    title="创建成功"
    description="可以继续配置权限和通知规则。"
    :style="{ width: '800px', margin: '32px auto 0' }"
  >
    <button type="button">开始配置</button>
  </Empty>
</template>
```

无图片时标题使用 Typography heading 6 并把字重设为 400；有图片时使用 heading 4。垂直布局居中排列；水平布局把 content 放到图片右侧，RTL 下自动改为左侧。

## API

### Props

| 属性            | 类型                         | 默认值       | 说明                                   |
| --------------- | ---------------------------- | ------------ | -------------------------------------- |
| `layout`        | `'vertical' \| 'horizontal'` | `'vertical'` | 布局方式                               |
| `image`         | `EmptyImage`                 | -            | light 图片、SVG 描述对象或自定义 VNode |
| `darkModeImage` | `EmptyImage`                 | -            | `body[theme-mode="dark"]` 时使用的图片 |
| `imageStyle`    | `StyleValue`                 | -            | `.semi-empty-image` 样式               |
| `title`         | `VNodeChild`                 | -            | 标题；同名 slot 优先                   |
| `description`   | `VNodeChild`                 | -            | 描述；同名 slot 优先                   |
| `class`         | `HTMLAttributes['class']`    | -            | Vue 原生 class                         |
| `className`     | `HTMLAttributes['class']`    | -            | React 迁移兼容 class                   |
| `style`         | `StyleValue`                 | -            | 根节点样式                             |

`EmptyImage = VNodeChild | EmptySvgNode`；`EmptySvgNode` 包含可选的 `id`、`viewBox` 和 `url`。

### Slots

| slot            | 说明                                  |
| --------------- | ------------------------------------- |
| `image`         | light 图片，优先于 `image` prop       |
| `darkModeImage` | 暗色图片，优先于 `darkModeImage` prop |
| `title`         | 标题，优先于 `title` prop             |
| `description`   | 描述，优先于 `description` prop       |
| `default`       | footer/操作区                         |

根节点保留 Vue 原生 `class`、`style`、`data-*`、`aria-*`、`role` 和 DOM 监听 attrs；组件自身不定义额外 emits、键盘状态或 focus 状态。

## 可访问性、RTL 与 SSR

- SVG 描述对象输出 `aria-hidden="true"`；自定义 VNode 的 ARIA 由调用方负责。
- 图片之外不创建可聚焦节点；操作区按钮保持自身原生键盘行为。
- `.semi-rtl` 与 `.semi-portal-rtl` 祖先会应用固定 RTL SCSS。
- 根入口和 `@aifuxi/semi-ui-vue/empty` 子路径均可在无 DOM 环境导入；Observer 只在 mounted 后创建并完整清理。

完整源码证据、DOM、computed style、视觉场景和 deviation 结论见 [对齐矩阵](./alignment.md)，React 迁移见 [React → Vue](./react-to-vue.md)。
