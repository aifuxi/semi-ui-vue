# Modal React → Vue 迁移

| React v2.102.0                                          | Vue                                                                      | 说明                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `import { Modal } from '@douyinfe/semi-ui'`             | `import { Modal } from '@aifuxi/semi-ui-vue'`                            | 根导出与 `modal` 子路径同名；default 与 named 一致                 |
| `visible` + `onCancel` / `onOk`                         | `v-model:visible`，或 `:visible` + `@update:visible` / `@cancel` / `@ok` | 关闭路径发出 `update:visible(false)`；`ok`/`cancel` 决定权在调用方 |
| `children`                                              | 默认 slot 或 `content` prop                                              | slot 优先                                                          |
| `title` / `icon` / `header` / `footer` / `closeIcon`    | 同名 prop 或同名 slot                                                    | 类型为 `VNodeChild`                                                |
| `okText` / `cancelText` / `okType` / `footerFill`       | 同名 prop                                                                | 文案缺省取 LocaleProvider `Modal.ok/cancel`                        |
| `okButtonProps` / `cancelButtonProps`                   | 同名 prop                                                                | 透传 Button props                                                  |
| `onOk`/`onCancel` 返回 Promise                          | 同名回调；返回 Promise 时按钮 loading，reject 保持打开                   | 与固定 ConfirmModal 一致                                           |
| `bodyStyle` / `maskStyle` / `modalContentClass`         | 同名 prop + Vue `class`/`style`                                          | 根节点合并，不新增包装                                             |
| `getPopupContainer`                                     | 同名 prop，缺省 `document.body`                                          | 非 body 容器不锁定 body 滚动                                       |
| `centered` / `fullScreen` / `size` / `width` / `height` | 同名 prop                                                                | `size` 缺省 `small`，数值尺寸按 px                                 |
| `Modal.confirm/info/success/warning/error`              | 同名静态方法，返回 `{ destroy, update }`                                 | 命令式实例句柄                                                     |
| `Modal.useModal()`                                      | 同名，返回 `[methods, holder]`                                           | `holder` 渲染在组件树内以继承 ConfigProvider/Locale                |
| `Modal.destroyAll()`                                    | 同名                                                                     | 关闭全部命令式弹窗                                                 |
| `ref` 上的实例方法                                      | 无额外 expose；命令式行为由静态方法与 `useModal` 承担                    | 保留 portal 与焦点契约                                             |

Vue 追加的原生能力（不改变固定基线行为）：

- `v-model:visible` 与 `update:visible` 事件，模板写法更直接，`visible` 受控语义不变。
- 具名 slot 与同名 VNode prop 并存，模板与 render function 都能自定义结构。

样式、Portal、焦点、ARIA 与动效契约不随迁移改变；逐项证据见[对齐矩阵](./alignment.md)。
