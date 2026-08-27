import {
  cloneVNode,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  markRaw,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  watch,
  type CSSProperties,
  type Component,
  type PropType,
  type VNode,
} from 'vue';
import {
  CheckboxGroupFoundation,
  type CheckboxGroupAdapter,
} from '@workspace/foundation-integration';

import CheckboxBase from './Checkbox.vue';
import CheckboxNodeRenderer from './CheckboxNodeRenderer';
import { checkboxGroupContextKey } from './checkbox-context';
import {
  CHECKBOX_DIRECTIONS,
  CHECKBOX_TYPES,
  type CheckboxChangeEvent,
  type CheckboxDirection,
  type CheckboxGroupProps,
  type CheckboxOption,
  type CheckboxType,
  type CheckboxValue,
} from './types';

interface CheckboxGroupState {
  value: CheckboxValue[];
}

interface FoundationGroupProps extends Record<string, unknown> {
  defaultValue?: CheckboxValue[];
  name?: string | undefined;
  value?: CheckboxValue[] | undefined;
}

export default defineComponent({
  name: 'CheckboxGroup',
  inheritAttrs: false,
  props: {
    ariaDescribedby: { type: String, default: undefined },
    ariaErrormessage: { type: String, default: undefined },
    ariaInvalid: {
      type: [Boolean, String] as PropType<CheckboxGroupProps['ariaInvalid']>,
      default: undefined,
    },
    ariaLabel: { type: String, default: undefined },
    ariaLabelledby: { type: String, default: undefined },
    ariaRequired: {
      type: [Boolean, String] as PropType<CheckboxGroupProps['ariaRequired']>,
      default: undefined,
    },
    defaultValue: { type: Array as PropType<CheckboxValue[]>, default: () => [] },
    direction: {
      type: String as PropType<CheckboxDirection>,
      default: 'vertical',
      validator: (value: string) => CHECKBOX_DIRECTIONS.includes(value as CheckboxDirection),
    },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    modelValue: { type: Array as PropType<CheckboxValue[] | undefined>, default: undefined },
    name: { type: String, default: undefined },
    options: {
      type: Array as PropType<Array<string | CheckboxOption> | undefined>,
      default: undefined,
    },
    prefixCls: { type: String, default: undefined },
    type: {
      type: String as PropType<CheckboxType>,
      default: 'default',
      validator: (value: string) => CHECKBOX_TYPES.includes(value as CheckboxType),
    },
    value: { type: Array as PropType<CheckboxValue[] | undefined>, default: undefined },
  },
  emits: ['change', 'update:value', 'update:modelValue'],
  setup(props, { attrs, emit, slots }) {
    const instance = getCurrentInstance();

    function hasRawProp(key: string): boolean {
      const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const raw = instance?.vnode.props;
      return Boolean(
        raw &&
        (Object.prototype.hasOwnProperty.call(raw, key) ||
          Object.prototype.hasOwnProperty.call(raw, kebabKey)),
      );
    }

    const hasValue = computed(() => hasRawProp('value'));
    const hasModelValue = computed(() => hasRawProp('modelValue'));
    const controlled = computed(() => hasValue.value || hasModelValue.value);
    const controlledValue = computed(() => (hasValue.value ? props.value : props.modelValue));
    const state = shallowRef<CheckboxGroupState>({
      value: [...(controlledValue.value ?? props.defaultValue ?? [])],
    });
    const cache = new Map<string, unknown>();
    const prefix = computed(() => props.prefixCls ?? 'semi-checkboxGroup');
    const isPureCardType = computed(() => props.type === 'pureCard');
    const isCardType = computed(() => props.type === 'card' || isPureCardType.value);

    function getFoundationProps(): FoundationGroupProps {
      const output: FoundationGroupProps = {
        defaultValue: props.defaultValue,
        name: props.name,
      };
      if (controlled.value) output.value = controlledValue.value;
      return output;
    }

    const adapter: CheckboxGroupAdapter<FoundationGroupProps, CheckboxGroupState> = {
      getContext: () => undefined,
      getContexts: () => undefined,
      getProp: (key) => getFoundationProps()[key as keyof FoundationGroupProps],
      getProps: getFoundationProps,
      getState: (key) => state.value[key as keyof CheckboxGroupState],
      getStates: () => state.value,
      setState: (nextState, callback) => {
        state.value = { ...state.value, ...nextState };
        callback?.();
      },
      getCache: (key) => cache.get(key),
      getCaches: () => cache,
      setCache: (key, value) => cache.set(String(key), value),
      stopPropagation: (event) => event?.stopPropagation?.(),
      persistEvent: () => undefined,
      updateGroupValue: (value) => {
        state.value = { value: [...value] };
      },
      notifyChange: (value) => {
        const next = [...value];
        emit('change', next);
        emit('update:value', next);
        emit('update:modelValue', next);
      },
    };
    const foundation = markRaw(
      new CheckboxGroupFoundation<FoundationGroupProps, CheckboxGroupState>(adapter),
    );

    const contextValue = computed(() => [...state.value.value]);
    const contextDisabled = computed(() => props.disabled);
    const contextName = computed(() => props.name || 'default');
    provide(checkboxGroupContextKey, {
      value: contextValue,
      disabled: contextDisabled,
      name: contextName,
      isCardType,
      isPureCardType,
      onChange: (event: CheckboxChangeEvent) => foundation.handleChange(event),
    });

    watch(controlledValue, (value) => {
      if (controlled.value) foundation.handlePropValueChange(value);
    });
    onMounted(() => foundation.init());
    onBeforeUnmount(() => foundation.destroy());

    function renderOption(option: string | CheckboxOption, index: number): VNode {
      if (typeof option === 'string') {
        return h(
          CheckboxBase as unknown as Component,
          {
            key: index,
            role: 'listitem',
            disabled: props.disabled,
            value: option,
            prefixCls: props.prefixCls,
          },
          () => option,
        );
      }
      return h(
        CheckboxBase as unknown as Component,
        {
          key: index,
          role: 'listitem',
          disabled: option.disabled || props.disabled,
          value: option.value,
          prefixCls: props.prefixCls,
          extra: option.extra,
          className: option.className,
          style: option.style,
          onChange: option.onChange,
        },
        {
          default: () => h(CheckboxNodeRenderer, { content: option.label }),
        },
      );
    }

    function renderSlotChildren(): VNode[] {
      return (slots.default?.() ?? []).map((child) =>
        isVNode(child) ? cloneVNode(child, { role: 'listitem' }) : child,
      ) as VNode[];
    }

    return () => {
      const groupClass = attrs.class;
      const groupStyle = attrs.style as CSSProperties | undefined;
      const dataAttrs = Object.fromEntries(
        Object.entries(attrs).filter(([name]) => name.startsWith('data-')),
      );
      const children = props.options ? props.options.map(renderOption) : renderSlotChildren();
      return h(
        'div',
        mergeProps(dataAttrs, {
          id: props.id,
          role: 'list',
          'aria-label': props.ariaLabel,
          'aria-labelledby': props.ariaLabelledby,
          'aria-describedby': props.ariaDescribedby,
          class: [
            prefix.value,
            `${prefix.value}-wrapper`,
            `${prefix.value}-${props.direction}`,
            isCardType.value ? `${prefix.value}-${props.direction}-cardType` : undefined,
            isPureCardType.value ? `${prefix.value}-${props.direction}-pureCardType` : undefined,
            groupClass,
          ],
          style: groupStyle,
        }),
        children,
      );
    };
  },
});
