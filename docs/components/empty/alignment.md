# Empty v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 Dropdown；Empty 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件，不是按字母顺序临时选择。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`vendor/semi-design/packages/semi-ui/empty/index.tsx`。
- 常量、样式与 RTL：`vendor/semi-design/packages/semi-foundation/empty/constants.ts`、`variables.scss`、`empty.scss`、`rtl.scss`。
- 默认主题与 Token：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`。
- 文档与行为证据：`vendor/semi-design/content/show/empty/index.md`、`index-en-US.md`、`vendor/semi-design/packages/semi-ui/empty/__test__/empty.test.js`。
- Empty 只复用已进入 `ready` 的 Typography、Button、ConfigProvider 与默认主题；`image`/`darkModeImage` 接受调用方提供的图片、SVG 或任意 VNode，不依赖尚未发布插画资产。它没有 Foundation JavaScript 状态机、Portal、定位或后续组件依赖，可独立形成完整切片。

## Vue 组件边界

| 文件                   | 单一职责                                                        | 契约                                     |
| ---------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `Empty.vue`            | 组合图片、标题、描述和操作区，并在客户端跟踪 `body[theme-mode]` | props、命名 slots、默认 slot、原生 attrs |
| `EmptyNodeRenderer.ts` | 原样承载 prop 或 slot 产生的 `VNodeChild`                       | Empty 内部                               |
| `types.ts`             | 定义 Vue 原生公开 props/slots 与图片描述对象                    | 根入口和 `empty` 子路径导出              |
| `index.ts`             | 提供 Empty 默认/具名导出                                        | 根入口和 `empty` 子路径                  |

固定源码没有 Empty Foundation 类；不得增加无状态的私有 Foundation 包入口。主题仍直接从固定 Foundation SCSS 编译，公开运行时和声明不得引用 `vendor/**` 或私有包路径。

## API、默认值与 Vue 映射

| Semi React v2.102.0 | 默认值     | Vue 契约                                              | 对齐门禁                                                                                                |
| ------------------- | ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `layout`            | `vertical` | `'vertical' \| 'horizontal'`                          | 根 class 为 `.semi-empty-{layout}`                                                                      |
| `image`             | 无         | `VNodeChild \| EmptySvgNode` prop 或 `#image`         | slot 优先；字符串生成原生 `img`，含 `id` 键的描述对象生成 `svg > use`，其余节点原样渲染                 |
| `darkModeImage`     | 无         | `VNodeChild \| EmptySvgNode` prop 或 `#darkModeImage` | slot 优先；仅存在暗色图片时启动 body observer；`theme-mode="dark"` 选择暗色图片                         |
| `imageStyle`        | 无         | Vue `StyleValue`                                      | 仅落在 `.semi-empty-image`                                                                              |
| `title`             | 无         | `VNodeChild` prop 或 `#title`                         | slot 优先；有图片时 Typography Title `heading=4`，无图片时 `heading=6` 且内联 `font-weight: 400`        |
| `description`       | 无         | `VNodeChild` prop 或 `#description`                   | slot 优先；字符串图片的 alt 仅在最终描述是字符串时取描述，否则为 `empty`                                |
| `children`          | 无         | 默认 slot                                             | 有可渲染内容时生成 `.semi-empty-footer`                                                                 |
| `className`         | 无         | 兼容 prop；优先使用 Vue 原生 `class`                  | 与 `.semi-empty`、布局 class 合并                                                                       |
| `style`             | 无         | Vue `StyleValue` prop；Vue 原生 style 由 attrs 合并   | 落在根节点                                                                                              |
| `data-*`            | 无         | Vue attrs                                             | 固定 React `getDataAttr` 只选择 data attrs；Vue 同时保留原生 `aria-*` 和 DOM 监听器，不制造额外组件事件 |

`title`、`description` 与 footer 使用固定 React truthy 语义：`null`、`undefined`、`false`、空字符串、空 slot、注释节点和空文本不生成对应 wrapper；数值 `0` 也不生成 wrapper。图片 wrapper 与 content wrapper始终存在。
图片分支先按类型判断：空字符串仍是字符串，因此会生成 `src=""` 的 `img`，并使标题使用 `heading=4`；这与 title/description/footer 的 truthy 分支不同。

## DOM、class 与事件顺序

```text
<div.semi-empty.semi-empty-{layout}>
  <div.semi-empty-image x-semi-prop="image,darkModeImage">
    img | svg[aria-hidden=true] > use | custom VNode | empty
  </div>
  <div.semi-empty-content>
    <h4|h6.semi-typography.semi-empty-title x-semi-prop="title">...</h4|h6>?
    <div.semi-empty-description x-semi-prop="description">...</div>?
    <div.semi-empty-footer x-semi-prop="children">...</div>?
  </div>
</div>
```

- 根节点没有固定 click、keyboard 或 focus 状态；原生监听器通过 Vue attrs 落到根节点，保持浏览器事件顺序。
- 字符串图片生成 `<img alt="{string description | empty}" src="...">`。
- SVG 描述对象按固定源码只读取 `id`，输出 `<svg aria-hidden="true"><use xlink:href="#id" /></svg>`；`viewBox` 与 `url` 是上游公开类型字段，但固定运行时不读取。
- 自定义图片节点不被克隆或装饰；调用方负责其内部 ARIA。
- `x-semi-prop` 调试属性保持固定 Adapter 值。

## 状态、生命周期与暗色

| 主题       | 固定行为                                                                | Vue 门禁                                                  |
| ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| 初始 light | 当前 body 没有 `theme-mode="dark"` 时使用 `image`                       | mounted 后读取 body 属性；首帧/SSR 不访问 DOM             |
| 初始 dark  | mounted 后同步切换到 `darkModeImage`                                    | 首次 observer 前执行同步读取，不等待 mutation             |
| 运行时切换 | `MutationObserver` 监听 `document.body` attributes，仅响应 `theme-mode` | theme-mode 改变后切图；其它 body 属性不改变选图           |
| 卸载       | 固定 Adapter disconnect observer                                        | observer 与 body 引用完整清理，卸载后 mutation 不触发更新 |
| 无暗色图   | 不创建 observer                                                         | dark 主题仍显示 `image`                                   |

暗色模式不改变组件状态之外的 DOM 结构；默认主题 Token 驱动文字颜色。图片从 light 切到 dark 时不产生额外动画。

## 样式、几何与 RTL

- `.semi-empty` 为 flex。
- vertical：column + 居中；content `margin-top: 24px`；标题/描述居中。
- horizontal：content `margin-left: 32px`；RTL 祖先 `.semi-rtl`/`.semi-portal-rtl` 下改为 `margin-left: auto; margin-right: 32px`。
- 标题为 block、默认 `font-weight: 600`；无图片时 Adapter 的内联 `font-weight: 400` 覆盖。
- 标题后描述 `margin-top: 16px`；footer `margin-top: 24px`；描述颜色 `var(--semi-color-text-1)`。
- 逐组件 `empty.css` 同时包含 Empty 与 Typography 样式，消费者不需要额外导入 Typography CSS。

## 可访问性、国际化与 SSR

| 维度        | 契约                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 键盘/焦点   | Empty 自身不创建 focusable 节点或键盘处理；footer 内交互由调用方组件负责                                                                      |
| ARIA        | 描述对象 SVG 为 `aria-hidden="true"`；字符串图片 alt 取字符串 description，否则为 `empty`；根节点可接收 Vue 原生 `role`/`aria-*`              |
| 国际化      | 组件没有内置 locale 文案；场景中英文参数使用相同固定文案，不依赖 57 Locale 数据                                                               |
| Portal/动效 | 不适用；没有 Teleport、Portal、弹层和过渡                                                                                                     |
| SSR         | import/setup 不读取 window、document 或 MutationObserver；服务端稳定渲染 light image，hydration mounted 后按 body 主题同步切换并建立 observer |

## 测试与验收矩阵

- 单元：默认/水平布局、class/style/data/aria attrs、字符串/VNode/SVG 描述图片、imageStyle、标题 heading 分支、description/footer truthy 分支、命名 slot 优先级、字符串 alt、初始 dark、运行时 light/dark 切换、无暗色图不观察、卸载清理。
- SSR：根/`empty` 子路径 import 安全；默认 DOM；light image；无 observer/DOM 副作用；包含标题、描述和 footer 时结构稳定。
- React/Vue 参考场景：图片 + 标题 + 描述 + footer、无图片、水平布局、字符串图片和 SVG 描述对象；桌面 `1440×900`、移动 `390×844`，light/dark 与 RTL。
- computed style：根、图片、内容、标题、描述、footer、水平 content 的 display、direction、font、颜色、间距和尺寸逐节点精确比较。
- geometry：所有 parity target 的 bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；React/Vue 裁剪截图另做像素缓冲区比较，只有比较结果为 0 才报告字节像素一致。
- 发布：根/子路径 ESM 与声明、`empty.css`、tree-shaking、SSR-safe import、tarball 离线安装、许可证、第三方声明和 SBOM。

## Deviation

当前没有 accepted deviation。`viewBox`/`url` 在公开 `EmptySvgNode` 中保留但运行时不读取，是固定 v2.102.0 Adapter 的既有行为，不属于 Vue 偏差。Vue 额外允许原生 `aria-*`、`role` 与 DOM 监听 attrs，是 React 属性向 Vue 原生属性模型的等价迁移，不改变缺省 DOM。

## 验收状态

- 当前状态：`ready`；没有 accepted deviation。
- 行为门禁：Empty 单元与 SSR 共 2 个文件、9 个测试通过；仓库单元门禁 70 个文件、519 个测试通过。
- 视觉门禁：Empty 的固定来源、DOM/暗色切换/样式/几何、四组 light/dark 桌面与移动截图、RTL 共 7 个 Chromium 用例通过；5 组 React/Vue 裁剪截图逐缓冲区一致。仓库浏览器门禁 273 个用例通过。
- 发布门禁：根入口与 `empty` 子路径的 ESM、类型声明、SSR import、根主题与 `empty.css`、真实 tarball 安装、exports、许可证、第三方声明和 SBOM 验证通过。
- 总门禁：`pnpm check:full` 通过。
