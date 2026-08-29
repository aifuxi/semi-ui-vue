# OverflowList React → Vue 迁移

| React v2.102.0                               | Vue                               |
| -------------------------------------------- | --------------------------------- |
| `visibleItemRenderer={(item, index) => ...}` | `#visibleItem="{ item, index }"`  |
| `overflowRenderer={items => ...}`            | `#overflow="{ items, position }"` |
| `onOverflow={handler}`                       | `@overflow="handler"`             |
| `onIntersect={handler}`                      | `@intersect="handler"`            |
| `onVisibleStateChange={handler}`             | `@visibleStateChange="handler"`   |
| `className`                                  | `class`（也兼容 `className`）     |

其余枚举值和自然可保留的 prop 名保持一致。scroll 模式下，React 要求 renderer 返回可 clone 的单个 ReactElement；Vue 单根元素会直接获得 `data-scrollkey`，多根 slot 会由内部 `.semi-overflow-list-scroll-item` 包装，这是唯一已接受的框架结构差异。
