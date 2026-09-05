---
title: 'Modal'
description: 'Modals are used to wait for the user to interact, inform the user of important information, or display more information without losing context.'
locale: 'en-US'
slug: 'modal'
category: 'show'
order: 76
englishTitle: 'Modal'
icon: 'doc-modal'
upstream: 'show/modal'
---

## Demos

### How to import

```ts
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
```

### Basic Usage

::demo-block{demo="modal/en-us/Basic" title="Basic Usage"}
::

### Bottom Button Fill up

Set `footerFill` to true to make the bottom buttons of the Modal footer fill up the arrangement.

::demo-block{demo="modal/en-us/FooterFill" title="Bottom Button Fill up"}
::

### Mask Closable

You can set `maskClosable={false}` to prevent modal from closing when clicking on the mask.

::demo-block{demo="modal/en-us/MaskClosable" title="Mask Closable"}
::

### Custom Button Text

You can set button text using `okText` and `cancelText`.

> In the case of creating a modal with static methods, you will have to use these two properties to set i18 texts at this moment. Because we cannot modify the Vue component tree, imperatively inserted components cannot consume Locale-related Context

::demo-block{demo="modal/en-us/ButtonText" title="Custom Button Text"}
::

### Custom Button Properties

You can set button properties using `okButtonProps` and `cancelButtonProps`.

::demo-block{demo="modal/en-us/ButtonProps" title="Custom Button Properties"}
::

### Custom Header & Footer

For more customized modal, you could use `header` and `footer`. Set `header={null}` if you do not want header area, or `footer={null}` to remove footer area including buttons.

::demo-block{demo="modal/en-us/HeaderFooter" title="Custom Header & Footer"}
::

### Custom Style

You can use `style` to customize styling or position e.g. `style.top = '30vh'`, or use `centered` to center modal. Also, you could use `maskStyle` to customize mask style or `bodyStyle` for content style.

::demo-block{demo="modal/en-us/Style" title="Custom Style"}
::

### Custom Modal

By using `header`, `footer`, etc, you could create any modal to your needs.

::demo-block{demo="modal/en-us/Custom" title="Custom Modal"}
::

### Full Screen Modal

set `full-screen` can use full screen Modal

::demo-block{demo="modal/en-us/Fullscreen" title="Full Screen Modal"}
::

### Confirm Modal

You could use static methods to create a confirm Modal. Use `icon` to customize icon.

::demo-block{demo="modal/en-us/Imperative" title="Confirm Modal"}
::

### useModal Hooks

You could use `Modal.useModal` to create a `contextHolder` that could access context.

::demo-block{demo="modal/en-us/Context" title="useModal Hooks"}
::

### Draggable Modal

The modal content is rendered customly through `modalRender`, and the draggable Modal is implemented through the DragMove component.

::demo-block{demo="modal/en-us/Draggable" title="Draggable Modal"}
::

## API Reference

### Modal

