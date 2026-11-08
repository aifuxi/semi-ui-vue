# Popover 重复点击关闭修复

## 问题现象

- `@aifuxi/semi-ui-vue@2.1.1` 的 Popover 公开类型继承 `clickTriggerToHide`，但配置为 true 后内层 Tooltip 仍收到 false，无法配置重复点击触发器关闭。
- 消费现场为工作项排序/分组设置。最小回归不依赖业务路由、Select 或服务端，直接挂载原生按钮和真实 Popover/Tooltip。
- 新增透传与全局默认测试在修复前均失败，明确收到 false 而非 true。

## 根因

1. Popover 使用 `inheritAttrs:false`，只显式传递列出的 Tooltip 选项，漏掉了已公开声明的 `clickTriggerToHide`。
2. 补齐透传后，原 Foundation 在 mousedown 关闭，随后 click 又调用 show。无动效回归观察到 `true,false,true` 的公开事件轨迹，不能以 DOM 暂时移除宣告修复。
3. 真实浏览器进一步发现受控且有动效时重复发出 false。父级回传 `visible=false` 后，watcher 再次调用 hide；退出动效期间 Portal 仍存在，Foundation 因此重复通知。新增单测先复现相同 `true,false,false`。

## 修复方案

- 按既有解析规则将 `clickTriggerToHide` 传给 Tooltip：缺省 false，显式 true/false 优先于 Popover 全局默认。
- 在 Tooltip 的 Vue 适配边界中，将 click 模式的重复触发统一交给触发器 click 关闭，避免同一操作的 mousedown/click 互相抵消，同时支持 Enter/Space。外部区域和其他 trigger 保留 mousedown 语义；触发器关闭的 clickOutside 事件携带实际 click 事件。
- 受控 visible watcher 忽略已经进入相同方向的内部状态回传；入场尚未变为 visible 时仍允许父级取消。不新增第二套 visible、定时器或业务补丁，不修改 vendor。
- 添加组件回归、实际 tarball 浏览器场景、公开中英文 API 说明、Popover/Tooltip 契约及 patch Changeset。

## 验证结果

- Tooltip、Popover、Popconfirm、Dropdown、Select、TreeSelect、Cascader、DatePicker、TimePicker、Tabs：26 个单测/SSR/hydration 文件，共 186 项通过。
- UI 包 `typecheck`、根工具 `typecheck:root`、受影响文件 ESLint 和 Prettier：通过。
- 最终源码重新执行 `pnpm check:artifacts`：构建、主题、无 DOM 导入、真实 tarball 安装/exports/类型/样式/tree-shaking 检查通过；复用已有外部依赖，未执行隔离网络安装。
- 最终实际 tarball 的 Chromium 回归：Popover 12 项与 SideSheet 2 项，共 14 项通过。Popover 覆盖浅深主题、受控/非受控、默认动效/无动效、鼠标重复点击、Enter/Space、Escape、外部点击，以及缺省/显式 false 不切换；严格检查模型事件序列，没有放宽断言。
- 首轮浏览器受控有动效的 2 项失败，经上述 watcher 修复并重建 tarball 后全部通过；没有使用重试、固定延时或改旧快照制造通过。
- 未执行整库浏览器截图矩阵、人工读屏或迭鹿页面升级复验；未发布 npm、未修改 React 基线或业务项目。
