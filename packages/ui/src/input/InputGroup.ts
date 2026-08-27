import {
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  h,
  inject,
  isVNode,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild,
} from 'vue';

import { configContextKey } from '../config-provider';
import InputNodeRenderer from './InputNodeRenderer';
import type { InputGroupLabelProps, InputGroupProps } from './types';

function flattenChildren(children: VNodeArrayChildren, output: VNodeChild[] = []): VNodeChild[] {
  for (const child of children) {
    if (Array.isArray(child)) flattenChildren(child, output);
    else if (isVNode(child) && child.type === Fragment && Array.isArray(child.children)) {
      flattenChildren(child.children as VNodeArrayChildren, output);
    } else output.push(child as VNodeChild);
  }
  return output;
}

function hasVNodeProp(node: VNode, key: string): boolean {
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    node.props &&
    (Object.prototype.hasOwnProperty.call(node.props, key) ||
      Object.prototype.hasOwnProperty.call(node.props, kebabKey)),
  );
}

function renderLabel(label: InputGroupLabelProps, optionalText: string): VNode {
  const style = [label.style, label.width !== undefined ? { width: label.width } : undefined];
  const textContent = h('div', { class: 'semi-form-field-label-text', 'x-semi-prop': 'label' }, [
    h(InputNodeRenderer, { content: label.text }),
    label.optional
      ? h('span', { class: 'semi-form-field-label-optional-text' }, optionalText)
      : undefined,
  ]);
  return h(
    'label',
    {
      id: label.id,
      for: label.name || 'input-group',
      class: [
        label.className,
        'semi-form-field-label',
        (label.align ?? 'left') === 'left' ? 'semi-form-field-label-left' : undefined,
        label.align === 'right' ? 'semi-form-field-label-right' : undefined,
        label.required ? 'semi-form-field-label-required' : undefined,
        label.disabled ? 'semi-form-field-label-disabled' : undefined,
        label.extra ? 'semi-form-field-label-with-extra' : undefined,
      ],
      style,
    },
    label.extra
      ? [
          textContent,
          h('div', { class: 'semi-form-field-label-extra' }, [
            h(InputNodeRenderer, { content: label.extra }),
          ]),
        ]
      : [textContent],
  );
}

export default defineComponent({
  name: 'InputGroup',
  inheritAttrs: false,
  props: {
    className: { type: null, default: undefined },
    disabled: { type: Boolean, default: undefined },
    label: { type: Object as () => InputGroupLabelProps, default: undefined },
    labelPosition: { type: String, default: undefined },
    size: {
      type: String as () => NonNullable<InputGroupProps['size']>,
      default: 'default',
    },
    style: { type: null, default: undefined },
  },
  emits: {
    blur: (event: FocusEvent) => Boolean(event),
    focus: (event: FocusEvent) => Boolean(event),
  },
  setup(props, { attrs, emit, slots }) {
    const config = inject(configContextKey, undefined);
    const optionalText = computed(() => {
      const form = config?.value.locale.Form as { optional?: unknown } | undefined;
      return typeof form?.optional === 'string' ? form.optional : '（可选）';
    });

    const renderChildren = (): VNodeChild[] => {
      const children = flattenChildren(slots.default?.() ?? []);
      return children.map((child) => {
        if (!isVNode(child) || typeof child.type === 'symbol') return child;
        const extraProps: Record<string, unknown> = { ...attrs, size: props.size };
        if (!hasVNodeProp(child, 'disabled') && props.disabled !== undefined) {
          extraProps.disabled = props.disabled;
        }
        return cloneVNode(child, extraProps);
      });
    };

    const onFocusin = (event: FocusEvent) => emit('focus', event);
    const onFocusout = (event: FocusEvent) => emit('blur', event);

    return () => {
      const children = renderChildren();
      const group = h(
        'span',
        {
          role: 'group',
          'aria-label': props.label?.text ? undefined : 'Input group',
          'aria-disabled': props.disabled,
          id: props.label?.text ? props.label.name || 'input-group' : undefined,
          class: [
            'semi-input-group',
            props.className,
            props.size !== 'default' ? `semi-input-${props.size}` : undefined,
          ],
          style: props.style,
          onFocusin,
          onFocusout,
        },
        children,
      );
      if (!props.label?.text) return group;
      return h(
        'div',
        {
          class: [
            'semi-input-group-wrapper',
            props.labelPosition === 'top' ? 'semi-input-group-wrapper-with-top-label' : undefined,
            props.labelPosition === 'left' ? 'semi-input-group-wrapper-with-left-label' : undefined,
          ],
        },
        [renderLabel(props.label, optionalText.value), group],
      );
    };
  },
});
