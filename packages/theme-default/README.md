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

本包的样式以编译后的 CSS 发布，不要求消费者初始化上游 submodule 或安装 Sass。独立颜色工具通过 `./colors` 子路径提供，不会在导入默认 CSS 时执行。

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

## 品牌颜色生成器

从 `@aifuxi/semi-theme-default/colors` 独立导入零依赖 ESM 和 TypeScript 类型。工具在 Node、浏览器和 SSR 中均可使用，不读取 DOM、不自动注入样式；消费者无需 Sass、上游 submodule 或专用构建插件。

```js
import { writeFile } from 'node:fs/promises';
import { createColorTheme, colorThemeToCss } from '@aifuxi/semi-theme-default/colors';

// 由业务主动生成品牌主题；默认 index.css 不调用生成器。
const theme = createColorTheme({ brand: '#7c3aed' });
// 模式选择器由应用明确提供；此处沿用 Semi 的全局 theme-mode 属性。
const css = colorThemeToCss(theme, {
  selectors: { light: 'body', dark: 'body[theme-mode="dark"]' },
});
// 作为普通 CSS 保存，在默认主题之后加载即可；无需接入构建插件。
await writeFile('brand.css', css);
```

### API 与数据契约

| API                                     | 输入与默认值                                                        | 输出                                                          |
| --------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| `generateColorScale(color, options?)`   | 不透明 `#RGB` / `#RRGGBB`；`options.mode` 默认 `light`，可选 `dark` | 只读十级 HEX 序列，下标为 `0…9`                               |
| `generateColorPalette(brand, options?)` | 同上；品牌色须具有非零饱和度                                        | 17 组命名色阶                                                 |
| `createColorTheme({ brand })`           | 品牌色须具有非零饱和度                                              | `version: 1`、规范化 `brand`、双模式 `palette` 与 `variables` |
| `colorThemeToCss(theme, { selectors })` | 必须明确提供非空 `light`、`dark` CSS 选择器                         | 稳定的普通 CSS 字符串                                         |

颜色输出统一为小写六位 HEX。色盘包含 `red`、`pink`、`purple`、`violet`、`indigo`、`blue`、`light-blue`、`cyan`、`teal`、`green`、`light-green`、`lime`、`yellow`、`amber`、`orange`、`grey` 和独立 `brand`。每个模式包括 160 个传统基础色及 10 个品牌色。

`palette.light/dark` 保存 HEX 色阶；`variables.light/dark` 保存 CSS 变量名到字符串值的映射。基础色仍为 `--semi-blue-5: 0, 119, 250` 这类 RGB 通道串，品牌色增加 `--semi-brand-0…9`；语义色使用 `rgba(var(--semi-brand-5), 1)` 等现有格式。结果可直接 JSON 序列化；返回数据不与其他调用共享可变状态。

格式错误或非法模式抛出 `TypeError`。单色阶支持灰、黑、白；整盘遇到无色相品牌色抛出 `RangeError`，避免参考算法的无色相轮盘退化。首期不接受 alpha、颜色名、`var()`、`currentColor`、手工锁色或可调算法参数。

### 语义与固定默认值

- primary、link、focus-border 引用独立 `brand`；info 继续引用 `blue`，secondary 引用 `light-blue`，success/danger/warning 分别引用 green/red/orange，灰阶语义引用 grey。
- 状态级别、透明度及深浅模式差异取自固定 Semi `v2.102.0`。浅色 primary 默认/hover/active 引用品牌 `5/6/7`；深色浅版背景引用品牌第 5 级与基线透明度。
- AI 渐变、数据可视化专用色、背景及浮层阴影沿用固定基线的规则和值。颜色主题不输出排版、圆角或布局覆盖。
- 算法参考固定 DSM 发布脚本，独立实现 HSV、取整及色轮排序；它不等同于仓库保存的默认色盘。例如算法 `#0077fa` 的浅色第 5 级是 `0,119,250`，固定默认 `--semi-blue-5` 是 `0,100,250`。导入工具或创建主题均不会改写默认 CSS；只有业务加载生成结果才启用品牌主题。

### 局部主题与强制模式

局部颜色边界同时明确主题名称和模式，例如 `<section data-semi-theme="brand" theme-mode="light">`，序列化时分别提供 `[data-semi-theme="brand"][theme-mode="light"]`、`[data-semi-theme="brand"][theme-mode="dark"]`。模式由业务设置，不隐式跟随系统偏好；嵌套边界也明确模式。

生成 CSS 在每个模式边界同时声明基础色盘和语义变量，防止只修改基础色而语义颜色仍使用祖先的计算结果。普通业务 CSS 在生成主题后覆盖；组件自身覆盖遵循正常级联，不需要 `!important`。

输出包含私有 `--semi-theme-light-*` / `--semi-theme-dark-*` 双模式载体，用于 `.semi-always-light` / `.semi-always-dark` 消费最近主题的颜色。这些载体名称不是可定制的公开入口；业务修改完整主题时重新生成结果即可。

默认 body 弹层桥接源位置的颜色、排版与模式，并跟随主题变化。显式 `getPopupContainer` 使用实际容器主题；关闭、取消边界或卸载后撤回桥接属性。Toast、Notification 等独立实例沿用已有容器配置。纯颜色变化不改变 Typography 的排版签名。

算法与语义验收见 `scripts/color-palette.spec.mjs`、`scripts/color-theme.spec.mjs`，冻结参考数据及来源见[参考说明](../../scripts/fixtures/semi-color-reference.md)。浏览器验收使用真实 tarball 的 `tests/consumer/color-theme.spec.ts`，涵盖深浅模式、局部嵌套、强制模式、运行时更新与弹层容器。

## 许可与归属

项目代码使用 MIT License。Semi Design 的原始 MIT 许可、第三方声明和 SPDX 2.3 SBOM 随包发布，详见 `dist/THIRD_PARTY_NOTICES.md`、`dist/THIRD_PARTY_LICENSES/` 与 `dist/SBOM.spdx.json`。
