---
title: 'Customized Themes 定制主题'
description: '使用普通 CSS 定制排版，并通过独立颜色生成器创建深浅模式品牌主题。'
type: 'advanced'
order: 4
icon: 'doc-theme'
---

## 从默认主题开始

Semi UI Vue 的默认主题固定对齐 Semi Design `v2.102.0`。导入默认 CSS 后，使用普通 CSS 自定义属性调整排版，或使用独立颜色生成器创建品牌主题。用户侧无需编写 SCSS、安装 Sass 或配置专用 Vite/Webpack 插件。

```ts
// 默认主题先加载，业务主题随后参与正常 CSS 级联。
import '@aifuxi/semi-theme-default/index.css';
import './brand.css';
```

只导入颜色工具或调用生成函数不会修改页面。默认 CSS 不调用生成器；只有加载业务生成的 CSS 才启用品牌颜色。

## 交互预览

切换品牌色、预览模式和局部主题，观察按钮、输入框、文字与弹层的变化。排版调整通过公开 CSS 变量生效；变化只作用于预览区，不修改文档导航或站点全局主题。

<DemoBlock title="品牌与排版主题" id="zh-CN-advanced-theme-playground" kind="live" />

## CSS 排版主题

排版主题公开字体、字号、字重和行高。可以在 `body` 上全局配置，也可以使用 `data-semi-theme` 标记局部边界。示例只调整编辑区，组件尺寸、图标和点击区域仍沿用默认设置。

```css
/* 局部共享排版，未声明的变量继续继承外层。 */
[data-semi-theme='editor'] {
  --semi-font-family-regular: 'Microsoft YaHei', sans-serif;
  --semi-font-size-regular: 16px;
  --semi-line-height-regular: 24px;
  --semi-font-weight-strong: 700;
}

/* 组件覆盖优先于共享字号，仅收紧这个按钮的文字。 */
[data-semi-theme='editor'] .compact-action {
  --semi-button-font-size: 13px;
}
```

```vue
<script setup lang="ts">
import { Button, Typography } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <!-- 边界同时供局部继承、弹层桥接和省略测量识别。 -->
  <section data-semi-theme="editor">
    <Typography.Text>使用编辑区排版</Typography.Text>
    <Button class="compact-action">紧凑操作</Button>
  </section>
</template>
```

### 默认字号与行高

| 字号变量                    | 默认字号 | 行高变量                      | 默认行高 |
| --------------------------- | -------- | ----------------------------- | -------- |
| `--semi-font-size-small`    | `12px`   | `--semi-line-height-small`    | `16px`   |
| `--semi-font-size-regular`  | `14px`   | `--semi-line-height-regular`  | `20px`   |
| `--semi-font-size-header-6` | `16px`   | `--semi-line-height-header-6` | `22px`   |
| `--semi-font-size-header-5` | `18px`   | `--semi-line-height-header-5` | `24px`   |
| `--semi-font-size-header-4` | `20px`   | `--semi-line-height-header-4` | `28px`   |
| `--semi-font-size-header-3` | `24px`   | `--semi-line-height-header-3` | `32px`   |
| `--semi-font-size-header-2` | `28px`   | `--semi-line-height-header-2` | `40px`   |
| `--semi-font-size-header-1` | `32px`   | `--semi-line-height-header-1` | `44px`   |

字号与行高独立配置。宽松段落使用 `--semi-line-height-paragraph-extended`，默认为 `24px`；业务可以使用标准 `calc()` 建立自己的比例关系。

### 字体与字重

