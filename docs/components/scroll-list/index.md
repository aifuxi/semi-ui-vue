# ScrollList 滚动列表

ScrollList 用于在有限高度内展示一列或多列可滚动选项。本实现以本地 Semi Design v2.102.0 为唯一基线，保留 normal、wheel、循环滚动、禁用、变换、主题与 RTL 契约。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ScrollItem, ScrollList, type ScrollItemSelectData } from '@aifuxi/semi-ui-vue';

const selectedIndex = ref(1);
const hours = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  disabled: index === 5,
}));

function select(data: ScrollItemSelectData): void {
  selectedIndex.value = data.index;
}
</script>

<template>
  <ScrollList :body-height="240">
    <template #header>选择小时</template>
    <ScrollItem
      aria-label="小时"
      cycled
      :list="hours"
      mode="wheel"
      :selected-index="selectedIndex"
      type="hour"
      @select="select"
    />
    <template #footer>滚动或点击选项</template>
  </ScrollList>
</template>
```

`selectedIndex` 是受控状态：组件通过 `select` 事件通知选择结果，调用方更新索引。`normal` 模式直接点击选项；`wheel` 模式会把最近的启用项滚动到选择线。`cycled` 只在 wheel 模式生效。

## ScrollList API

| 属性                            | 类型                 | 默认值            | 说明                      |
| ------------------------------- | -------------------- | ----------------- | ------------------------- |
| `bodyHeight`                    | `number \| string`   | `300`（主题样式） | body 高度，number 按 px   |
| `header` / `#header`            | `VNodeChild`         | -                 | 标题内容，slot 优先       |
| `footer` / `#footer`            | `VNodeChild`         | -                 | 底部内容，slot 优先       |
| `prefixCls`                     | `string`             | `semi-scrolllist` | class 前缀                |
| `class` / `className` / `style` | Vue class/style 类型 | -                 | 根节点样式                |
| 默认 slot                       | `VNodeChild`         | -                 | 放置一个或多个 ScrollItem |

## ScrollItem API

| 属性                            | 类型                                        | 默认值    | 说明                            |
| ------------------------------- | ------------------------------------------- | --------- | ------------------------------- |
| `list`                          | `ScrollItemData[]`                          | `[]`      | 选项数据                        |
| `mode`                          | `'normal' \| 'wheel'`                       | `'wheel'` | 展示模式                        |
| `cycled`                        | `boolean`                                   | `false`   | wheel 是否循环                  |
| `selectedIndex`                 | `number`                                    | `0`       | 受控选中索引                    |
| `motion`                        | `boolean \| ScrollMotionObject \| function` | `true`    | 是否使用固定滚动动画            |
| `transform`                     | `(value, text) => unknown`                  | -         | 仅变换选中项；item 上的函数优先 |
| `type`                          | `string \| number`                          | -         | 写入 select payload 的列标识    |
| `ariaLabel`                     | `string`                                    | -         | 模板可写为 `aria-label`         |
| `class` / `className` / `style` | Vue class/style 类型                        | -         | 列根节点样式                    |

`select` 事件参数为源 item 的浅拷贝，并附加 `index` 与 `type`。禁用项不会触发选择。

## 无障碍、主题与 SSR

每列使用 `role="listbox"`，选项使用 `role="option"` 与 `aria-disabled`。固定 v2.102.0 Adapter 没有方向键或 roving tabindex，也未输出 `aria-selected`，Vue 实现不扩展基线外的键盘状态机。light/dark 颜色来自 `--semi-color-*`，RTL 会翻转列分隔线和 wheel padding。公共入口 SSR-safe，DOM 测量与滚动只在客户端挂载后执行并在卸载时清理。

完整源码证据、默认值、事件顺序、视觉矩阵与 deviation 见 [对齐矩阵](./alignment.md)，框架迁移见 [React → Vue](./react-to-vue.md)。
