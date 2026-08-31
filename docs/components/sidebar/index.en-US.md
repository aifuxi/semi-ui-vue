# Sidebar

`Sidebar` is aligned with Semi Design `v2.102.0` for AI workspaces that expose code, files, citations, and MCP configuration. The slice exports `Sidebar.Container`, `Sidebar.CodeContent`, `Sidebar.CodeItem`, `Sidebar.FileContent`, `Sidebar.FileItem`, `Annotation`, and `MCPConfigure`.

```vue
<script setup lang="ts">
import { h, ref } from 'vue';
import { IconCodeStroked } from '@aifuxi/semi-icons-vue';
import { Sidebar, type SidebarCodeItemProps } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/sidebar.css';

const activeKey = ref('code');
const codes: SidebarCodeItemProps[] = [
  { key: 'main', name: 'main.ts', language: 'ts', content: 'const ready = true' },
];
</script>

<template>
  <Sidebar
    visible
    :motion="false"
    :resizable="false"
    title="Agent workspace"
    :active-key="activeKey"
    :options="[{ key: 'code', icon: h(IconCodeStroked), name: 'Code' }]"
    @active-option-change="(_, key) => (activeKey = key)"
  >
    <template #main-content>
      <Sidebar.CodeContent active-key="main" :codes="codes" />
    </template>
  </Sidebar>
</template>
```

## Vue API

### Sidebar / Container

| Prop                                    | Description                                     | Default       |
| --------------------------------------- | ----------------------------------------------- | ------------- |
| `visible`                               | Whether the container is shown                  | `false`       |
| `motion`                                | Use the pinned slide transition                 | `true`        |
| `resizable`                             | Resize from the left edge                       | `true`        |
| `showClose`                             | Render the default close button                 | `true`        |
| `minWidth` / `maxWidth` / `defaultSize` | Resize constraints                              | `150` / - / - |
| `closeOnEsc`                            | Emit cancel on Escape while visible             | `false`       |
| `title`                                 | Main title; replaceable with `#title`           | -             |
| `mode`                                  | `main`, `code`, `file`, or a custom detail mode | `main`        |
| `activeKey` / `options`                 | Active main-view option and option list         | -             |
| `detailContent`                         | Code/File detail payload                        | -             |
| `fileEditable`                          | Whether File detail is editable                 | `true`        |

Events are `cancel`, `after-visible-change`, `active-option-change`, `back-ward`, `detail-content-copy`, and `file-content-change`. React render props map to the typed `#header`, `#option`, `#main-content`, `#detail-header`, and `#detail-content` slots. Function props remain available for incremental migrations.

### Code / File

- `Sidebar.CodeContent`: `activeKey`, `codes`, `onChange`, and `onExpand`.
- `Sidebar.CodeItem`: `name`, `isJson`, `language`, `content`, `jsonViewerProps`, and `codeHighlightProps`.
- `Sidebar.FileContent`: `activeKey`, `files`, `onChange`, and `onExpand`.
- `Sidebar.FileItem`: `name`, `editable`, `content`, `extensions`, `imgUploadProps`, and `onContentChange`.

The file editor pins Tiptap `3.10.7`; `extensions` accepts Vue Tiptap extensions. Sanitize untrusted HTML before passing it to the component.

### Annotation

`Annotation` inherits Container props. `info` is an array of `{ header, key, annotations }`; each citation supports text/video type, title, detail, URL, image, logo, site, order, and duration. Use `#item="{ annotation }"` for custom semantics or rendering.

### MCPConfigure

`MCPConfigure` inherits Container props. `options` and `customOptions` contain `value`, `label`, `desc`, `icon`, `active`, `disabled`, and `configure`. It supports filtering, search/status/add/configure/edit callbacks, and an `#item` slot.

## SSR and accessibility

A hidden Sidebar emits no container during SSR; visible main content renders deterministically. Tiptap, clipboard access, and global key listeners are client-only. Default close, back, copy, and expand controls have aria-labels. The pinned React citation item is a clickable `div`; use the custom item slot when stronger keyboard semantics are required.

See [alignment.md](./alignment.md) for the full parity evidence and [react-to-vue.md](./react-to-vue.md) for migration details.
