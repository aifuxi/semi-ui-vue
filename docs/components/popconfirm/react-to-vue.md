# Popconfirm React → Vue 迁移

| Semi React v2.102.0                               | Vue 对应                                                        |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `children`                                        | 默认 slot                                                       |
| `title={node}` / `content={node}` / `icon={node}` | 同名 prop 或 `#title/#content/#icon`                            |
| `content={({ initialFocusRef }) => ...}`          | `#content="{ initialFocusRef }"`                                |
| `visible` + `onVisibleChange`                     | `v-model:visible`，也可分别使用 `visible` 与 `@visible-change`  |
| `onConfirm` / `onCancel`                          | `@confirm` / `@cancel`；监听器返回 Promise 时保留 loading 契约  |
| `onClickOutSide`                                  | `@click-outside`                                                |
| `onEscKeyDown`                                    | `@esc-keydown`                                                  |
| `className` / `style`                             | `class`（兼容 `className`）/ `style`，作用于 `.semi-popconfirm` |
| `ReactNode`                                       | Vue `VNodeChild`                                                |

## Promise 回调

React：

```tsx
<Popconfirm onConfirm={() => save()} title="Save?">
  <Button>Save</Button>
</Popconfirm>
```

Vue：

```vue
<Popconfirm :on-confirm="save" title="Save?">
  <Button>Save</Button>
</Popconfirm>
```

如果使用 `@confirm="() => { save() }"`，大括号函数不会自动返回 Promise，组件无法等待；应写成 `@confirm="save"` 或 `:on-confirm="() => save()"`。

## 受控模式

React 显式提供 `visible` 时内部 trigger 会切换到 custom。Vue 同样如此，推荐直接使用：

```vue
<Popconfirm v-model:visible="visible" trigger="custom">
  <Button @click="visible = !visible">Toggle</Button>
</Popconfirm>
```

## 保持不变的兼容契约

- `.semi-popconfirm*`、`.semi-popconfirm-popover` 与 `--semi-*` Token。
- LTR/RTL 默认 position、按钮顺序和文本 locale。
- 同步/Promise confirm 与 cancel 的关闭顺序、独立 loading、焦点守卫，以及非受控 click 模式的 trigger 焦点恢复；受控 `visible` 保持 custom trigger 不自动恢复的上游语义。
- `getPopupContainer`、Portal、scroll 重定位、Escape、arrow 和 motion 均沿用 Popover 语义。
