import { IconSearch } from '@aifuxi/semi-icons-vue';
import { defineComponent, h, type PropType, type VNodeChild } from 'vue';

import { Button } from '../button';
import { DragMove } from '../drag-move';
import JsonViewerSearchControls from './JsonViewerSearchControls.vue';
import type {
  JsonViewerLocale,
  JsonViewerSearchControls as SearchControls,
  JsonViewerSearchOptions,
} from './types';

export default defineComponent({
  name: 'JsonViewerSearchOverlay',
  inheritAttrs: false,
  props: {
    controls: { type: Object as PropType<SearchControls>, required: true },
    locale: { type: Object as PropType<JsonViewerLocale>, required: true },
    options: { type: Object as PropType<JsonViewerSearchOptions>, required: true },
    readOnly: { type: Boolean, required: true },
    limitBounds: { type: Boolean, required: true },
    width: { type: [Number, String] as PropType<number | string>, required: true },
    renderSearchButton: {
      type: Function as PropType<
        ((defaultSearchButton: VNodeChild, controls: SearchControls) => VNodeChild) | undefined
      >,
      default: undefined,
    },
  },
  emits: {
    option: (key: keyof JsonViewerSearchOptions) =>
      key === 'caseSensitive' || key === 'wholeWord' || key === 'regex',
    search: (value: string) => typeof value === 'string',
  },
  setup(props, { emit }) {
    let isDragging = false;
    const prefixCls = 'semi-json-viewer';

    return () => {
      const inner = props.controls.showSearchBar
        ? h(JsonViewerSearchControls, {
            locale: props.locale,
            options: props.options,
            readOnly: props.readOnly,
            onSearch: (value: string) => emit('search', value),
            onOption: (key: keyof JsonViewerSearchOptions) => emit('option', key),
            onPrevious: props.controls.onPrevSearch,
            onNext: props.controls.onNextSearch,
            onReplace: props.controls.onReplace,
            onReplaceAll: props.controls.onReplaceAll,
            onClose: props.controls.onToggleSearchBar,
          })
        : h(
            Button,
            {
              'aria-label': props.locale.search,
              class: `${prefixCls}-search-bar-trigger`,
              style: { position: 'absolute', top: '20px', right: '20px' },
              onClick: (event: MouseEvent) => {
                event.preventDefault();
                if (isDragging) {
                  event.stopPropagation();
                  return;
                }
                props.controls.onToggleSearchBar();
              },
            },
            { icon: () => h(IconSearch) },
          );

      const dragMoveProps = {
        ...(props.limitBounds ? { constrainer: 'parent' as const } : {}),
        onMouseDown: () => {
          isDragging = false;
        },
        onMouseMove: () => {
          isDragging = true;
        },
      };
      const defaultSearchButton = h(DragMove, dragMoveProps, {
        default: () =>
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 0,
                left: typeof props.width === 'number' ? `${props.width}px` : props.width,
              },
            },
            inner,
          ),
      });

      return props.renderSearchButton
        ? props.renderSearchButton(defaultSearchButton, props.controls)
        : defaultSearchButton;
    };
  },
});
