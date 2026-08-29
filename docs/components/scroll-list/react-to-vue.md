# ScrollList React → Vue 迁移

| React v2.102.0                       | Vue                                               |
| ------------------------------------ | ------------------------------------------------- |
| `<ScrollList header={node}>`         | `header` prop 或 `#header` slot                   |
| `<ScrollList footer={node}>`         | `footer` prop 或 `#footer` slot                   |
| `children`                           | 默认 slot                                         |
| `<ScrollList.Item>` / `<ScrollItem>` | `<ScrollList.Item>` 或 `<ScrollItem>`             |
| `onSelect={handleSelect}`            | `@select="handleSelect"`                          |
| `aria-label="Hour"`                  | 模板同写法，公开 TypeScript prop 名为 `ariaLabel` |
| `className` / `style`                | `class` / `style`，同时兼容 `className`           |
| class ref 调用 `scrollToIndex()`     | template ref 调用暴露的 `scrollToIndex()`         |

`selectedIndex` 仍是受控输入；不要把 `select` 当成自动更新。React 的 `onSelect` payload、item transform 优先级、disabled 行为、normal/wheel/cycled 语义均保持不变。Vue 额外使用具名 slot 表达动态 header/footer，这是框架原生映射，不改变 DOM 或能力。
