# Toast React → Vue 迁移

| React v2.102.0                           | Vue 3.5+                           | 说明                            |
| ---------------------------------------- | ---------------------------------- | ------------------------------- |
| `Toast.info('Saved')`                    | `Toast.info('Saved')`              | 字符串简写不变                  |
| `Toast.success(options)`                 | `Toast.success(options)`           | 返回 id；同 id 原位更新         |
| `Toast.close(id)`                        | `Toast.close(id)`                  | 命令式关闭不变                  |
| `Toast.config(config)`                   | `Toast.config(config)`             | 应在实例第一次显示前调用        |
| `ToastFactory.create(config)`            | `ToastFactory.create(config)`      | 返回隔离的 Vue 命令式实例       |
| `const [api, holder] = Toast.useToast()` | `const [api, Holder] = useToast()` | Vue 返回可直接渲染的 Component  |
| `{holder}`                               | `<Holder />`                       | holder 放在需要继承上下文的位置 |
| `ReactNode` content/icon                 | `VNodeChild` content/icon          | 使用 Vue VNode/组件实例         |
| React context direction                  | `ConfigProvider` direction         | holder 可继承；静态实例默认 LTR |

Vue 不公开 React component ref、render prop 或 `ReactElement`。Toast 是命令式反馈 API，没有 `v-model` 或业务数据双向绑定。
