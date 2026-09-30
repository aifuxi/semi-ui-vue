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

## 许可与归属

项目代码使用 MIT License。Semi Design 的原始 MIT 许可、第三方声明和 SPDX 2.3 SBOM 随包发布，详见 `dist/THIRD_PARTY_NOTICES.md`、`dist/THIRD_PARTY_LICENSES/` 与 `dist/SBOM.spdx.json`。
