# Timeline React → Vue 迁移

| React v2.102.0                           | Vue                                                  |
| ---------------------------------------- | ---------------------------------------------------- |
| `<Timeline><Timeline.Item /></Timeline>` | `<Timeline><TimelineItem /></Timeline>`              |
| `<Timeline dataSource={data} />`         | `<Timeline :data-source="data" />`                   |
| `children` / `content: ReactNode`        | 默认 slot / `content: VNodeChild`                    |
| `dot={<Icon />}` / `extra={<span />}`    | `#dot` / `#extra`，也可继续使用同名 VNode prop       |
| `time={<time>10:00</time>}`              | `#time`，也可使用 `:time="vnode"`                    |
| `className` / `style`                    | 原生 `class` / `:style`；兼容 `className`            |
| `onClick={handler}`                      | `@click="handler"`                                   |
| `aria-label="Deployment timeline"`       | 原生 `aria-label`，或类型化 `aria-label`/`ariaLabel` |

`Timeline.Item` 的复合静态成员仍保留用于 TypeScript/render function；SFC 模板推荐直接导入 `TimelineItem`。`mode`、`type`、`position` 的枚举值及 `.semi-*` DOM/class 契约保持不变。
