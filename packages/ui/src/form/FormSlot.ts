import { defineComponent, h, inject, isVNode, type VNodeChild } from 'vue';

import { Col } from '../grid';
import { formContextKey } from './form-context';
import FormErrorMessage from './FormErrorMessage.vue';
import FormLabel from './FormLabel.vue';
import type { FormErrorMessageProps, FormLabelProps, FormSlotComponentProps } from './types';

export default defineComponent({
  name: 'FormSlot',
  inheritAttrs: false,
  props: {
    className: { type: null, default: undefined },
    error: { type: null, default: undefined },
    label: { type: null, default: undefined },
    labelPosition: { type: String as () => 'top' | 'left', default: undefined },
    noLabel: { type: Boolean, default: false },
    style: { type: null, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const context = inject(formContextKey, undefined);
    return () => {
      const labelPosition = props.labelPosition ?? context?.props.labelPosition ?? 'top';
      const normalizedLabel: FormLabelProps =
        props.label && typeof props.label === 'object' && !isVNode(props.label)
          ? (props.label as FormLabelProps)
          : { text: props.label };
      const label = props.noLabel
        ? undefined
        : h(FormLabel as import('vue').Component, {
            align: context?.props.labelAlign ?? 'left',
            width: context?.props.labelWidth,
            ...normalizedLabel,
          });
      const errorProps: FormErrorMessageProps =
        props.error && typeof props.error === 'object' && !isVNode(props.error)
          ? (props.error as FormErrorMessageProps)
          : { error: props.error };
      const main = h('div', { class: ['semi-form-field-main', 'semi-form-slot-main'] }, [
        ...((slots.default?.() ?? []) as VNodeChild[]),
        props.error !== undefined
          ? h(FormErrorMessage as import('vue').Component, errorProps)
          : undefined,
      ]);
      const withColumns = context?.props.labelCol && context.props.wrapperCol;
      const content = withColumns
        ? [
            labelPosition === 'top'
              ? h('div', { style: { overflow: 'hidden' } }, [
                  h(Col, context.props.labelCol, () => label),
                ])
              : h(Col, context.props.labelCol, () => label),
            h(Col, context.props.wrapperCol, () => main),
          ]
        : [label, main];
      return h(
        'div',
        {
          ...attrs,
          class: ['semi-form-field', 'semi-form-slot', props.className, attrs.class],
          style: [props.style, attrs.style],
          'x-label-pos': labelPosition,
        },
        content,
      );
    };
  },
}) as unknown as import('vue').DefineComponent<FormSlotComponentProps>;
