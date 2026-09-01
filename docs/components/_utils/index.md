# `_utils` 公共工具

`_utils` 是 Semi v2.102.0 公开基础工具的 Vue 映射。工具均可按需从子路径导入，根组件
包只继续公开同一个 `semiGlobal` 单例。

```ts
import {
  cloneDeep,
  getDefaultPropsFromGlobalConfig,
  getFocusableElements,
  registerMediaQuery,
  stopPropagation,
} from '@aifuxi/semi-ui-vue/_utils';
```

主要行为：

- `cloneDeep` 深拷贝普通数据，但保留函数、Vue VNode 与 Error 的对象身份。
- `registerMediaQuery` 支持初始回调、match/unmatch 和取消订阅；SSR 返回空清理函数。
- 焦点工具沿用固定选择器集合，不额外过滤不可见节点。
- `getDefaultPropsFromGlobalConfig` 返回动态 Proxy；后续更新 `semiGlobal.config` 会立即生效。
- `runAfterTicks` 按 macrotask 次数延迟调用；非正数立即调用。

## 子路径

- `/_utils/use-prev-focus`：返回 readonly shallow ref 与 setter，替换和卸载时 blur。
- `/_utils/vue-render`：Vue 命令式 `render/unmount`、`resolveDOM` 与 `getRef`。
- `/_utils/semi-global`：与 ConfigProvider 根导出完全相同的 singleton。

这些工具没有专属样式或可视场景，所有 DOM API 都在调用时进行 SSR 守卫。
