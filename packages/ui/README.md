# @aifuxi/semi-ui-vue

面向 Vue 3.5+、以 Semi Design `v2.102.0` 为固定参考基线的独立组件库实现。

> 当前为 `0.1.0-alpha.1` 预览版，只完成了仓库 README 所列的组件范围，API 和发布结构在 `1.0.0` 前仍可能调整。本项目不是 Semi Design 官方 Vue 版本，也不代表 DouyinFE 的授权、合作或品牌身份。

## 安装

```bash
pnpm add @aifuxi/semi-ui-vue@next @aifuxi/semi-theme-default@next
```

```ts
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
```

主包是 ESM-only，要求 Vue `>=3.5.0`。可以从根入口导入，也可以使用 `exports` 中列出的组件子路径。

## 许可与归属

本实现使用 MIT License。发布包同时携带 Semi Design v2.102.0 及实际运行时依赖的许可证、第三方声明和 SPDX 2.3 SBOM，详见 `dist/THIRD_PARTY_NOTICES.md` 与 `dist/THIRD_PARTY_LICENSES/`。
