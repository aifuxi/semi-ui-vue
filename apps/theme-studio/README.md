# Theme Studio

面向当前 `@aifuxi/semi-ui-vue` 的独立主题工作台。它是 monorepo 内的私有 Vue/Vite 应用，与 `apps/docs` 平级，不依赖文档站布局、DemoBlock、路由或状态。

## 启动与构建

在仓库根目录使用 mise 锁定的 Node/pnpm 环境：

```sh
# 首次运行或公开包源码变化后，准备实际消费的公开包与编译 CSS。
pnpm theme-studio:prepare
# 独立开发服务；严格使用 4322，端口占用时直接报错。
pnpm theme-studio:dev
# 类型检查并生成 apps/theme-studio/dist，可单独静态托管。
pnpm theme-studio:build
# 正式 Chromium 生产页面回归；自动使用 4324，不占用开发端口。
pnpm test:theme-studio
```

开发入口为 `http://localhost:4322/#/tokens`。WebStorm 可复用 `pnpm theme-studio:dev` 运行配置。`package.json` 的应用身份为 `@workspace/theme-studio`，`private: true`，不进入 npm 发布；`preview` 使用 4322，`clean` 只移除本应用 dist。构建使用普通 Vue/Vite 插件，用户定制主题不需要 Sass 或专用主题插件。

`base: './'` 与 hash 路由支持独立域名或静态子目录部署，无需服务器配置 history 回退。文档站通过构建环境变量 `VITE_THEME_STUDIO_URL` 配置工作台部署根地址；不设置时指向上述本地服务。开发与正式测试均不隐式重建公开包，冷启动先执行 prepare；源码类型检查通过 tsconfig paths 指向 workspace 自有源码，运行页面仍通过真实公开 exports 消费已构建的包。

## 首期能力

| 路由            | 能力                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| `/#/tokens`     | 品牌预设、任意不透明 HEX、ColorPicker、深浅模式、字体/字号/字重/行高、局部主题 |
| `/#/components` | 独立组件编辑面板；首期支持 Button 字号、字重、行高覆盖，颜色继承所属主题       |
| `/#/preview`    | 使用同一会话的组件、局部继承、默认 Tooltip/Modal 和固定基线对照                |

全局默认颜色与排版固定对齐 Semi `v2.102.0`。用户主动选品牌或输入合法 HEX 后才调用公开颜色生成器，固定基线从不通过算法重建。HEX 仅支持 `#RGB`、`#RRGGBB`，无色相品牌或格式错误显示反馈并保留上一次有效主题。颜色选择器关闭 alpha，字体选项只使用本机字体栈，不下载字体。

排版基线为正文 `14px/20px`、常规字重 400、强调字重 600、四级标题 `20px/28px`；编辑器的 px 和字重范围用于保证预览可操作，不代表公开 CSS API 限制。正文行高不改变 Input/Select 高度，Button 组件覆盖只作用于预览操作按钮，不改变点击区域。

应用只对预览容器设置 `data-semi-theme`、`theme-mode`、class 和公开 CSS 变量，不修改 body、html 或系统主题。局部边界可独立编辑或完全关闭继承；局部不额外提供“固定默认色盘”伪选项，以免把继承的品牌载体误标为默认值。固定浅色基线与品牌主题为兄弟容器，始终独立。

默认 Tooltip/Modal 使用组件默认 Portal 容器。Tooltip 可以保持打开并通过外侧编辑区更新；Modal 内提供模式、品牌预设和字号控制，验证打开时同步。关闭或离开路由时由组件正常释放弹层及桥接属性。路由切换保留当前主题，刷新页面开启新会话；“复原主题”也丢弃未生效的 HEX 草稿。

所有编辑与预览交互控件及图标均来自当前公开 Vue 包。此应用不提供云端保存、主题发布、Figma 接入或圆角、间距、阴影编辑。颜色 API 与变量契约见[默认主题包说明](../../packages/theme-default/README.md)。

## 参考与验证

交互结构参考 [Semi DSM](https://semi.design/dsm/web_console/tokens?dsmID=31334) 的全局样式、组件样式和预览分区，采用 AIFUXI 自有外壳；运行行为与默认变量只以仓库固定 Semi `v2.102.0` 为基线。

`playwright.theme-studio.config.ts` 使用完整 Chromium 新 headless、3 workers、0 retries。测试覆盖品牌与默认色差异、输入反馈、颜色选择器、排版、组件覆盖、局部隔离/继承、弹层打开中更新与清理，以及 390、768、1024、1440 四档实际页面布局。截图和报告进入已忽略的 `test-results` / `playwright-report`。
