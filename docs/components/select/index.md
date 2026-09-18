# Select 选择器

Select 对齐 Semi Design v2.102.0，保留 `.semi-select*` DOM/class、Portal 定位、多选标签、虚拟化、键盘与 ARIA 契约。公开入口为 `@aifuxi/semi-ui-vue` 根导出与 `@aifuxi/semi-ui-vue/select` 子路径，默认导出与命名导出 `Select` 一致，并附带复合静态成员 `Select.Option`、`Select.OptGroup`。

## 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue';

const value = ref('douyin');
</script>

<template>
  <Select v-model="value" placeholder="请选择">
    <SelectOption value="douyin" label="抖音" />
    <SelectOption value="lark" label="飞书" />
  </Select>
</template>
```

`v-model` 绑定 `modelValue`，选中时按 `select → change → update:modelValue → update:value` 的顺序通知；`value` 与 `modelValue` 同时存在时 `value` 优先，新增的 Vue 更新事件不改变 Semi 的 `change` 载荷。

## 数组选项、多选与分组

`option-list` 传入 `{ value, label }` 数组；默认 slot 承载声明式候选项，使用 `Select.Option`，分组使用 `Select.OptGroup`。

```vue
<template>
  <Select multiple :max-tag-count="2" show-rest-tags-popover :option-list="options" />
  <Select>
    <Select.OptGroup label="前端">
      <Select.Option value="vue" label="Vue" />
    </Select.OptGroup>
  </Select>
</template>
```

多选值为数组；超过 `maxTagCount` 折叠为 `+N`，`showRestTagsPopover` 打开剩余项浮层，`expandRestTagsOnClick` 在面板打开时展开；超出 `max` 时发出 `exceed`。

## 搜索、远程与创建条目

- `filter` 为 `true` 时按 label 本地过滤，也可传入 `(inputValue, option) => boolean` 自定义匹配；`searchPosition="dropdown"` 把搜索框放到面板顶部。
- `remote` 为 `true` 时不本地过滤，输入变化只发出 `search(value, event)`，由调用方更新 `option-list`。
- `allowCreate` 配合 `filter` 支持创建条目：先发出 `create(option)` 再进入选择链；`#createItem` 自定义创建行。
- 选中后 `autoClearSearchValue` 默认 `true` 会清空搜索词；多选场景可显式设为 `false` 保留。

## 自定义渲染与附加项

React 的 render props 在 Vue 中映射为具名 slot，函数 prop 兼容写法仍可用：

| React                              | Vue                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `triggerRender`                    | `#trigger="{ value, inputValue, disabled, onSearch, onClear, onRemove }"`    |
| `renderOptionItem`                 | `#option="{ option, focused, selected, inputValue, onClick, onMouseenter }"` |
| `renderSelectedItem`               | `#selectedItem="{ option, index }"`                                          |
| `renderCreateItem`                 | `#createItem="{ inputValue, focused, style }"`                               |
| `arrowIcon` / `clearIcon`          | `#arrowIcon` / `#clearIcon`                                                  |
| `prefix` / `suffix`                | `#prefix` / `#suffix`，或用同名 VNode prop                                   |
| `insetLabel`                       | `#insetLabel` 或同名 VNode prop                                              |
| `outerTopSlot` / `outerBottomSlot` | `#outerTop` / `#outerBottom`（与面板平级）                                   |
| `innerTopSlot` / `innerBottomSlot` | `#innerTop` / `#innerBottom`（列表内部）                                     |
| `emptyContent`                     | `#emptyContent` 或同名 prop；显式 `null` 时不展示空态                        |

## 虚拟化、Portal 与定位

