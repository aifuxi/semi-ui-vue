import { RadioGroupFoundation } from '@workspace/foundation-integration';
import {
  Comment,
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  isVNode,
  markRaw,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  Text,
  watch,
  type Component,
  type PropType,
  type VNode,
} from 'vue';

import RadioBase from './Radio.vue';
import RadioNodeRenderer from './RadioNodeRenderer';
import { radioGroupContextKey } from './radio-context';
import {
  RADIO_BUTTON_SIZES,
  RADIO_DIRECTIONS,
  RADIO_MODES,
  RADIO_TYPES,
  type RadioButtonSize,
  type RadioChangeEvent,
  type RadioDirection,
  type RadioGroupProps,
  type RadioMode,
  type RadioOption,
  type RadioType,
  type RadioValue,
} from './types';

interface RadioGroupState {
  value: RadioValue | undefined;
}

interface FoundationGroupProps extends Record<string, unknown> {
  defaultValue?: RadioValue | undefined;
  mode: RadioMode;
  value?: RadioValue | undefined;
}

export default defineComponent({
  name: 'RadioGroup',
  inheritAttrs: false,
  props: {
    ariaDescribedby: { type: String, default: undefined },
    ariaErrormessage: { type: String, default: undefined },
    ariaInvalid: {
      type: [Boolean, String] as PropType<RadioGroupProps['ariaInvalid']>,
      default: undefined,
    },
    ariaLabel: { type: String, default: undefined },
    ariaLabelledby: { type: String, default: undefined },
    ariaRequired: {
      type: [Boolean, String] as PropType<RadioGroupProps['ariaRequired']>,
      default: undefined,
    },
    buttonSize: {
      type: String as PropType<RadioButtonSize>,
      default: 'middle',
      validator: (value: string) => RADIO_BUTTON_SIZES.includes(value as RadioButtonSize),
    },
    className: { type: String, default: undefined },
    defaultValue: {
      type: [String, Number, Boolean] as PropType<RadioValue | undefined>,
      default: undefined,
    },
    direction: {
      type: String as PropType<RadioDirection>,
      default: 'horizontal',
      validator: (value: string) => RADIO_DIRECTIONS.includes(value as RadioDirection),
    },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    mode: {
      type: String as PropType<RadioMode>,
      default: '',
      validator: (value: string) => RADIO_MODES.includes(value as RadioMode),
    },
    modelValue: {
      type: [String, Number, Boolean] as PropType<RadioValue | undefined>,
      default: undefined,
    },
    name: { type: String, default: undefined },
    options: {
      type: Array as PropType<Array<string | RadioOption> | undefined>,
      default: undefined,
    },
    prefixCls: { type: String, default: undefined },
    style: {
      type: [String, Object, Array] as PropType<RadioGroupProps['style']>,
      default: undefined,
    },
    type: {
      type: String as PropType<RadioType>,
      default: 'default',
      validator: (value: string) => RADIO_TYPES.includes(value as RadioType),
    },
    value: {
      type: [String, Number, Boolean] as PropType<RadioValue | undefined>,
      default: undefined,
    },
  },
  emits: ['change', 'update:value', 'update:modelValue'],
  setup(props, { attrs, emit, slots }) {
    const instance = getCurrentInstance();
    const cache = new Map<string, unknown>();

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
    const state = shallowRef<RadioGroupState>({
      value: controlled.value ? controlledValue.value : props.defaultValue,
    });
    const prefix = computed(() => props.prefixCls ?? 'semi-radioGroup');
    const isButtonRadio = computed(() => props.type === 'button');
    const isPureCardRadio = computed(() => props.type === 'pureCard');
    const isCardRadio = computed(() => props.type === 'card' || isPureCardRadio.value);

    function getFoundationProps(): FoundationGroupProps {
      const output: FoundationGroupProps = {
        defaultValue: props.defaultValue,
        mode: props.mode,
      };
      if (controlled.value) output.value = controlledValue.value;
      return output;
    }

    const adapter = {
      getContext: () => undefined,
      getContexts: () => undefined,
      getProp: (key: string) => getFoundationProps()[key as keyof FoundationGroupProps],
      getProps: getFoundationProps,
      getState: (key: string) => state.value[key as keyof RadioGroupState],
      getStates: () => state.value,
      setState: (nextState: Partial<RadioGroupState>, callback?: () => void) => {
        state.value = { ...state.value, ...nextState };
        callback?.();
      },
      getCache: (key: string) => cache.get(key),
      getCaches: () => cache,
      setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
      stopPropagation: (event: { stopPropagation?: () => void }) => event.stopPropagation?.(),
      persistEvent: () => undefined,
      isInProps: (name: string) => name === 'value' && controlled.value,
      setValue: (value: unknown) => {
        state.value = { value: value as RadioValue | undefined };
      },
      notifyChange: (event: unknown) => {
        const radioEvent = event as RadioChangeEvent;
        const value = radioEvent.target.value;
        emit('change', radioEvent);
        emit('update:value', value);
        emit('update:modelValue', value);
      },
    };
    const foundation = markRaw(new RadioGroupFoundation(adapter));

    const contextValue = computed(() => state.value.value);
    const contextDisabled = computed(() => props.disabled);
    const contextMode = computed(() => props.mode);
    const contextName = computed(() => props.name || 'default');
    const contextButtonSize = computed(() => props.buttonSize);
    const contextPrefixCls = computed(() => props.prefixCls);
    provide(radioGroupContextKey, {
      value: contextValue,
      disabled: contextDisabled,
      mode: contextMode,
      name: contextName,
      isButtonRadio,
      isCardRadio,
      isPureCardRadio,
      buttonSize: contextButtonSize,
      prefixCls: contextPrefixCls,
      onChange: (event: RadioChangeEvent) => foundation.handleChange(event),
    });

    watch(controlledValue, (value, previous) => {
      if (!controlled.value) return;
      if (
        typeof value === 'number' &&
        Number.isNaN(value) &&
        typeof previous === 'number' &&
        Number.isNaN(previous)
      ) {
        return;
      }
      foundation.handlePropValueChange(value);
    });
    onMounted(() => foundation.init());
    onBeforeUnmount(() => foundation.destroy());

    function renderOption(option: string | RadioOption, index: number): VNode {
      if (typeof option === 'string') {
        return h(
          RadioBase as unknown as Component,
          {
            key: index,
            disabled: props.disabled,
            value: option,
            prefixCls: props.prefixCls,
          },
          () => option,
        );
      }
      return h(
        RadioBase as unknown as Component,
        {
          key: index,
          disabled: option.disabled || props.disabled,
          value: option.value,
          extra: option.extra,
          className: option.className,
          style: option.style,
          addonId: option.addonId,
          addonStyle: option.addonStyle,
          addonClassName: option.addonClassName,
          extraId: option.extraId,
          prefixCls: props.prefixCls,
        },
        { default: () => h(RadioNodeRenderer, { content: option.label }) },
      );
    }

    function renderSlotChildren(): VNode[] {
      return (slots.default?.() ?? []).filter(
        (child): child is VNode =>
          isVNode(child) &&
          child.type !== Text &&
          child.type !== Comment &&
          child.type !== Fragment,
      );
    }

    return () => {
      const dataAttrs = Object.fromEntries(
        Object.entries(attrs).filter(([name]) => name.startsWith('data-')),
      );
      const children = props.options ? props.options.map(renderOption) : renderSlotChildren();
      return h(
        'div',
        {
          ...dataAttrs,
          id: props.id,
          'aria-label': props.ariaLabel,
          'aria-invalid': props.ariaInvalid,
          'aria-errormessage': props.ariaErrormessage,
          'aria-labelledby': props.ariaLabelledby,
          'aria-describedby': props.ariaDescribedby,
          'aria-required': props.ariaRequired,
          class: [
            attrs.class,
            props.className,
            prefix.value,
            `${prefix.value}-wrapper`,
            !isButtonRadio.value ? `${prefix.value}-${props.direction}` : undefined,
            !isButtonRadio.value && props.type === 'default'
              ? `${prefix.value}-${props.direction}-default`
              : undefined,
            !isButtonRadio.value && isCardRadio.value
              ? `${prefix.value}-${props.direction}-card`
              : undefined,
            isButtonRadio.value ? `${prefix.value}-buttonRadio` : undefined,
          ],
          style: props.style ?? attrs.style,
        },
        children,
      );
    };
  },
});
