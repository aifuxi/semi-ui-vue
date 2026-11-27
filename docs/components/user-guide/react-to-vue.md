# UserGuide React → Vue 迁移

| React v2.105.2                                | Vue 3.5+                                                       |
| --------------------------------------------- | -------------------------------------------------------------- |
| `<UserGuide visible={visible} />`             | `<UserGuide :visible="visible" />`                             |
| `current={current}` + `onChange={setCurrent}` | `v-model:current="current"`，也可监听 `@change`                |
| `onNext/onPrev/onSkip/onFinish`               | `@next/@prev/@skip/@finish`                                    |
| `StepItem.cover/title/description: ReactNode` | `VNodeChild`，或 `#cover/#title/#description` scoped slots     |
| `nextButtonProps.children`                    | `nextButtonProps.content`                                      |
| `prevButtonProps.children`                    | `prevButtonProps.content`                                      |
| `className`                                   | 推荐原生 `class`；仍兼容 `className`                           |
| `style: React.CSSProperties`                  | `style: StyleValue`                                            |
| `target: Element \| (() => Element)`          | `Element \| (() => Element \| null \| undefined)`；推荐 getter |

## 可见性不是 v-model

固定 React Adapter 在 `skip` 或 `finish` 后不会自动隐藏。Vue 保留这一点，因此应显式更新 `visible`：

```vue
<UserGuide :visible="visible" :steps="steps" @skip="visible = false" @finish="visible = false" />
```

## Portal 容器

`UserGuide.getPopupContainer` 指定气泡和高亮遮罩或弹窗的挂载点，缺省时继承 ConfigProvider。

## 步骤选项

- 步骤的 `mask` 和 `spotlightPadding` 覆盖全局值，`className` 合并到当前卡片。显式 `spotlightPadding: 0` 表示无外扩。
- 全局 `theme="primary"` 会使所有步骤保持 primary。
