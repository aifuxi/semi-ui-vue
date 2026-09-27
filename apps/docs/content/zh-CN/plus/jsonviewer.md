---
title: 'JsonViewer Json编辑器'
description: '用于展示和编辑 JSON 数据'
type: 'plus'
order: 32
icon: 'doc-jsonviewer'
---

## 使用场景

JsonViewer 组件可用于 JSON 数据的展示与编辑。
Semi 重点参考了 [VS Code](https://github.com/microsoft/vscode)的 text-buffer 数据结构设计思路，复用了部分 utils与数据类型定义（Token解析，语言服务等），结合我们的功能/样式定制需求，实现了 JsonViewer 组件, 视觉上会与 Semi Design 体系内的其他组件更协调，对于特定数据类型的定制化渲染定制会更方便。
相比于直接使用 MonacoEditor，Semi JsonViewer 在工程化构建上做了额外处理，使用更为简单，无需关注 Webpack插件、worker loader等复杂的配置。
同时由于我们仅关注 Json 数据格式，更轻量化，在开箱即用的同时，拥有更小的体积**（📦 -96%）**，更极致的加载速度**（🚀 -53.5%）**，更少的内存占用**（⬇️ 71.6%）**。
对于五百万行及以下的数据，均可以做到1s内完成数据加载与解析。
详细的对比数据可查阅 [Performance](#Performance) 章节

- 如果你仅需要对 Json 做预览/编辑，无需对更复杂的其他编程语言作修改，我们建议你选用 JsonViewer
- 如果你还需要处理其他格式的数据/代码文件，完整的代码编辑器能力（语法高亮、代码补全、错误提示、复杂编辑等）是刚需，构建产物体积不是关注重点，我们建议你选用 Monaco Editor

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/json-viewer` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

JsonViewer 从 v2.71.0 开始支持

<DemoBlock id="zh-CN-plus-jsonviewer-1" title="如何引入" kind="import" />

### 基本用法

JsonViewer 的基本用法。传入 height 和 width 参数，设置组件的高度和宽度和初始值。通过 value 传入 Json 字符串
JsonViewer 内部编辑器保持非受控；`value` prop 更新时会重建编辑器。可通过 `v-model:value` 同步编辑结果，或使用模板 ref 调用实例方法。

<DemoBlock id="zh-CN-plus-jsonviewer-2" title="基本用法" kind="live" />

### 设置行高

配置 options 的 lineHeight 参数，设置固定行高（单位：px，默认 20）。

<DemoBlock id="zh-CN-plus-jsonviewer-3" title="设置行高" kind="live" />

### 自动换行

配置 options 的 autoWrap 参数，设置为 true 时，组件会根据内容长度自动换行。

<DemoBlock id="zh-CN-plus-jsonviewer-4" title="自动换行" kind="live" />

### 格式化配置

配置 options 的 formatOptions 参数，设置组件的格式化配置。

- tabSize: number，设置缩进大小为4，表示每级缩进 4 个空格
- insertSpaces: boolean，true 表示使用空格进行缩进，false 表示使用制表符(Tab)
- eol: string，设置换行符，可以是\n，\r\n，

<DemoBlock id="zh-CN-plus-jsonviewer-5" title="格式化配置" kind="live" />

### 自定义渲染规则

通过配置 `options.customRenderRule` 参数，你可以自定义 JSON 内容的渲染方式（注意：仅在只读模式下生效）。

> **2.96.0 行为变更说明**
>
> 从 2.96.0 起，`customRenderRule` 在计算 `path` 时会更精确：**同一条键值对的 key token 与 value token 会拥有相同的 `path`**（即都对应到该属性所在的路径，例如 `root.`）。
>
> 因此，像 `path === 'root.'` 这类仅依赖 `path` 的规则，可能同时命中 key 和 value，导致与后续 value 匹配规则产生“覆盖/优先级”差异。
>
> 若你希望只匹配 key 或只匹配 value，请使用函数匹配的第三个参数 `tokenType`：
>
> ```ts
> const targetPath = 'root.';
> // 仅匹配 key
> match: (_value, path, tokenType) => tokenType === 'key' && path === targetPath;
> // 仅匹配 value
> match: (value, path, tokenType) => tokenType === 'value' && path === targetPath;
> ```

`customRenderRule` 是一个规则数组，每条规则包含两个属性：

- `match`: 匹配条件，可以是以下三种类型之一：
- 字符串：精确匹配
- 正则表达式：按正则匹配
- 函数：自定义匹配逻辑，函数签名为 `(value: string | number | boolean | null, path: string, tokenType: 'key' | 'value') => boolean`
- `value`: 待匹配的值（JSON 键或值）。当 `match` 为函数时，`value` 会尽量传入解析后的原始类型（number / boolean / null / string），因此可以使用 `===` 进行严格匹配；当 `match` 为字符串或正则时，仍基于文本内容匹配（字符串类型会去除两侧引号）
- `path`: 当前匹配到的路径，格式为 `root.key1.key2.key3[0].key4`
- `tokenType`: 当前 token 的类型，`'key'` 表示 JSON 键名，`'value'` 表示 JSON 值。可用于区分同名键和值的匹配
- `render`: 自定义渲染函数，函数签名为 `(content: string) => VNodeChild 或 HTMLElement`
- `content`: 匹配到的内容。如果是字符串类型的值，将包含双引号（如 `"name"`，`"Semi"`）

<DemoBlock id="zh-CN-plus-jsonviewer-6" title="自定义渲染规则" kind="live" />

### 自定义搜索按钮

可通过 `renderSearchButton` callback prop 或 `#searchButton` 作用域插槽自定义搜索按钮，实现固定位置或自定义样式。

<DemoBlock id="zh-CN-plus-jsonviewer-7" title="自定义搜索按钮" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/json-viewer/types.ts`、`packages/ui/src/json-viewer/index.ts` 的公开类型为准。

- `v-model:value` 对应 `value` 与 `update:value`。

#### Vue 用法

- `value` 更新会重建内部编辑器；编辑内容时依次触发 `change` 与 `update:value`。
- `renderSearchButton` 是保留的 callback prop；未提供时可使用 `#searchButton` 作用域插槽。
- `SearchControls.onXxx` 是传给渲染 callback / 插槽的控制器方法，不是组件事件。
- `options.customRenderRule[].match/render` 与 `renderTooltip` 是嵌套或顶层 callback props；`renderTooltip` 在固定 v2.102.0 中保持兼容 no-op。

#### Vue 实例方法

**JsonViewerExposed**

| 方法               | 签名                                                                                     | 说明                 |
| ------------------ | ---------------------------------------------------------------------------------------- | -------------------- |
| `getValue`         | () =&gt; string                                                                          | 获取当前值           |
| `format`           | () =&gt; void                                                                            | 格式化当前内容       |
| `search`           | (text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean) =&gt; void | 搜索文本             |
| `getSearchResults` | () =&gt; JsonViewerSearchResult[] \| undefined                                           | 获取当前搜索结果     |
| `prevSearch`       | (step?: number) =&gt; void                                                               | 导航到上一个搜索结果 |
| `nextSearch`       | (step?: number) =&gt; void                                                               | 导航到下一个搜索结果 |
| `replace`          | (text: string) =&gt; void                                                                | 替换当前搜索匹配项   |
| `replaceAll`       | (text: string) =&gt; void                                                                | 替换全部搜索匹配项   |

#### Vue 事件

**JsonViewer**

| 事件         | 参数            | 说明               |
| ------------ | --------------- | ------------------ |
| change       | [value: string] | 编辑器内容变化     |
| update:value | [value: string] | 更新 v-model:value |

#### Vue 插槽

**JsonViewer**

| 插槽         | 作用域参数                                                              | 说明           |
| ------------ | ----------------------------------------------------------------------- | -------------- |
| searchButton | { defaultSearchButton: VNodeChild, controls: JsonViewerSearchControls } | 自定义搜索按钮 |

### JsonViewer

| 属性                    | 说明                                                    | 类型                                                                                      | 默认值                                |
| ----------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| value                   | `v-model:value` 绑定的 JSON 字符串                      | string                                                                                    | `''`                                  |
| width                   | 宽度                                                    | number \| string                                                                          | 400                                   |
| height                  | 高度                                                    | number \| string                                                                          | 400                                   |
| showSearch              | 是否显示搜索入口                                        | boolean                                                                                   | true                                  |
| class                   | Vue 原生类名                                            | HTMLAttributes['class']                                                                   | —                                     |
| className               | 样式类名                                                | HTMLAttributes['class']                                                                   | -                                     |
| style                   | 内联样式                                                | StyleValue                                                                                | -                                     |
| options                 | 编辑器配置                                              | JsonViewerOptions                                                                         | `{ readOnly: false, autoWrap: true }` |
| limitSearchButtonBounds | 是否将搜索按钮拖动范围限制在组件容器内                  | boolean                                                                                   | false                                 |
| renderSearchButton      | 搜索按钮渲染 callback；优先于 searchButton 插槽         | ( defaultSearchButton: VNodeChild, controls: JsonViewerSearchControls, ) =&gt; VNodeChild | -                                     |
| renderTooltip           | 悬浮提示 callback；固定 v2.102.0 运行时未订阅 hoverNode | (value: string, element: HTMLElement) =&gt; HTMLElement                                   | —                                     |

### JsonViewerOptions

| 属性              | 说明           | 类型                                               | 默认值 | 版本   |
| ----------------- | -------------- | -------------------------------------------------- | ------ | ------ |
| lineHeight        | 行高           | number                                             | 20     | -      |
| autoWrap          | 是否自动换行   | boolean                                            | true   | -      |
| readOnly          | 是否只读       | boolean                                            | false  | -      |
| formatOptions     | 格式化配置     | JsonViewerFormattingOptions                        | -      | -      |
| completionOptions | 静态补全项配置 | { staticCompletions?: JsonViewerCompletionItem[] } | —      |        |
| customRenderRule  | 自定义渲染规则 | JsonViewerCustomRenderRule[]                       | -      | 2.74.0 |
| prefixCls         | 样式类名前缀   | string                                             | —      |        |

### CustomRenderRule

| 属性   | 说明     | 类型                                                                                                                   | 默认值 |
| ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| match  | 匹配规则 | string \| RegExp \| (value: string \| number \| boolean \| null, path: string, tokenType: 'key' \| 'value') => boolean | -      |
| render | 渲染函数 | (content: string) => VNodeChild 或 HTMLElement                                                                         | -      |

### FormattingOptions

| 属性         | 说明                 | 类型    | 默认值 |
| ------------ | -------------------- | ------- | ------ |
| tabSize      | 缩进大小             | number  | 4      |
| insertSpaces | 是否使用空格进行缩进 | boolean | true   |
| eol          | 换行符               | string  | '\n'   |

### SearchControls

当使用 `renderSearchButton` 时，第二个参数 `controls` 包含以下属性：

| 属性              | 说明                 | 类型                                                                                  |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------- |
| showSearchBar     | 当前是否显示搜索栏   | boolean                                                                               |
| onToggleSearchBar | 切换搜索栏显示/隐藏  | () => void                                                                            |
| onSearch          | 执行搜索             | (text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean) => void |
| onPrevSearch      | 跳转到上一个搜索结果 | () => void                                                                            |
| onNextSearch      | 跳转到下一个搜索结果 | () => void                                                                            |
| onReplace         | 替换当前搜索结果     | (text: string) => void                                                                |
| onReplaceAll      | 替换所有搜索结果     | (text: string) => void                                                                |

## Methods

可以通过模板 ref 调用公开实例方法。

| 名称                                                                                      | 描述                                                   |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| getValue()                                                                                | 获取当前值                                             |
| format()                                                                                  | 格式化当前内容                                         |
| search(searchText: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean) | 搜索文本，可选参数控制大小写敏感、全词匹配和正则表达式 |
| getSearchResults()                                                                        | 获取当前搜索结果                                       |
| prevSearch(step?: number)                                                                 | 导航到上一个搜索结果，可选步长参数                     |
| nextSearch(step?: number)                                                                 | 导航到下一个搜索结果，可选步长参数                     |
| replace(replaceText: string)                                                              | 替换当前搜索匹配项                                     |
| replaceAll(replaceText: string)                                                           | 替换所有搜索匹配项                                     |

### Performance

#### Bundle Size

| 组件         | 体积      | 体积(Gzip) |
| ------------ | --------- | ---------- |
| JsonViewer   | 203.14kb  | 51.23kb    |
| MonacoEditor | 5102.0 KB | 1322.7 KB  |

#### 渲染不同量级数据耗时

> 注：
>
> - 测试数据生成方式详情可查阅 [url](https://github.com/aifuxi/semi-ui-vue/blob/main/apps/storybook-vue/src/stories/json-viewer.stories.ts)
> - 当数据量级超出50w行时，MonacoEditor 默认关闭高亮等行为，数据对比不遵循单一变量原则

| 组件         | 1k行    | 5k行    | 1w行    | 10w行   | 50w行    | 100w行   | 300w行   |
| ------------ | ------- | ------- | ------- | ------- | -------- | -------- | -------- |
| JsonViewer   | 30.42ms | 30.66ms | 36.87ms | 52.73ms | 111.02ms | 178.81ms | 506.25ms |
| MonacoEditor | 72.01ms | 73.76ms | 76.64ms | 97.89ms | 133.31ms | 202.79ms | 495.53ms |
| 性能提升     | 57.70%  | 58.41%  | 51.87%  | 46.11%  | -        | -        | -        |
