# HotKeys React → Vue 迁移

| React v2.102.0                              | Vue 3                                         | 说明                                      |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `<HotKeys hotKeys={keys} onHotKey={run} />` | `<HotKeys :hot-keys="keys" @hot-key="run" />` | 组合值、事件 payload 和严格修饰键语义不变 |
| `content={['Ctrl', 'K']}`                   | `:content="['Ctrl', 'K']"`                    | 只改变显示文本                            |
| `render={<Tag>...</Tag>}`                   | 默认 slot                                     | ReactNode 映射为 Vue slot                 |
| `render={() => node}`                       | 默认 slot                                     | slot 只求值一次                           |
| `onClick={run}`                             | `@click="run"`                                | Vue 回调接收原生 `MouseEvent`             |
| `className` / `style`                       | `class` / `style`，也兼容 `className`         | Vue 原生 attrs 可继续透传                 |
| `HotKeys.Keys.Control`                      | `HotKeys.Keys.Control`                        | 静态键表保持同名                          |

`hotKeys` 在上游类型中可选，但固定 Foundation 在 mounted 时要求合法组合；Vue 声明
将它标为必填，以便在编译期表达真实运行时契约。

固定 v2.102.0 Foundation 虽读取 `mergeMetaCtrl`，但没有使用该值。因此即使设为
`true`，Meta 也不会匹配 Control 组合，Vue 版本不擅自引入更新版本语义。

组件默认监听 `document.body`，也可用 `getListenerTarget` 限定到某个 HTMLElement。
它不自动聚焦目标，不增加 role/tabindex；需要可聚焦局部快捷键区时由调用方设置。
