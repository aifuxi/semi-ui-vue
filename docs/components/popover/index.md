# Popover 气泡卡片

Popover 在触发元素旁渲染可交互卡片。它复用 Tooltip 的定位和 Portal 状态机，但默认面向复杂内容与键盘交互。

## 引入

```ts
import { Popover } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/popover.css';
```

## 基本使用

```vue
<Popover>
  <template #content>
    <article class="card">可以放置按钮、表单或其他复杂内容</article>
  </template>
  <button>悬停此处</button>
</Popover>
```

`content` prop 适合静态 VNode；`#content` 是更自然的 Vue 写法，并优先于 prop。

## 受控显示与焦点

```vue
<Popover v-model:visible="visible" trigger="click">
  <template #content="{ initialFocusRef }">
    <input :ref="initialFocusRef" placeholder="打开后聚焦" />
  </template>
  <button>打开</button>
</Popover>
```

click/custom 使用 `dialog` 角色；hover/focus/contextMenu 使用 `tooltip` 角色。默认支持焦点守卫、Escape 关闭和关闭后恢复 trigger 焦点。

## 箭头、自定义颜色与容器

```vue
<Popover
  show-arrow
  position="right"
  :style="{ backgroundColor: '#0064fa', borderColor: '#0064fa', color: 'white' }"
  :arrow-style="{ backgroundColor: '#0064fa', borderColor: '#0064fa' }"
  :get-popup-container="() => popupHost"
>
  <template #content><div class="card">右侧卡片</div></template>
  <button>触发</button>
</Popover>
```

自定义容器应在 Popover 首次显示前存在，并设置 `position: relative`。`spacing` 默认在无箭头时为 `4`、有箭头时为 `10`。

## API

| 属性                   | 类型                                                         | 默认值                | 说明                           |
| ---------------------- | ------------------------------------------------------------ | --------------------- | ------------------------------ |
| `content`              | `VNodeChild`                                                 | -                     | 静态内容；`#content` 优先      |
| `visible`              | `boolean`                                                    | -                     | 与 `v-model:visible` 配合      |
| `trigger`              | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`             | 触发方式                       |
| `position`             | `PopoverPosition`                                            | `'bottom'`            | 弹出方位                       |
| `showArrow`            | `boolean`                                                    | `false`               | 显示双层箭头                   |
| `arrowPointAtCenter`   | `boolean`                                                    | `true`                | 箭头指向 trigger 中心          |
| `arrowStyle`           | `PopoverArrowStyle`                                          | -                     | 箭头背景、边框和透明度         |
| `spacing`              | `number \| { x, y }`                                         | `4 / 10`              | 与 trigger 的距离              |
| `autoAdjustOverflow`   | `boolean`                                                    | `true`                | 空间不足时调整方位             |
| `condition`            | `boolean`                                                    | `true`                | 是否允许非 custom trigger 打开 |
| `closeOnEsc`           | `boolean`                                                    | `true`                | Escape 关闭                    |
| `guardFocus`           | `boolean`                                                    | `true`                | 面板内循环 Tab                 |
| `returnFocusOnClose`   | `boolean`                                                    | `true`                | 关闭后恢复 trigger 焦点        |
| `disableFocusListener` | `boolean`                                                    | `true`                | hover 模式不因 focus 打开      |
| `clickToHide`          | `boolean`                                                    | `false`               | 点击面板内容关闭               |
| `keepDOM`              | `boolean`                                                    | `false`               | 关闭后保留内容 DOM             |
| `contentClassName`     | `ClassValue`                                                 | -                     | 内部 `.semi-popover` class     |
| `class` / `style`      | Vue class / `StyleValue`                                     | -                     | 定位 wrapper class/style       |
| `getPopupContainer`    | `() => HTMLElement`                                          | ConfigProvider / body | Portal 容器                    |
| `rePosKey`             | `string \| number`                                           | -                     | 变化时请求重新定位             |
| `zIndex`               | `number`                                                     | `1030`                | Portal z-index                 |

事件包括 `@visibleChange`、`@update:visible`、`@clickOutside`、`@escKeydown`、`@afterClose`。组件 ref 暴露 `focusTrigger()`。

## SSR、RTL 与主题

SSR 只输出 trigger，hydration 后才创建 Portal。组件无 locale 文案；RTL 由 ConfigProvider direction 驱动，light/dark 颜色来自固定 Semi Token。