`virtualize="{ height, width, itemSize }"` 开启虚拟列表（缺省高度 270px，与 `maxHeight` 保持一致可避免双滚动条）；Portal 目标由 `getPopupContainer` 决定，缺省挂到 `document.body`。`position` 缺省为 LTR `bottomLeft`、RTL `bottomRight`，`spacing` 缺省 4，`rePosKey` 变化时重新定位，`dropdownMatchSelectWidth` 缺省按 Select 宽度限制最小宽度，`dropdownClassName` / `dropdownStyle` 作用于浮层根。

## 受控与非受控

- 非受控：`defaultValue` / `defaultOpen` 提供初始值，组件内部维护选中、输入与展开状态。
- 受控：`value` 或 `modelValue` 存在时渲染完全以 props 为准，组件不会自行提交选中值，需在 `change` / `update:modelValue` 中回写。
- `onChangeWithObject` 控制 `change` 是否返回完整 option 对象；`defaultActiveFirstOption` 缺省 `true`，回车可直接选中高亮项。

## API

### Select Props

| Prop                                                                                       | 类型                                                   | 默认值                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| `value` / `modelValue`                                                                     | `SelectPrimitive \| Record<string, unknown> \| 数组`   | -                                                |
| `defaultValue`                                                                             | 同上                                                   | -                                                |
| `optionList`                                                                               | `{ value, label, disabled?, showTick? }[]`             | -                                                |
| `multiple`                                                                                 | `boolean`                                              | `false`                                          |
| `max` / `maxTagCount`                                                                      | `number`                                               | -                                                |
| `showRestTagsPopover`                                                                      | `boolean`                                              | `false`                                          |
| `restTagsPopoverProps`                                                                     | `TooltipProps` 子集                                    | -                                                |
| `expandRestTagsOnClick`                                                                    | `boolean`                                              | `false`                                          |
| `ellipsisTrigger`                                                                          | `boolean`                                              | `false`                                          |
| `filter`                                                                                   | `boolean \| (inputValue, option) => boolean`           | `false`                                          |
| `remote`                                                                                   | `boolean`                                              | `false`                                          |
| `searchPosition`                                                                           | `'trigger' \| 'dropdown'`                              | `'trigger'`                                      |
| `searchPlaceholder`                                                                        | `string`                                               | -                                                |
| `autoClearSearchValue`                                                                     | `boolean`                                              | `true`                                           |
| `allowCreate`                                                                              | `boolean`                                              | `false`                                          |
| `defaultActiveFirstOption`                                                                 | `boolean`                                              | `true`                                           |
| `onChangeWithObject`                                                                       | `boolean`                                              | `false`                                          |
| `defaultOpen`                                                                              | `boolean`                                              | `false`                                          |
| `clickToHide`                                                                              | `boolean`                                              | `false`（固定 Adapter 声明保留，不产生额外行为） |
| `disabled` / `borderless`                                                                  | `boolean`                                              | `false`                                          |
| `loading`                                                                                  | `boolean`                                              | `false`                                          |
| `size`                                                                                     | `'small' \| 'default' \| 'large'`                      | `'default'`                                      |
| `validateStatus`                                                                           | `'default' \| 'warning' \| 'error'`                    | `'default'`                                      |
| `placeholder` / `emptyContent`                                                             | `VNodeChild`（`emptyContent` 可为 `null`）             | `''` / -                                         |
| `showArrow` / `showClear`                                                                  | `boolean`                                              | `true` / `false`                                 |
| `insetLabelId` / `id`                                                                      | `string`                                               | -                                                |
| `autoFocus`                                                                                | `boolean`                                              | `false`（固定 Adapter 声明保留，不产生额外行为） |
| `preventScroll`                                                                            | `boolean`                                              | `false`；作用于公开 `focus()`                    |
| `inputProps`                                                                               | `InputHTMLAttributes` 子集                             | -                                                |
| `position`                                                                                 | `TooltipPosition`                                      | `'bottomLeft'`（RTL 为 `'bottomRight'`）         |
| `spacing` / `dropdownMargin`                                                               | `number \| TooltipSpacing` / `number \| TooltipMargin` | `4` / -                                          |
| `getPopupContainer`                                                                        | `() => HTMLElement`                                    | `() => document.body`                            |
| `dropdownMatchSelectWidth`                                                                 | `boolean`                                              | `true`                                           |
| `dropdownClassName` / `dropdownStyle`                                                      | class / style                                          | -                                                |
| `maxHeight` / `virtualize`                                                                 | `string \| number` / `{ height?, width?, itemSize? }`  | `270` / -                                        |
| `motion` / `stopPropagation`                                                               | `boolean`                                              | `true` / `true`                                  |
| `autoAdjustOverflow`                                                                       | `boolean`                                              | `true`                                           |
| `mouseEnterDelay` / `mouseLeaveDelay`                                                      | `number`                                               | -                                                |
| `rePosKey`                                                                                 | `string \| number`                                     | -                                                |
| `zIndex`                                                                                   | `number`                                               | `1030`                                           |
| `ariaLabelledby` / `ariaDescribedby` / `ariaErrormessage` / `ariaInvalid` / `ariaRequired` | 与原生 ARIA 属性一致                                   | -                                                |

