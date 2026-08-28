# Empty React → Vue 迁移

| Semi React v2.102.0      | Vue                                           |
| ------------------------ | --------------------------------------------- |
| `<Empty image={node} />` | `<Empty :image="node" />` 或 `#image`         |
| `darkModeImage={node}`   | `:dark-mode-image="node"` 或 `#darkModeImage` |
| `title={node}`           | `:title="node"` 或 `#title`                   |
| `description={node}`     | `:description="node"` 或 `#description`       |
| `children`               | 默认 slot，渲染到 `.semi-empty-footer`        |
| `layout="horizontal"`    | `layout="horizontal"`                         |
| `imageStyle={style}`     | `:image-style="style"`                        |
| `className="name"`       | `class="name"`；迁移期也接受 `className`      |
| `style={style}`          | `:style="style"`                              |
| `data-*`                 | 同名 Vue attrs                                |
| React `ReactNode`        | Vue `VNodeChild` 或同名 slot                  |
| React `CSSProperties`    | Vue `StyleValue`                              |

推荐把模板内可读的 VNode 改为 slot：

```tsx
<Empty
  image={<CustomIllustration />}
  title={<strong>No content</strong>}
  description="Create the first item."
>
  <Button>Create</Button>
</Empty>
```

```vue
<Empty description="Create the first item.">
  <template #image><CustomIllustration /></template>
  <template #title><strong>No content</strong></template>
  <Button>Create</Button>
</Empty>
```

语义保持不变：

- `layout` 缺省为 `vertical`。
- 字符串图片生成原生 `img`；SVG 描述对象只读取 `id` 并生成 `svg > use`。
- 有图片时标题为 heading 4；无图片时为 heading 6、字重 400。
- `darkModeImage` 继续响应 `document.body[theme-mode]`，且只在客户端建立、卸载时清理 MutationObserver。
- 自定义图片 VNode 不被克隆或装饰；调用方继续负责其 ARIA。
- React SyntheticEvent 不适用；根节点监听器迁移为 Vue 原生 DOM attrs，例如 `@click`。

Vue 额外允许 `aria-*` 和 `role` 直接落到根节点。组件没有 `v-model`、公开 emits、Portal、键盘状态或 imperative ref API。
