# @aifuxi/semi-theme-modern

本包是 Semi UI Vue 的可选现代主题样式，仅覆盖默认主题的圆角变量。它不是 Semi Design 官方发布的主题。

圆角比例如下：

| Semi token                         |     值 |
| ---------------------------------- | -----: |
| `--semi-border-radius-extra-small` |  `4px` |
| `--semi-border-radius-small`       |  `8px` |
| `--semi-border-radius-medium`      | `16px` |
| `--semi-border-radius-large`       | `24px` |

圆形和胶囊圆角沿用默认主题的 `50%` 与 `9999px`。

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
