# 使用 MCP 查询组件

本流程用于上游 Semi React 的普通业务查询。本仓库 Vue 复刻仍以只读 `vendor/semi-design` v2.102.0 为唯一基线，不能用 MCP 结果替换。

## 先确定版本

从用户明确指定的版本或消费项目实际安装的 `@douyinfe/semi-ui` 版本确定本次查询版本；依赖声明是范围时，继续查看 lockfile 或已安装包的精确版本。缺少版本信息且版本会影响答案时，再询问用户。用户要求查看当前上游时，先确认具体版本，再进行关联查询。

**每次调用都显式传入同一个 `version`**，包括组件列表、文档代码块、源码文件和函数。当前工具声明中，文档与代码块工具默认 `latest`，三个源码工具默认 `2.89.2-alpha.3`；省略参数可能混用版本。对比版本时，分别记录各版本的查询链和结论。

## 按问题逐步查询

下表使用当前环境中的工具名；调用前核对实际可用的工具 schema，参数以它为准。

| 需要解决的问题           | 工具与参数                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| 选择组件或查公开 API     | `mcp__semi_mcp__get_semi_document`：`componentName`、`version`；仅需组件列表时省略 `componentName` |
| 文档隐藏了所需示例代码   | `mcp__semi_mcp__get_semi_code_block`：`componentName`、文档返回的 `codeBlockIndex`、`version`      |
| 文档不足以解释实际行为   | `mcp__semi_mcp__get_component_file_list`：`componentName`、`version`                               |
| 查看相关文件             | `mcp__semi_mcp__get_file_code`：文件列表返回的 `filePath`、`version`                               |
| 查看已定位函数的完整实现 | `mcp__semi_mcp__get_function_code`：已确认的 `filePath`、`functionName`、`version`                 |

优先用公开 API 和文档示例回答问题；信息足够时停止查询。需要源码证据时才取文件列表并读取相关文件，不预设文件路径或内部方法名。文件只返回结构时，可读取目标函数；确实需要完整文件时才设置 `fullCode: true`。

### 版本一致的示例

假设已确认业务项目使用 `2.102.0`，正在调查 Table 行为：

```js
const version = '2.102.0'; // 替换为已确认的消费版本
const document = await tools.mcp__semi_mcp__get_semi_document({
  componentName: 'Table',
  version,
});

// 仅当文档不足以回答当前问题时继续。
const files = await tools.mcp__semi_mcp__get_component_file_list({
  componentName: 'Table',
  version,
});
```

后续调用 `get_file_code` 或 `get_function_code` 时沿用这个 `version`，路径取自 `files`，函数名从对应文件确认。示例版本不代表 MCP 已验证支持该版本，也不改变本仓库的固定复刻基线。

## 查询失败时

- 组件未找到：核对目标版本和组件名称，必要时查询该版本的组件列表。
- 文件或函数未找到：重新核对同版本 `get_component_file_list` 返回的路径和文件中的函数名称，不猜测替代名称。
- 文档代码块被隐藏：按返回的代码块序号获取同版本示例；不要用其他版本示例补齐。
- 目标版本、源码或工具不可用：说明缺失的证据，优先检查消费项目已有的同版本包与资料；不要静默回退到 `latest` 或源码工具默认版本。

交付时注明查询版本，区分公开契约、源码观察和仍未验证的推断。
