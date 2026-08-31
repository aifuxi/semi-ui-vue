# DragMove React → Vue 迁移

| React v2.102.0                    | Vue                              | 说明                            |
| --------------------------------- | -------------------------------- | ------------------------------- |
| `<DragMove>{child}</DragMove>`    | `<DragMove><Child /></DragMove>` | `children` 改为唯一默认 slot    |
| `constrainer={() => ref.current}` | `:constrainer="() => container"` | 可返回元素，也可传 `'parent'`   |
| `handler={() => ref.current}`     | `:handler="() => handle"`        | Vue 使用 template ref           |
| `positionStrategy="relative"`     | `position-strategy="relative"`   | 枚举和值保持一致                |
| `allowInputDrag`                  | `allow-input-drag`               | 裸 Boolean prop                 |
| `allowMove={fn}`                  | `:allow-move="fn"`               | 签名保持一致                    |
| `customMove={fn}`                 | `:custom-move="fn"`              | 参数顺序仍为 element、top、left |
| `onMouseDown={fn}`                | `@mouse-down="fn"`               | Vue emit                        |
| `onMouseMove={fn}`                | `@mouse-move="fn"`               | Vue emit                        |
| `onMouseUp={fn}`                  | `@mouse-up="fn"`                 | Vue emit                        |
| `onTouchStart/Move/End/Cancel`    | `@touch-start/move/end/cancel`   | Vue emits                       |

React 通过 `cloneElement` 合并 child ref；Vue 通过范围受限的 `cloneVNode(..., true)`
合并 ref，同样不增加 wrapper。React class component / `forwardRef` 的 DOM 透传，对应 Vue
中根节点为 `HTMLElement` 的单根组件。
