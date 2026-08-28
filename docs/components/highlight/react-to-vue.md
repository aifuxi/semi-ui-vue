# Highlight React → Vue 迁移

| Semi React v2.102.0                 | Vue                                   |
| ----------------------------------- | ------------------------------------- |
| `<Highlight sourceString={text} />` | `<Highlight :source-string="text" />` |
| `searchWords={words}`               | `:search-words="words"`               |
| `component="strong"`                | `component="strong"`                  |
| `highlightClassName="keyword"`      | `highlight-class-name="keyword"`      |
| `highlightStyle={style}`            | `:highlight-style="style"`            |
| `caseSensitive`                     | `case-sensitive`                      |
| `autoEscape={false}`                | `:auto-escape="false"`                |
| React `CSSProperties`               | Vue `CSSProperties`                   |

React：

```tsx
<Highlight
  component="span"
  sourceString="Semi connects design and code"
  searchWords={[
    { text: 'Semi', className: 'brand', style: { backgroundColor: 'teal' } },
    { text: 'code', className: 'code', style: { backgroundColor: 'violet' } },
  ]}
  highlightStyle={{ borderRadius: 4, padding: 4 }}
/>
```

Vue：

```vue
<Highlight
  component="span"
  source-string="Semi connects design and code"
  :search-words="[
    { text: 'Semi', className: 'brand', style: { backgroundColor: 'teal' } },
    { text: 'code', className: 'code', style: { backgroundColor: 'violet' } },
  ]"
  :highlight-style="{ borderRadius: '4px', padding: '4px' }"
/>
```

迁移后保持以下语义：

- `component` 缺省为 `mark`，`sourceString` 缺省为空字符串，`searchWords` 缺省为空数组。
- `caseSensitive=false`；`autoEscape=true`。显式 `:auto-escape="false"` 保留正则语义。
- 每个匹配标签都保留 `.semi-highlight-tag`；统一 class/style 与对象搜索词 class/style 按固定顺序合并。
- 相交或首尾相接的匹配由固定 Foundation 合并。
- 组件不增加元素 wrapper，也没有 children/slot、事件或 `v-model` 契约。
- React Adapter 没有根元素，因此 `className`、`style`、ARIA 或 data attrs 不能作为根属性传入；需要容器属性时，请显式包裹 `<span>` 或其它合适元素。
- Vue Fragment 会生成不可见的 hydration 边界注释；元素 DOM、文本流、可访问树和截图保持一致。
