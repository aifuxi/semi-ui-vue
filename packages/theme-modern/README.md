# @aifuxi/semi-theme-modern

本包是 Semi UI Vue 的可选现代主题样式，覆盖默认主题的圆角变量，并为 Button、Card 与浮层容器增加轻微的内侧层次。它不是 Semi Design 官方发布的主题。

圆角比例如下：

| Semi token                         |     值 |
| ---------------------------------- | -----: |
| `--semi-border-radius-extra-small` |  `4px` |
| `--semi-border-radius-small`       |  `8px` |
| `--semi-border-radius-medium`      | `16px` |
| `--semi-border-radius-large`       | `24px` |

圆形和胶囊圆角沿用默认主题的 `50%` 与 `9999px`。

Button 的 `solid`、`light` 状态增加内侧高光、细描边和轻微外投影；`solid` 按填充色使用单独且更清晰的层次。`borderless` 静止时保持透明且无阴影，在 hover 和 active 出现背景时使用与 `light` 相同的细边缘层次。`outline`、禁用按钮与 ButtonGroup 保持原有阴影。独立且 `bordered` 的 Card 只使用较淡的边缘效果，包括 `shadows="always"` 与 `shadows="hover"` 的悬浮状态，不再叠加原有的大阴影；无边框卡片与 CardGroup 网格仍沿用组件原有样式。颜色随浅色、深色及局部主题切换，组件尺寸、背景色和焦点轮廓不变。

Dropdown、Popover 与复用 Popover 容器的 Popconfirm 和选择面板增加极淡的内侧边缘，保留原有的浮层外投影。Tooltip 按自身明暗背景使用独立边缘效果，不增加外投影。普通 Modal 仅补更弱的内侧高光，保留实体边框与外投影；全屏 Modal 沿用原样。遮罩、箭头与浮层内部控件不增加容器阴影。

先安装可选主题：

```sh
pnpm add @aifuxi/semi-theme-modern
```

然后在应用入口中先导入组件库默认主题，再导入本包：

```ts
import '@aifuxi/semi-theme-default';
import '@aifuxi/semi-theme-modern';
```

本包覆盖浅色、深色以及 Semi 的 `semi-always-light` / `semi-always-dark` 局部主题变量。若不导入本包，默认主题样式保持不变。