### Select.Option

| Prop              | 类型                 | 默认值  |
| ----------------- | -------------------- | ------- |
| `value`           | `string \| number`   | -       |
| `label`           | `VNodeChild`         | -       |
| `disabled`        | `boolean`            | `false` |
| `showTick`        | `boolean`            | -       |
| `class` / `style` | Vue 原生 class/style | -       |

### Select.OptGroup

| Prop              | 类型                 | 默认值 |
| ----------------- | -------------------- | ------ |
| `label`           | `VNodeChild`         | -      |
| `class` / `style` | Vue 原生 class/style | -      |

### Events

`change(value)`、`select(value, option)`、`deselect(value, option)`、`clear()`、`create(option)`、`exceed(option)`、`search(value, event?)`、`listScroll(event)`、`dropdownVisibleChange(visible)`、`focus(event)`、`blur(event)`、`update:modelValue(value)`、`update:value(value)`。

### Methods

通过组件 ref 调用：`open()`、`close()`、`focus()`、`search(value, event?)`、`clearInput()`、`selectAll()`、`deselectAll()`、`rePosition()`。

### Slots

`default`（声明式 `Select.Option`/`Select.OptGroup`）、`arrowIcon`、`clearIcon`、`createItem`、`emptyContent`、`innerBottom`、`innerTop`、`insetLabel`、`option`、`outerBottom`、`outerTop`、`prefix`、`selectedItem`、`suffix`、`trigger`。scoped slot 字段见上表；`#option` 的入参还包含固定 `SelectOptionRuntime` 字段（`value`、`label`、`disabled`、`_selected` 等）。

## 可访问性与键盘

- trigger 使用 `role="combobox"`、`aria-expanded`、`aria-controls` 与 `aria-activedescendant`；列表为 `role="listbox"`，候选项为 `role="option"` 并输出 `aria-selected` / `aria-disabled`。
- `ArrowDown` / `ArrowUp` 移动高亮，`Enter` 选中，`Escape` 关闭并把焦点留在 trigger，`Tab` 离开；多选下 `Backspace` 删除最后一个标签。
- 关闭浮层不移动焦点：这是固定 v2.17.0 之后的行为，选中单项不会触发 `blur`。

## 主题、RTL 与 SSR

- class 与主题 Token 沿用固定 `.semi-select*`，逐组件样式入口为 `@aifuxi/semi-theme-default/select.css`。
- RTL 由 ConfigProvider 的 `.semi-rtl` 与方向上下文驱动：浮层默认位置、标签与箭头方向随方向翻转。
- 公开入口 SSR-safe：无 DOM 环境可 import 与 renderToString，Portal、Observer 与输入测量只在客户端挂载后创建。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、视觉与发布证据见[对齐矩阵](./alignment.md)。
