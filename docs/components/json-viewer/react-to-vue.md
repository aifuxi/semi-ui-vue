# JsonViewer React → Vue 迁移

| React v2.102.0                                        | Vue                                                                  | 说明                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| `import { JsonViewer } from '@douyinfe/semi-ui'`      | `import { JsonViewer } from '@aifuxi/semi-ui-vue'`                   | 根导出与 `json-viewer` 子路径同名                |
| `value` + `onChange`                                  | `v-model`，或 `:value` + `@change` / `@update:value`                 | 事件载荷为当前文本，顺序 `change → update:value` |
| `width` / `height`                                    | 同名 prop                                                            | 缺省 `400`，数字按 px                            |
| `showSearch` / `limitSearchButtonBounds`              | 同名 prop                                                            | 搜索栏与按钮边界行为不变                         |
| `options`                                             | 同名 prop（Vue 自包含类型 `JsonViewerOptions`）                      | 深变化重建 core/Worker，保留固定默认值           |
| `options.customRenderRule`                            | 同名                                                                 | `render` 返回 VNode 或 HTMLElement               |
| `renderSearchButton`                                  | `#searchButton="{ defaultSearchButton, controls }"`，或同名函数 prop | slot 优先；`controls` 与固定 SearchControls 对齐 |
| `renderTooltip`                                       | 同名函数 prop（保留类型）                                            | 固定基线同样不触发该回调，Vue 不额外接通         |
| `className` / `style`                                 | Vue 原生 `class` / `style`，并保留同名兼容 prop                      | 根 class 与 Token 不变                           |
| 实例方法（`getValue`/`format`/`search`/`replace` 等） | 组件 ref 暴露同名方法                                                | React class 实例语义映射为 Vue `expose`          |
| 内部 Worker（`%WORKER_RAW%` bundle）                  | Vite `?worker&inline` 内联，协议与逻辑仍来自固定 vendor              | 产物自包含，不产生额外 worker 文件请求           |

Vue 追加的原生能力（不改变固定基线行为）：

- `#searchButton` scoped slot 与同名函数 prop 并存，模板与脚本写法都可自定义搜索入口。
- 搜索选项按钮以 `aria-pressed` 表达激活态，图标按钮的 `aria-label` 与 LocaleProvider 文案一致；这是 Vue 原生可访问映射，不改 class/视觉结构。
- `update:value` 便于 `v-model` 使用，Semi 的 `change` 载荷与顺序保持不变。

完整公开契约与证据见[对齐矩阵](./alignment.md)。
