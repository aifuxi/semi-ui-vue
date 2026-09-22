# @aifuxi/semi-ui-vue

面向 Vue 3.5+、以 Semi Design `v2.102.0` 为固定参考基线的独立组件库实现。

> 当前通过 `next` 渠道提供预览版，组件范围以仓库 README 为准，API 和发布结构在稳定版验收前仍可能调整。本项目不是 Semi Design 官方 Vue 版本，也不代表 DouyinFE 的授权、合作或品牌身份。

## 安装

```bash
pnpm add @aifuxi/semi-ui-vue
```

```ts
import { Button } from '@aifuxi/semi-ui-vue/button';
```

主包是 ESM-only，要求 Vue `>=3.5.0`。可以从根入口导入，也可以使用 `exports` 中列出的组件子路径；浏览器构建会自动按需加载默认主题，并自动安装主题、稳定/Lab 图标与插画包。

预览版使用 `next` 渠道，后续稳定版使用 `latest`；五个公开包同步升版。发布记录随包提供，见 [CHANGELOG](CHANGELOG.md)。

## 许可与归属

本实现使用 MIT License。发布包同时携带 Semi Design v2.102.0 及实际运行时依赖的许可证、第三方声明和 SPDX 2.3 SBOM，详见 `dist/THIRD_PARTY_NOTICES.md` 与 `dist/THIRD_PARTY_LICENSES/`。
