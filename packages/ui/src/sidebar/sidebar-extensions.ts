import { Mark, mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import SidebarImageUploadNodeView from './SidebarImageUploadNodeView.vue';
import type { SidebarImageUploadOptions } from './types';

export const SidebarSelectionMark = Mark.create({
  name: 'selectionMark',
  inclusive: false,
  parseHTML: () => [{ tag: 'span.select' }],
  renderHTML: () => ['span', { class: 'select' }, 0],
});

export const SidebarImageUploadNode = Node.create<SidebarImageUploadOptions>({
  name: 'imageUpload',
  group: 'block',
  draggable: true,
  selectable: true,
  atom: true,
  addOptions() {
    return {
      type: 'image',
      accept: 'image/*',
      limit: 1,
      action: '',
    };
  },
  addAttributes() {
    return {
      accept: { default: this.options.accept },
      limit: { default: this.options.limit },
      maxSize: { default: this.options.maxSize },
      minSize: { default: this.options.minSize },
      action: { default: this.options.action },
    };
  },
  parseHTML: () => [{ tag: 'div[data-type="image-upload"]' }],
  renderHTML: ({ HTMLAttributes }) => [
    'div',
    mergeAttributes({ 'data-type': 'image-upload' }, HTMLAttributes),
  ],
  addNodeView: () => VueNodeViewRenderer(SidebarImageUploadNodeView),
});