| 变量                                   | 默认值或回退行为                                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--semi-font-family-regular`           | `"Inter", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif` |
| `--semi-font-family-monospace`         | 默认不声明，各代码组件保留原有等宽字体栈；设置后统一覆盖                                                                                                       |
| `--semi-font-weight-regular`           | `400`，用于原本明确指定常规字重的位置                                                                                                                          |
| `--semi-font-weight-strong`            | `600`，用于默认强调语义                                                                                                                                        |
| `--semi-typography-font-weight`        | 默认不声明，普通 Text 保留父级继承                                                                                                                             |
| `--semi-typography-title-font-weight`  | 回退到 `--semi-font-weight-strong`                                                                                                                             |
| `--semi-typography-link-font-weight`   | 回退到 `--semi-font-weight-strong`                                                                                                                             |
| `--semi-typography-strong-font-weight` | 回退到 `--semi-font-weight-strong`                                                                                                                             |

字体文件由业务加载，主题包不下载字体。`Title weight="bold"` 的 `700`、其他命名字重和数值型 `weight` 保留原 API 的显式含义。

### 组件消费与覆盖优先级

| 消费位置                  | 共享入口或组件覆盖                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Typography normal / small | regular / small 字号与行高                                                                             |
| Typography heading        | 对应 header-1 至 header-6 字号与行高                                                                   |
| Button                    | regular；可用 `--semi-button-font-size`、`--semi-button-font-weight`、`--semi-button-line-height` 覆盖 |
| Button small              | small；尺寸覆盖为 `--semi-button-small-font-size` 等                                                   |
| Input / Select            | 字体与字号使用原共享语义；垂直对齐行高继续由控件尺寸决定                                               |
| Table                     | 原表格语义；字号可用 `--semi-table-base-font-size` 覆盖                                                |
| Modal 标题                | 原版 `Typography.Title heading=5`，默认 `18px/24px`                                                    |

共享变量 → 组件变量 → 尺寸级变量构成消费处的回退链。例如 Button small 的字号优先使用尺寸级覆盖，其次通用 Button 覆盖，最后回退到共享字号。组件别名不在根节点提前计算，因此局部覆盖可以正确继承。

同一元素的变量声明仍遵循普通 CSS 级联。直接组件样式和显式字重保留原优先级；Typography 数值型 `weight` 继续覆盖同一组件的 `style.fontWeight`。通常无需 `!important`。

其他组件的独立排版变量沿用原变量语义，下划线转短横线，camelCase 转 kebab-case。修改正文行高不会自动改变 Input/Select 控件高度，代码块也保留自己的默认行高。

## 品牌颜色生成器

颜色工具从独立子路径导入，提供零依赖 ESM 与 TypeScript 类型，可在 Node、浏览器和 SSR 中调用，不访问 DOM 或自动注入样式。

```js
import { writeFile } from 'node:fs/promises';
import { createColorTheme, colorThemeToCss } from '@aifuxi/semi-theme-default/colors';

// 品牌色生成深浅两套主题，默认组件样式不会执行这一步。
const theme = createColorTheme({ brand: '#7c3aed' });
// 全局模式沿用 body 的 theme-mode 属性；选择器由业务明确指定。
const css = colorThemeToCss(theme, {
  selectors: { light: 'body', dark: 'body[theme-mode="dark"]' },
});
// 保存普通 CSS，在默认主题之后加载即可；无专用构建插件要求。
await writeFile('brand.css', css);
```

### API 与输出

| API                                     | 输入与默认值                                                        | 输出                                                          |
| --------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| `generateColorScale(color, options?)`   | 不透明 `#RGB` / `#RRGGBB`；`options.mode` 默认 `light`，可选 `dark` | 只读十级 HEX 序列，下标为 `0…9`                               |
| `generateColorPalette(brand, options?)` | 同上，品牌色须具有非零饱和度                                        | 17 组命名色阶                                                 |
| `createColorTheme({ brand })`           | 品牌色须具有非零饱和度                                              | `version: 1`、规范化 `brand`、双模式 `palette` 与 `variables` |
| `colorThemeToCss(theme, { selectors })` | 必须明确提供非空 `light`、`dark` 选择器                             | 稳定的普通 CSS 字符串                                         |

色阶输出小写六位 HEX。色盘包含 red、pink、purple、violet、indigo、blue、light-blue、cyan、teal、green、light-green、lime、yellow、amber、orange、grey 和独立 brand，每种模式包含 160 个传统基础色及 10 个品牌色。

