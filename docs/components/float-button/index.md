# FloatButton 悬浮按钮

用于承载页面级高频快捷操作。实现基线为 Semi Design v2.102.0，并保留 `.semi-floatButton*`、`.semi-badge*` 与 `--semi-*` 兼容契约。

## 引入

```ts
import { FloatButton, FloatButtonGroup } from '@workspace/ui';
import '@workspace/theme-default/float-button.css';
```

## 基本用法

```vue
<FloatButton aria-label="新建" @click="createItem">
  <template #icon><IconPlus /></template>
</FloatButton>
```

## 尺寸、形状与状态

```vue
<FloatButton size="small"><template #icon><IconPlus /></template></FloatButton>
<FloatButton size="default" shape="square"><template #icon><IconPlus /></template></FloatButton>
<FloatButton size="large" colorful><template #icon><IconPlus /></template></FloatButton>
<FloatButton disabled><template #icon><IconPlus /></template></FloatButton>
```

## Badge 与按钮组

```vue
<FloatButton :badge="{ count: 120, overflowCount: 99 }" aria-label="消息">
  <template #icon><IconBell /></template>
</FloatButton>

<FloatButtonGroup :items="items" @click="handleGroupClick" />
```

Group `items` 支持 `value`、`content`、`icon`、`badge`。也可使用 `#item="{ item, index }"` slot 迁移 ReactNode 渲染。

## API

| 属性       | 类型                        | 默认值    | 说明                          |
| ---------- | --------------------------- | --------- | ----------------------------- |
| `shape`    | `round \| square`           | `round`   | 形状                          |
| `size`     | `small \| default \| large` | `default` | 尺寸                          |
| `colorful` | `boolean`                   | `false`   | AI 渐变样式                   |
| `disabled` | `boolean`                   | `false`   | 阻止跳转和 click emit         |
| `href`     | `string`                    | -         | 点击跳转地址                  |
| `target`   | `string`                    | -         | `_blank` 时使用新窗口         |
| `badge`    | `FloatButtonBadgeProps`     | -         | 徽章配置                      |
| `icon`     | `VNodeChild`                | -         | 兼容 prop；推荐使用 icon slot |

### Group

| 属性       | 类型                              | 默认值  | 说明                                  |
| ---------- | --------------------------------- | ------- | ------------------------------------- |
| `items`    | `readonly FloatButtonGroupItem[]` | 必填    | 子项配置                              |
| `disabled` | `boolean`                         | `false` | 与固定源码一致，仅增加 disabled class |

### Events 与 Slots

| 名称    | 参数                       | 说明                   |
| ------- | -------------------------- | ---------------------- |
| `click` | FloatButton: `MouseEvent`  | 未禁用时触发           |
| `click` | Group: `value, MouseEvent` | 根级委托点击           |
| `#icon` | -                          | FloatButton 图标       |
| `#item` | `{ item, index }`          | 自定义 Group item 内容 |

固定 v2.102.0 根节点为 div，没有默认键盘语义。调用方必须提供可访问名称；如业务需要键盘操作，应在组合层明确添加相应 role/tabindex/键盘处理。

## React → Vue 迁移

| React                  | Vue                             |
| ---------------------- | ------------------------------- |
| `icon={<IconPlus />}`  | `#icon` slot                    |
| `items[].icon/content` | 同名 VNode prop 或 `#item` slot |
| `onClick`              | `@click`                        |
| `className / style`    | 原生 `class / style` attrs      |
| React ref              | Vue template ref                |

其余 prop 名、枚举、默认值和 Group 事件委托语义保持不变。
