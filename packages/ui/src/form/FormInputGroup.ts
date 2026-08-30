import {
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  h,
  inject,
  isVNode,
  type VNodeArrayChildren,
  type VNodeChild,
} from 'vue';

import { Col } from '../grid';
import { InputGroup } from '../input';
import { formContextKey } from './form-context';
import FormErrorMessage from './FormErrorMessage.vue';
import { isFormFieldVNode } from './FormField';
import FormLabel from './FormLabel.vue';
import FormNodeRenderer from './FormNodeRenderer';
import type { FormFieldError, FormInputGroupProps, FormLabelProps } from './types';

function flatten(children: VNodeArrayChildren, output: VNodeChild[] = []): VNodeChild[] {
  for (const child of children) {
    if (Array.isArray(child)) flatten(child, output);
    else if (isVNode(child) && child.type === Fragment && Array.isArray(child.children)) {
      flatten(child.children as VNodeArrayChildren, output);
    } else output.push(child as VNodeChild);
  }
  return output;
}

function getAtPath(value: unknown, path: string): unknown {
  return path
    .replaceAll('[', '.')
    .replaceAll(']', '')
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((current, part) => {
      if (current === null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[part];
    }, value);
}

export default defineComponent({
  name: 'FormInputGroup',
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: undefined },
    extraText: { type: null, default: undefined },
    extraTextPosition: { type: String as () => 'bottom' | 'middle', default: 'bottom' },
    label: { type: null, default: undefined },
    labelPosition: { type: String as () => 'left' | 'top', default: undefined },
    size: { type: String as () => FormInputGroupProps['size'], default: 'default' },
  },
  setup(props, { attrs, slots }) {
    const context = inject(formContextKey);
    if (!context) {
      console.warn('[Semi Form]: InputGroup must be used inside Form');
      return () => null;
    }
    const fieldNames = computed(() =>
      flatten(slots.default?.() ?? [])
        .filter(isFormFieldVNode)
        .map((node) => node.props?.field)
        .filter((field): field is string => typeof field === 'string'),
    );
    const errors = computed(
      () =>
        fieldNames.value
          .map((field) => getAtPath(context.state.value.errors, field))
          .filter(Boolean) as FormFieldError[],
    );

    const renderLabel = () => {
      if (!props.label) return undefined;
      const normalized: FormLabelProps =
        props.label && typeof props.label === 'object' && !isVNode(props.label)
          ? (props.label as FormLabelProps)
          : { text: props.label };
      return h(FormLabel as import('vue').Component, {
        align: context.props.labelAlign ?? 'left',
        width: context.props.labelWidth,
        disabled: context.props.disabled,
        ...normalized,
      });
    };
    const renderFields = () =>
      flatten(slots.default?.() ?? [])
        .filter(isFormFieldVNode)
        .map((node) => cloneVNode(node, { isInInputGroup: true }));
    const renderExtra = () =>
      props.extraText
        ? h(
            'div',
            {
              class: [
                'semi-form-field-extra',
                typeof props.extraText === 'string' ? 'semi-form-field-extra-string' : undefined,
                `semi-form-field-extra-${props.extraTextPosition}`,
              ],
              'x-semi-prop': 'extraText',
            },
            [h(FormNodeRenderer, { content: props.extraText })],
          )
        : undefined;

    return () => {
      const label = renderLabel();
      const extra = renderExtra();
      const group = h(
        InputGroup as import('vue').Component,
        {
          ...attrs,
          disabled: props.disabled ?? context.props.disabled,
          size: props.size,
        },
        () => renderFields(),
      );
      const error = h(FormErrorMessage as import('vue').Component, {
        error: errors.value,
        showValidateIcon: context.props.showValidateIcon,
        isInInputGroup: true,
        validateStatus: errors.value.length ? 'error' : 'default',
      });
      const main = h('div', null, [
        props.extraTextPosition === 'middle' ? extra : undefined,
        group,
        props.extraTextPosition === 'bottom' ? extra : undefined,
        error,
      ]);
      const labelPosition = props.labelPosition ?? context.props.labelPosition ?? 'top';
      const withColumns = context.props.labelCol && context.props.wrapperCol;
      const content = withColumns
        ? [
            labelPosition === 'top'
              ? h('div', { style: { overflow: 'hidden' } }, [
                  h(
                    Col,
                    {
                      ...context.props.labelCol,
                      class: `semi-form-col-${context.props.labelAlign}`,
                    },
                    () => label,
                  ),
                ])
              : h(
                  Col,
                  {
                    ...context.props.labelCol,
                    class: `semi-form-col-${context.props.labelAlign}`,
                  },
                  () => label,
                ),
            h(Col, context.props.wrapperCol, () => main),
          ]
        : [label, main];
      return h('div', { class: 'semi-form-field-group', 'x-label-pos': labelPosition }, content);
    };
  },
});
