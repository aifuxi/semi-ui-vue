# Avatar React → Vue 迁移

| Semi React v2.102.0                 | Vue                                                      |
| ----------------------------------- | -------------------------------------------------------- |
| `<Avatar>U</Avatar>`                | `<Avatar>U</Avatar>`                                     |
| `onClick={handler}`                 | `@click="handler"`                                       |
| `onMouseEnter` / `onMouseLeave`     | `@mouseenter` / `@mouseleave`                            |
| `onError={(event) => false}`        | `:on-error="(event) => false"`；返回 false 语义不变      |
| `hoverMask={<Mask />}`              | `#hoverMask`（也保留 `hoverMask` VNode prop）            |
| `topSlot={{ text, ... }}`           | 同名配置 prop，或 `#topSlot="{ config }"`                |
| `bottomSlot={{ text, ... }}`        | 同名配置 prop，或 `#bottomSlot="{ config }"`             |
| `renderMore={(count, rest) => ...}` | `#more="{ restNumber, restAvatars }"`（也保留函数 prop） |
| `AvatarGroup` children              | 默认 slot 的直接 Avatar 子节点                           |

React SyntheticEvent 迁移为浏览器原生 Event。Group 在 Vue 中显式展开 Fragment、过滤空白/注释并克隆直接 Avatar VNode；Group `size`/`shape`、其余 attrs 与层叠 class 的优先级保持固定 React `cloneElement` 行为。
