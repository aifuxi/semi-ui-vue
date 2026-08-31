# CodeHighlight React → Vue 迁移

| React v2.102.0                                        | Vue 3.5+                                               | 说明                    |
| ----------------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| `<CodeHighlight code={code} language="javascript" />` | `<CodeHighlight :code="code" language="javascript" />` | props 名与枚举保持一致  |
| `lineNumber={false}`                                  | `:line-number="false"`                                 | Vue 模板使用 kebab-case |
| `defaultTheme={false}`                                | `:default-theme="false"`                               | 关闭内置主题 class      |
| `className="demo"`                                    | `class="demo"` 或 `class-name="demo"`                  | Vue 原生 class 优先     |
| `style={{ width: 320 }}`                              | `:style="{ width: '320px' }"`                          | Vue 数值/字符串样式语义 |

组件没有 children/render prop、事件或命令式 ref API。请继续把代码作为纯文本传入，不要把预先生成的 HTML 当作 slot 内容。

Prism 的额外语言定义仍由应用显式导入，例如 `prismjs/components/prism-vala.js`。SSR 阶段只输出安全的原始文本，客户端挂载后生成 token 与行号 DOM。