| Properties        | Instructions                                                                                                                                                                                    | type                                                         | Default             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------- |
| afterClose        | Callback function when modal closed completely                                                                                                                                                  | () => void                                                   | -                   |
| bodyStyle         | Content style                                                                                                                                                                                   | CSSProperties                                                | -                   |
| cancelButtonProps | Properties for cancel button                                                                                                                                                                    | [ButtonProps](/en-us/components/button/#API-reference)       | -                   |
| cancelText        | Text for cancel button                                                                                                                                                                          | string                                                       | -                   |
| centered          | Toggle whether to center modal                                                                                                                                                                  | boolean                                                      | false               |
| closable          | Toggle whether to show close button                                                                                                                                                             | boolean                                                      | true                |
| closeIcon         | Icon for close button                                                                                                                                                                           | VNodeChild                                                   | `<IconClose />`     |
| closeOnEsc        | Toggle whether to allow close modal by keyboard event Esc                                                                                                                                       | boolean                                                      | true                |
| confirmLoading    | Toggle loading state of confirm button                                                                                                                                                          | boolean                                                      | false               |
| content           | Content                                                                                                                                                                                         | VNodeChild                                                   | -                   |
| footer            | Footer                                                                                                                                                                                          | VNodeChild                                                   | -                   |
| footerFill        | Is the bottom button full (>= 2.xx.0 )                                                                                                                                                          | boolean                                                      | false               |
| fullScreen        | Is modal FullScreen（will override width and height）                                                                                                                                           | boolean                                                      | false               |
| getPopupContainer | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position. | () => HTMLElement                                            | () => document.body |
| hasCancel         | Toggle whether to show cancal button                                                                                                                                                            | boolean                                                      | true                |
| header            | Header                                                                                                                                                                                          | VNodeChild                                                   | -                   |
| height            | Height                                                                                                                                                                                          | number \| string                                             | -                   |
| icon              | Custom icon                                                                                                                                                                                     | VNodeChild                                                   | -                   |
| keepDOM           | Keep dom tree when close modal                                                                                                                                                                  | boolean                                                      | false               |
| lazyRender        | Lazy render modal, used with `keepDOM`                                                                                                                                                          | boolean                                                      | true                |
| mask              | Toggle whether to show mask                                                                                                                                                                     | boolean                                                      | true                |
| maskClosable      | Toggle whether to allow closing when clicking mask                                                                                                                                              | boolean                                                      | true                |
| maskStyle         | Mask style                                                                                                                                                                                      | CSSProperties                                                | -                   |
| modalContentClass | The class name that can be used to set the style of the dialog content                                                                                                                          | string                                                       | -                   |
| modalRender       | Custom rendering Modal                                                                                                                                                                          | (modal: VNodeChild) => VNodeChild                            | -                   |
| motion            | animation switch                                                                                                                                                                                | boolean                                                      | true                |
| okButtonProps     | Properties for confirm button                                                                                                                                                                   | [ButtonProps](/en-us/components/button/#API-reference)       | -                   |
| okText            | Text for confirm button                                                                                                                                                                         | string                                                       | -                   |
| okType            | Type for confirm button, optional: 'primary'、'secondary'、'tertiary'、'warning'、'danger'                                                                                                      | string                                                       | primary             |
| preventScroll     | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user   | boolean                                                      |                     |     |
| size              | Size of modal, one of `small`(448px), `medium`(684px), `large`(920px), `full-width`(100vw - 64px)                                                                                               | string                                                       | 'small'             |
| style             | Inline style                                                                                                                                                                                    | CSSProperties                                                | -                   |
| title             | Title                                                                                                                                                                                           | VNodeChild                                                   | -                   |
| visible           | Toggle visibility of the modal                                                                                                                                                                  | boolean                                                      | false               |
| width             | Width                                                                                                                                                                                           | number \| string                                             | 448                 |
| zIndex            | Z-index value for mask                                                                                                                                                                          | number                                                       | 1000                |
| onCancel          | Callback function when clicking cancel button                                                                                                                                                   | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | -                   |
| onOk              | Callback function when clicking confirm button                                                                                                                                                  | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | -                   |

### Static Method

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

| Properties        | Instructions                                                                                      | type                                                         | Default |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------- |
| bodyStyle         | Content style                                                                                     | CSSProperties                                                | -       |
| cancelButtonProps | Properties for cancel button                                                                      | ButtonProps                                                  | -       |
| cancelText        | Text for cancel button                                                                            | string                                                       | -       |
| centered          | Toggle whether to center modal                                                                    | boolean                                                      | false   |
| closable          | Toggle whether to show close button                                                               | boolean                                                      | true    |
| content           | Content                                                                                           | VNodeChild                                                   | -       |
| confirmLoading    | Toggle loading state of confirm button                                                            | boolean                                                      | false   |
| footer            | Footer                                                                                            | VNodeChild                                                   | -       |
| header            | Header                                                                                            | VNodeChild                                                   | -       |
| height            | Height                                                                                            | number \| string                                             | -       |
| icon              | Customized icon                                                                                   | VNodeChild                                                   | -       |
| mask              | Toggle whether to show mask                                                                       | boolean                                                      | true    |
| maskClosable      | Toggle whether to allow closing when clicking mask                                                | boolean                                                      | true    |
| maskStyle         | Mask style                                                                                        | CSSProperties                                                | -       |
| modalContentClass | The class name that can be used to set the style of the dialog content                            | string                                                       | -       |
| modalRender       | Custom rendering Modal                                                                            | (modal: VNodeChild) => VNodeChild                            | -       |
| okButtonProps     | Properties for confirm button                                                                     | ButtonProps                                                  | -       |
| okText            | Text for confirm button                                                                           | string                                                       | -       |
| okType            | Type for confirm button                                                                           | string                                                       | primary |
| size              | Size of modal, one of `small`(448px), `medium`(684px), `large`(920px), `full-width`(100vw - 64px) | string                                                       | 'small' |
| style             | Inline style                                                                                      | CSSProperties                                                | -       |
| title             | Title                                                                                             | VNodeChild                                                   | -       |
| width             | Custom width; defaults to size=small                                                              | number \| string                                             | 448     |
| zIndex            | Z-index value for mask                                                                            | number                                                       | 1000    |
| onCancel          | Callback function when clicking cancel button                                                     | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | -       |
| onOk              | Callback function when clicking confirm button                                                    | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | -       |

Creating modal with the above methods will return a reference to the instance. You could use it to update or close the modal.|

```ts
function openAndUpdate() {
  const modal = Modal.info({ title: 'Information', content: 'Content' });
  modal.update({ title: 'Updated title', content: 'Updated content' });
  modal.destroy();
}
```

- `Modal.destroyAll`

You could use Modal.destroyAll() to destroy Modal that created by methods above e.g. `.info()`

- `Modal.useModal`  
  When you need access Context, you could use `Modal.useModal` to create a `contextHolder` and insert to corresponding DOM tree. Modal created by hooks will be able to access the context where `contextHolder` is inserted. Hook modal shares the same methods with Modal.method.

## Accessibility

### ARIA

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

- Modal role set to `dialog`
- aria-modal is set to true
- aria-labelledby corresponds to Modal header
- aria-describedby corresponds to Modal body

### Keyboard and focus

- Modal automatically gets the focus when it is popped up, and when it is closed, the focus automatically returns to the element before it was opened.
- Keyboard users can use the `Tab` key and `Shift + Tab` to move the focus within the Modal, including the Modal's own close button and OK cancel button. At this time, the elements behind the Modal cannot be tab-focused.
- When Modal is opened, the focus is on the cancel button by default, which can be controlled by passing autoFocus in cancelButtonProps or okButtonProps.
- By adding autoFocus to the form element that needs to be focused in the Modal content, the Modal can automatically focus on the element when it is opened (the autoFocus of cancelButtonProps needs to be set to false at the same time).
- Modify the default value of closeOnEsc to true, allowing users to directly close Modal through the keyboard for a better experience

## Content Guidelines

- Imperative Modal and Default Modal The title of the two modal dialogs uses the format of verb + noun, whether it is a declarative sentence or a question sentence

| ✅ Recommended usage | ❌ Deprecated usage                   |
| -------------------- | ------------------------------------- |
| Edit ticket          | Edit                                  |
| Delete form？        | Are you sure you want to delete form? |

- The operation buttons of the two modal dialog boxes only need to use the verbs in the title under the premise of ensuring that the title description is clear

| ✅ Recommended usage | ❌ Deprecated usage |
| -------------------- | ------------------- |
| Edit                 | Edit ticket         |

- Text specification for imperative Modal
  - Give a specific explanation to the title, do not repeat the information of the title
  - Make sure users know how to act if necessary

## Design Tokens

::token-table{component="modal"}
::

## FAQ

- #### Why the button texts in Modal.confirm are not internationalized even when I use ConfigProvider?

  You could use `Modal.useModal` to create a `contextHolder` that is accessible to config from ConfigProvider or ConfigProvider.

  For version before 1.2 or if you don't want to use Hooks, you could also use `okText` and `cancelText` to set i18 texts at this moment.

- #### Why is the spacing between title and content different under imperative and non-imperative calls?
  In the imperative call scenario, the title and content are more closely related, so expressing this strong correlation with a closer distance is in line with expectations. If users don't want this effect, they can do their own style overrides.

## React → Vue Migration

| React                                      | Vue                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| visible / onCancel                         | v-model:visible, or visible with an onCancel callback                                      |
| children                                   | Default slot; body takes precedence, followed by the default slot and content prop         |
| title / icon / closeIcon / header / footer | Named slots or VNodeChild props; explicit null hides header/footer                         |
| onOk / onCancel                            | `:on-ok="handleOk"` / `:on-cancel="handleCancel"`; Foundation reads callback return values |
| afterClose                                 | `:after-close="afterClose"`; onAfterClose is also supported                                |
| modalRender(node)                          | Function returning VNodeChild; use Vue h for wrappers                                      |
| Modal.info/success/error/warning/confirm   | Preserved methods accepting ModalProps and returning ModalHandle                           |
| modal.update / modal.destroy               | Update configuration / close that handle's dialog                                          |
| Modal.useModal()                           | useModal() or Modal.useModal(), returning methods and a ContextHolder component            |

Modal emits update:visible only. onOk/onCancel are callback props supporting Promise results. Imperative callbacks receive MouseEvent or KeyboardEvent, rather than the close function stated in the upstream table. Resolution closes the dialog; rejection retains it. Normal controlled dialogs still require the caller to update visibility.

Additional props include cancelLoading=false, footerFill=false, maskFixed=false, direction inherited from configuration, and getContainerContext. Both declarative and imperative dialogs use size-based widths, with small=448px. width/height accept numbers or strings; fullScreen takes precedence. Static methods mount outside the current ConfigProvider. Supply okText/cancelText, or use ContextHolder to consume context. destroyAll manages static-method dialogs, not useModal instances.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
