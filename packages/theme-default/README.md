# @aifuxi/semi-theme-default

为 `@aifuxi/semi-ui-vue` 提供的 Semi Design `v2.102.0` 默认主题编译 CSS。

> 本包是独立 Vue 复刻项目的一部分，不是 Semi Design 官方主题包。

## 安装与使用

```bash
pnpm add @aifuxi/semi-theme-default@next
```

```ts
import '@aifuxi/semi-theme-default/index.css';
```

模块化导入时，先引入基础样式，再按依赖清单引入目标组件的 CSS。以下是 Button 的依赖示例：

```ts
import '@aifuxi/semi-theme-default/base.css';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/icon-button.css';
import '@aifuxi/semi-theme-default/icon.css';
```

其他组件的共享依赖路径和顺序见 `@aifuxi/semi-theme-default/style-dependencies.json`。多个组件共用的 CSS 只需导入一次；组件各自的 `.css` 只包含该组件的样式。不要将 `index.css` 与模块化样式同时导入。

本包只发布编译后的 CSS，不要求消费者初始化上游 submodule 或安装 Sass。

预览版使用 `next` 渠道，后续稳定版使用 `latest`；六个公开包同步升版。发布记录随包提供，见 [CHANGELOG](CHANGELOG.md)。

## CSS 排版主题

R-000072 为字体、字号、字重和行高提供公开 CSS 自定义属性。业务在默认主题之后导入普通 CSS 即可，无需编写 SCSS、安装 Sass 或配置专用 Vite/Webpack 插件。默认值继续使用固定 Semi `v2.102.0`，颜色生成器不属于本能力。

```css
/* 主题可以用于整个 body，也可以用于局部容器。 */
[data-semi-theme='editor'] {
  --semi-font-family-regular: 'Microsoft YaHei', sans-serif;
  --semi-font-size-regular: 16px;
  --semi-line-height-regular: 24px;
  --semi-font-weight-strong: 700;
}

/* 可选的组件覆盖只作用于按钮文字，不改变图标或控件高度。 */
[data-semi-theme='editor'] .compact-action {
  --semi-button-font-size: 13px;
}
```

```vue
<template>
  <!-- 标记是弹层与排版测量共同识别的局部主题边界。 -->
  <section data-semi-theme="editor">
    <Text>使用编辑区排版</Text>
    <Button class="compact-action">紧凑操作</Button>
  </section>
</template>
```

### 公开默认值

| 字号变量                    | 默认字号 | 对应行高变量                  | 默认行高 |
| --------------------------- | -------- | ----------------------------- | -------- |
| `--semi-font-size-small`    | `12px`   | `--semi-line-height-small`    | `16px`   |
| `--semi-font-size-regular`  | `14px`   | `--semi-line-height-regular`  | `20px`   |
| `--semi-font-size-header-6` | `16px`   | `--semi-line-height-header-6` | `22px`   |
| `--semi-font-size-header-5` | `18px`   | `--semi-line-height-header-5` | `24px`   |
| `--semi-font-size-header-4` | `20px`   | `--semi-line-height-header-4` | `28px`   |
| `--semi-font-size-header-3` | `24px`   | `--semi-line-height-header-3` | `32px`   |
| `--semi-font-size-header-2` | `28px`   | `--semi-line-height-header-2` | `40px`   |
| `--semi-font-size-header-1` | `32px`   | `--semi-line-height-header-1` | `44px`   |

字号和行高独立配置。宽松段落使用 `--semi-line-height-paragraph-extended`，默认为 `24px`；业务可用标准 `calc()` 建立自己的比例关系。

| 变量                                   | 默认值或回退行为                                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--semi-font-family-regular`           | `"Inter", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif` |
| `--semi-font-family-monospace`         | 默认不声明，各代码组件保留原有等宽字体栈；显式设置时统一覆盖                                                                                                   |
| `--semi-font-weight-regular`           | `400`，用于基线原本明确指定常规字重的位置                                                                                                                      |
| `--semi-font-weight-strong`            | `600`，用于基线默认强调语义                                                                                                                                    |
| `--semi-typography-font-weight`        | 默认不声明，普通 Text 保留父级继承；small、标题等仍有自己的语义                                                                                                |
| `--semi-typography-title-font-weight`  | 回退到 `--semi-font-weight-strong`                                                                                                                             |
| `--semi-typography-link-font-weight`   | 回退到 `--semi-font-weight-strong`                                                                                                                             |
| `--semi-typography-strong-font-weight` | 回退到 `--semi-font-weight-strong`                                                                                                                             |

字体文件由业务加载，本包不下载字体。`Title weight="bold"` 的 `700`、其他命名字重和数值型 `weight` 继续保留原 API 的显式含义。

### 消费与覆盖

- 共享字体与字号入口接入固定基线原有的排版引用链。Typography 的 normal/small、heading 和 spacing 选择对应语义；Button、Input、Select、Table、弹层等消费原有语义映射。
- 有组件独立语义的原变量提供对应 CSS 覆盖，例如 `--semi-button-font-size`、`--semi-button-font-weight`、`--semi-button-line-height`、`--semi-table-base-font-size`。原组件变量中的下划线转为短横线、camelCase 转为 kebab-case，例如 Button small 字号为 `--semi-button-small-font-size`。
- 组件覆盖优先于共享变量，Button 尺寸级覆盖又优先于通用 Button 覆盖。组件消费处建立 fallback，不在根节点预先计算组件别名，因此局部覆盖能正确继承。
- 直接的组件样式、数值型 `weight` 和命名字重保留现有优先级；同一元素上的变量声明仍遵循正常 CSS 级联，不需要 `!important`。数值型 `weight` 继续覆盖同一 Typography 的 `style.fontWeight`。
- Input/Select 用于垂直对齐的行高继续由控件尺寸决定；正文行高不会改变控件高度、图标尺寸或点击区域。代码块等具有独立排版的区域也保留原默认行高。
- Modal 的实际标题沿用原版 `Typography.Title heading=5`，默认 `18px/24px`，消费 header-5 排版变量；header 容器原有的 `14px` 并不是标题最终字号。

### 作用域、弹层与动态更新

默认排版变量仅在 `body` / `:host` 定义。局部容器以 `data-semi-theme` 标记；并列或嵌套主题可以只覆盖部分变量，其余继承外层。深浅模式及 `.semi-always-light` / `.semi-always-dark` 不重置排版设置。

默认挂到 `body` 的声明式弹层沿用声明位置或触发源的局部排版主题，并跟随源主题更新。显式 `getPopupContainer` 优先，使用实际容器的主题。Toast、Notification 等独立命令式实例默认使用全局主题，通过已有容器配置可以选择局部主题。

Typography 的省略测量使用当前计算样式及真实强调字重。主题边界的 class、style、`theme-mode`、`data-semi-theme` 变化、样式表加载和字体加载完成后自动重算；固定宽度下的字体变化也会使测量失效。未开启省略的文本不订阅测量更新，用户已展开的文本不会因纯排版变化自动收起。

## 许可与归属

项目代码使用 MIT License。Semi Design 的原始 MIT 许可、第三方声明和 SPDX 2.3 SBOM 随包发布，详见 `dist/THIRD_PARTY_NOTICES.md`、`dist/THIRD_PARTY_LICENSES/` 与 `dist/SBOM.spdx.json`。
