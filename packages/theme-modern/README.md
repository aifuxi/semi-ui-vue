# @aifuxi/semi-theme-modern

本包是 Semi UI Vue 的可选现代主题样式，覆盖默认主题的圆角变量，并为 Button 与 Card 增加轻微的内侧层次。它不是 Semi Design 官方发布的主题。

圆角比例如下：

| Semi token                         |     值 |
| ---------------------------------- | -----: |
| `--semi-border-radius-extra-small` |  `4px` |
| `--semi-border-radius-small`       |  `8px` |
| `--semi-border-radius-medium`      | `16px` |
| `--semi-border-radius-large`       | `24px` |

圆形和胶囊圆角沿用默认主题的 `50%` 与 `9999px`。

Button 的 `solid`、`light` 状态增加内侧高光、细描边和轻微外投影；`outline`、`borderless`、禁用按钮与 ButtonGroup 保持原有阴影。独立且 `bordered` 的 Card 增加更淡的边缘效果，`shadows="always"` / `shadows="hover"` 仍保留原有悬浮阴影；无边框卡片与 CardGroup 网格不增加内描边。颜色随浅色、深色及局部主题切换，组件尺寸、背景色和焦点轮廓不变。

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
