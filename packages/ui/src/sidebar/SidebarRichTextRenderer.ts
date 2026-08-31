import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'SidebarRichTextRenderer',
  props: {
    html: { type: String, default: '' },
  },
  setup: (props) => () =>
    h('div', {
      class: 'semi-sidebar-file-editor',
      innerHTML: `<div class="tiptap ProseMirror">${props.html}</div>`,
    }),
});
