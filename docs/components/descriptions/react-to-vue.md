# Descriptions React → Vue 迁移

| React v2.102.0                                               | Vue                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `<Descriptions data={data} />`                               | `<Descriptions :data="data" />`                               |
| `<Descriptions.Item itemKey="User">Semi</Descriptions.Item>` | `<Descriptions.Item item-key="User">Semi</Descriptions.Item>` |
| `itemKey={<Strong />}`                                       | `:item-key="vnode"` 或 `#key` slot                            |
| `value={() => <Content />}`                                  | `value: () => h(Content)`；Item 内容使用默认 slot             |
| `className` / `style`                                        | 同名 props，并支持 Vue 原生 `class` / `style`                 |
| `children`                                                   | 默认 slot                                                     |

`align`、`row`、`size`、`layout`、`column`、`hidden`、`span` 与 `keyStyle` 名称和枚举保持不变。ReactNode 类型映射为 Vue `VNodeChild`；这是框架原生差异，不改变 DOM、布局或视觉契约。
