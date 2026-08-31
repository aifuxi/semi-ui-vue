# UserGuide React → Vue 迁移

| React v2.102.0                                | Vue 3.5+                                                       |
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

固定 v2.102.0 的 `UserGuide.getPopupContainer` 只用于跳过 body scroll 锁，并未传给内部 Popover/Modal。React 与 Vue 都应通过 ConfigProvider 控制真正的浮层容器：

```vue
<ConfigProvider :get-popup-container="() => stage!">
  <div ref="stage">
    <UserGuide
      :visible="visible"
      :steps="steps"
      :get-popup-container="() => stage!"
    />
  </div>
</ConfigProvider>
```

同时传 UserGuide prop 可保持固定 Adapter 的 body-lock 行为；ConfigProvider 负责 Portal 父节点。

## 固定源码差异

- step 级 `mask` 与 `className` 在上游公开类型中存在，但 v2.102.0 React Adapter 没有读取；Vue 不额外实现。
- 全局 `theme="primary"` 会使所有步骤保持 primary，即使某一步写了 `theme="default"`；这是固定 Adapter 的 `global primary || step primary` 逻辑。
- `spotlightPadding=0` 会按固定 Adapter 的 truthy fallback 回退到全局值或 5px。
