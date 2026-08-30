# IconButton React → Vue 迁移

## 导入

```tsx
import { IconButton } from '@douyinfe/semi-ui';
```

```ts
import { IconButton } from '@aifuxi/semi-ui-vue';
// 或 import { IconButton } from '@aifuxi/semi-ui-vue/icon-button';
```

## icon 与 children

```tsx
<IconButton icon={<IconStar />} aria-label="收藏" />
<IconButton icon={<IconStar />} iconPosition="right">收藏</IconButton>
```

```vue
<IconButton aria-label="收藏">
  <template #icon><IconStar /></template>
</IconButton>

<IconButton icon-position="right">
  <template #icon><IconStar /></template>
  收藏
</IconButton>
```

React `icon` 映射为 Vue `#icon`，React `children` 映射为默认 slot。多彩 fill、`iconSize` 和
`iconStyle` 通过 slot props 暴露：

```vue
<IconButton colorful icon-size="large" :icon-style="{ opacity: 0.8 }">
  <template #icon="{ fill, iconSize, iconStyle }">
    <IconStar :fill="fill" :size="iconSize" :style="iconStyle" />
  </template>
</IconButton>
```

## 属性与事件

| React                            | Vue                                 |
| -------------------------------- | ----------------------------------- |
| `className`                      | `class`                             |
| `contentClassName`               | `contentClass` / `content-class`    |
| `style`                          | `style`                             |
| `htmlType="submit"`              | `html-type="submit"`                |
| `iconPosition="right"`           | `icon-position="right"`             |
| `noHorizontalPadding={['left']}` | `:no-horizontal-padding="['left']"` |
| `onClick={handler}`              | `@click="handler"`                  |
| `onMouseDown={handler}`          | `@mousedown="handler"`              |
| `onMouseEnter={handler}`         | `@mouseenter="handler"`             |
| `onMouseLeave={handler}`         | `@mouseleave="handler"`             |

Icon-only 按钮继续由调用方提供 `aria-label`，组件不会根据图标猜测可访问名称。

## 新代码建议

固定上游已经不再推荐 IconButton。若无需兼容独立入口，建议直接使用 Button：

```vue
<Button aria-label="收藏">
  <template #icon><IconStar /></template>
</Button>
```