`palette.light/dark` 保存 HEX 色阶；`variables.light/dark` 保存 CSS 变量名到字符串值的映射。基础色仍采用 `--semi-blue-5: 0, 119, 250` 这样的 RGB 通道串；新增 `--semi-brand-0…9`，语义颜色使用 `rgba(var(--semi-brand-5), 1)` 等现有格式。主题结果可直接 JSON 序列化。

格式错误或非法模式抛出 `TypeError`。单色阶支持灰、黑、白；整盘遇到无色相品牌色抛出 `RangeError`。不接受 alpha、CSS 颜色名、`var()`、`currentColor`、手工锁色或可调算法参数。

### 语义映射与固定基线

| 语义颜色                    | 引用色阶             |
| --------------------------- | -------------------- |
| primary、link、focus-border | brand                |
| secondary                   | light-blue           |
| info                        | blue                 |
| success / danger / warning  | green / red / orange |
| tertiary、正文及灰阶填充    | grey，沿用基线映射   |

状态级别、透明度和深浅差异沿用固定 Semi `v2.102.0`。浅色 primary 默认、hover、active 引用品牌 `5/6/7`；深色浅版背景引用品牌第 5 级及基线透明度。AI 渐变、数据可视化专用色、背景和浮层阴影保留基线规则和值；颜色输出不包含排版、圆角或布局覆盖。

生成算法独立实现并对照固定 DSM 参考结果验收，生成色盘与保存的默认主题属于两个契约。例如输入 `#0077fa` 得到的浅色第 5 级是 `0,119,250`，默认 CSS 的 `--semi-blue-5` 则保持 `0,100,250`（`#0064fa`）。不要用生成器重新生成默认主题。

## 局部主题、弹层与动态更新

排版默认值只在 `body` / `:host` 定义。局部排版通过 `data-semi-theme` 标记，并列或嵌套边界可以只覆盖部分变量，其余继承外层；深浅模式和 `.semi-always-light` / `.semi-always-dark` 不重置排版。

局部颜色主题同时声明名称和模式，例如 `<section data-semi-theme="brand" theme-mode="light">`。生成 CSS 时明确提供对应选择器：

```js
import { createColorTheme, colorThemeToCss } from '@aifuxi/semi-theme-default/colors';

// 两种模式都限定在同一个局部主题边界，避免覆盖站点导航等相邻区域。
const localTheme = createColorTheme({ brand: '#e8590c' });
const localCss = colorThemeToCss(localTheme, {
  selectors: {
    light: '[data-semi-theme="brand"][theme-mode="light"]',
    dark: '[data-semi-theme="brand"][theme-mode="dark"]',
  },
});
// 将返回值作为普通 CSS 保存或由应用加载；生成器本身不注入页面。
```

每个局部颜色边界及嵌套边界都明确模式，不隐式跟随系统或文档站模式。输出在同一边界声明基础色盘和语义变量，避免只覆盖基础色后仍继承祖先已计算的语义颜色。`.semi-always-light` / `.semi-always-dark` 可在其内部切换到当前品牌的另一套模式。输出中的 `--semi-theme-light-*` / `--semi-theme-dark-*` 是私有模式载体，业务通过公开变量或重新生成主题定制颜色。

默认挂到 body 的声明式弹层沿用声明位置或触发源的局部颜色、排版和模式，并跟随主题更新。显式 `getPopupContainer` 优先，使用实际容器主题。Toast、Notification 等独立命令式实例默认使用全局主题，可通过现有容器配置指定局部主题；关闭、取消边界或卸载后撤回由桥接写入的属性。

Typography 省略测量读取当前计算样式及真实强调字重。主题边界的 class、style、`theme-mode`、`data-semi-theme`，以及样式表或字体加载变化后自动重算，固定宽度下的字体变化也会生效。纯颜色变化不改变排版签名；已展开的文本不会因纯排版变化自动收起。

全局和系统模式切换方式见[暗色模式](./dark-mode)。
