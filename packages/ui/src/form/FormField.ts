import Schema from 'async-validator';
import {
  Comment,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  type Component,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

import { Col } from '../grid';
import { arrayFieldContextKey, formContextKey } from './form-context';
import FormErrorMessage from './FormErrorMessage.vue';
import FormLabel from './FormLabel.vue';
import FormNodeRenderer from './FormNodeRenderer';
import type {
  CommonFieldProps,
  FieldValidator,
  FormFieldComponent,
  FormFieldError,
  FormLabelProps,
  FormTrigger,
  FormValidateStatus,
  WithFieldOptions,
} from './types';
import type { FoundationCallOptions, FoundationFieldApi } from '@workspace/foundation-integration';

interface InternalWithFieldOptions extends WithFieldOptions {
  shouldInjectByDefault?: boolean;
}

const commonFieldProps = {
  allowEmptyString: { type: Boolean, default: undefined },
  convert: { type: Function as PropType<(value: unknown) => unknown>, default: undefined },
  emptyValue: { type: null, default: '' },
  extraText: { type: null, default: undefined },
  extraTextPosition: { type: String as PropType<'middle' | 'bottom'>, default: undefined },
  field: { type: String, default: undefined },
  fieldClassName: { type: null, default: undefined },
  fieldStyle: { type: null, default: undefined },
  helpText: { type: null, default: undefined },
  initValue: { type: null, default: undefined },
  isInInputGroup: { type: Boolean, default: false },
  keepState: { type: Boolean, default: false },
  label: { type: null, default: undefined },
  labelAlign: { type: String as PropType<'left' | 'right'>, default: undefined },
  labelCol: { type: Object, default: undefined },
  labelPosition: { type: String as PropType<'top' | 'left' | 'inset'>, default: undefined },
  labelWidth: { type: [Number, String], default: undefined },
  name: { type: String, default: undefined },
  noErrorMessage: { type: Boolean, default: false },
  noLabel: { type: Boolean, default: false },
  pure: { type: Boolean, default: false },
  required: { type: Boolean, default: undefined },
  rules: { type: Array, default: undefined },
  stopValidateWithError: { type: Boolean, default: undefined },
  transform: { type: Function as PropType<(value: unknown) => unknown>, default: undefined },
  trigger: { type: [String, Array] as PropType<FormTrigger | FormTrigger[]>, default: undefined },
  validate: { type: Function as PropType<FieldValidator>, default: undefined },
  validator: { type: Function as PropType<FieldValidator>, default: undefined },
  validateStatus: { type: String as PropType<FormValidateStatus>, default: undefined },
  wrapperCol: { type: Object, default: undefined },
};

function hasRawProp(vnode: VNode, key: string): boolean {
  const kebab = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    vnode.props &&
    (Object.prototype.hasOwnProperty.call(vnode.props, key) ||
      Object.prototype.hasOwnProperty.call(vnode.props, kebab)),
  );
}

function getPath(value: unknown, path?: string): unknown {
  if (!path) return value;
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

function callListener(listener: unknown, args: unknown[]): void {
  if (Array.isArray(listener)) {
    for (const entry of listener) callListener(entry, args);
  } else if (typeof listener === 'function') {
    (listener as (...values: unknown[]) => void)(...args);
  }
}

function isValidError(error: unknown): boolean {
  if (Array.isArray(error)) return error.filter(Boolean).length === 0;
  return error === undefined || error === null || error === false || error === '';
}

function labelObject(label: unknown): FormLabelProps {
  if (label && typeof label === 'object' && !isVNode(label)) return label as FormLabelProps;
  return { text: label as VNodeChild };
}

export function createFormField<Props extends object>(
  control: Component,
  options: InternalWithFieldOptions = {},
): FormFieldComponent<Props & CommonFieldProps> {
  const valueProp = options.valueProp ?? 'value';
  const changeListener = options.onUpdateEvent ?? 'onChange';

  const component = defineComponent({
    name: `FormField${typeof control === 'object' && 'name' in control ? String(control.name) : ''}`,
    inheritAttrs: false,
    props: commonFieldProps,
    setup(props, { attrs, slots, expose }) {
      const instance = getCurrentInstance()!;
      const context = inject(formContextKey, undefined);
      const arrayContext = inject(arrayFieldContextKey, undefined);
      const shouldInject = computed(
        () => Boolean(props.field) || options.shouldInjectByDefault !== false,
      );
      const controlRef = ref<unknown>();

      if (!context) {
        if (shouldInject.value) {
          console.warn('[Semi Form]: Field Component must be used inside the Form');
          return () => null;
        }
        return () => h(control, { ...attrs, ref: controlRef }, slots);
      }

      const field = computed(() => props.field ?? '');
      const initialFromForm = field.value ? context.updater.getValue(field.value) : undefined;
      const initialValue =
        props.initValue !== undefined && (!arrayContext || arrayContext.shouldUseInitValue)
          ? props.initValue
          : initialFromForm;
      const value = ref(initialValue);
      const error = ref<FormFieldError>();
      const touched = ref<boolean>();
      const status = ref<FormValidateStatus>(props.validateStatus ?? 'default');
      let validationToken = 0;
      let registered = false;

      const formProps = computed(() => context.props);
      const labelPosition = computed(
        () => props.labelPosition ?? formProps.value.labelPosition ?? 'top',
      );
      const labelWidth = computed(() => props.labelWidth ?? formProps.value.labelWidth);
      const labelAlign = computed(() => props.labelAlign ?? formProps.value.labelAlign ?? 'left');
      const labelCol = computed(() => props.labelCol ?? formProps.value.labelCol);
      const wrapperCol = computed(() => props.wrapperCol ?? formProps.value.wrapperCol);
      const extraPosition = computed(
        () => props.extraTextPosition ?? formProps.value.extraTextPosition ?? 'bottom',
      );
      const triggers = computed<FormTrigger[]>(() => {
        const source = props.trigger ?? formProps.value.trigger ?? 'change';
        return (Array.isArray(source) ? source : [source]) as FormTrigger[];
      });
      const stopAtFirstRule = computed(() =>
        hasRawProp(instance.vnode, 'stopValidateWithError')
          ? props.stopValidateWithError === true
          : (formProps.value.stopValidateWithError ?? false),
      );
      const allowEmpty = computed(
        () => props.allowEmptyString === true || formProps.value.allowEmpty === true,
      );
      const required = computed(
        () =>
          props.required === true ||
          (props.rules as import('async-validator').RuleItem[] | undefined)?.some(
            (rule) => rule.required === true,
          ) === true,
      );

      const updateError = (next: FormFieldError, callOptions: FoundationCallOptions = {}) => {
        if (!callOptions.silent) {
          error.value = next;
          status.value = isValidError(next) ? 'success' : 'error';
        }
        context.updater.updateStateError(field.value, next, callOptions);
      };
      const updateTouched = (
        next: boolean | undefined,
        callOptions: FoundationCallOptions = {},
      ) => {
        touched.value = next;
        context.updater.updateStateTouched(field.value, next, callOptions);
      };
      const updateValue = (next: unknown, callOptions: FoundationCallOptions = {}) => {
        value.value = next;
        context.updater.updateStateValue(field.value, next, {
          ...callOptions,
          fieldAllowEmpty: allowEmpty.value,
        });
      };

      const validate = async (
        candidate: unknown,
        callOptions: FoundationCallOptions = {},
      ): Promise<unknown> => {
        const token = ++validationToken;
        const transformed = props.transform ? props.transform(candidate) : candidate;
        const customValidator = props.validator ?? props.validate;
        let result: unknown;
        if (!customValidator && !props.rules?.length) return null;
        if (customValidator) {
          try {
            result = await customValidator(
              transformed,
              context.updater.getValue() as Record<string, unknown>,
            );
          } catch (caught) {
            result = caught instanceof Error ? caught.message : caught;
          }
        } else if (props.rules?.length) {
          const validator = new Schema({
            [field.value]: props.rules as import('async-validator').RuleItem[],
          });
          try {
            await validator.validate(
              { [field.value]: transformed },
              { first: stopAtFirstRule.value },
            );
            result = undefined;
          } catch (caught) {
            const validation = caught as { errors?: Array<{ message?: unknown }> };
            const messages = validation.errors?.map((item) => item.message) ?? [caught];
            result = messages.length === 1 ? messages[0] : messages;
          }
        }
        if (token !== validationToken) return result;
        updateError(isValidError(result) ? undefined : (result as FormFieldError), callOptions);
        return result;
      };

      const fieldApi: FoundationFieldApi = {
        setValue: updateValue,
        setError: updateError,
        setTouched: updateTouched,
        reset: () => {
          const resetValue =
            props.initValue !== undefined
              ? props.initValue
              : context.updater.getInitValue(field.value);
          updateValue(resetValue, { notNotify: true, notUpdate: true });
          updateError(undefined, { notNotify: true, notUpdate: true });
          updateTouched(undefined, { notNotify: true, notUpdate: true });
          status.value = 'default';
        },
        validate,
      };

      const handleChange = (...args: unknown[]) => {
        let next = getPath(args[0], options.valuePath);
        if (props.convert) next = props.convert(next);
        if (!allowEmpty.value && next === props.emptyValue) next = undefined;
        const previousLocal = value.value;
        const previousForm = context.updater.getValue(field.value, { needClone: true });
        try {
          value.value = next;
          context.updater.updateStateValue(field.value, next, {
            notNotify: true,
            notUpdate: true,
            fieldAllowEmpty: allowEmpty.value,
          });
          callListener(attrs[changeListener], [
            ...args,
            context.updater.getValue() as Record<string, unknown>,
          ]);
          touched.value = true;
          context.updater.updateStateTouched(field.value, true, {
            notNotify: true,
            notUpdate: true,
          });
          context.updater.updateStateValue(field.value, next, {
            fieldAllowEmpty: allowEmpty.value,
          });
          if (triggers.value.includes('change')) void validate(next);
        } catch (caught) {
          value.value = previousLocal;
          context.updater.updateStateValue(field.value, previousForm, {
            notNotify: true,
            notUpdate: true,
            fieldAllowEmpty: allowEmpty.value,
          });
          throw caught;
        }
      };

      const handleBlur = (...args: unknown[]) => {
        callListener(attrs.onBlur, args);
        if (!touched.value) updateTouched(true);
        if (triggers.value.includes('blur')) void validate(value.value);
      };

      onMounted(() => {
        if (!shouldInject.value || !field.value) return;
        if (props.keepState && arrayContext?.inArrayField) {
          console.warn(
            `[Semi Form]: 'keepState' is not supported on Field "${field.value}" inside <ArrayField/>.`,
          );
        }
        context.updater.register(
          field.value,
          { value: value.value, error: error.value, touched: touched.value, status: status.value },
          {
            field: field.value,
            fieldApi,
            keepState: arrayContext?.inArrayField ? false : props.keepState,
            allowEmpty: allowEmpty.value,
          },
        );
        registered = true;
        if (triggers.value.includes('mount')) void validate(value.value);
      });

      onBeforeUnmount(() => {
        validationToken += 1;
        if (registered) context.updater.unRegister(field.value);
      });

      expose(
        new Proxy(
          {},
          {
            get: (_target, key) =>
              (controlRef.value as Record<PropertyKey, unknown> | undefined)?.[key],
          },
        ),
      );

      const renderControl = () => {
        if (!shouldInject.value) return h(control, { ...attrs, ref: controlRef }, slots);
        const id = (attrs.id as string | undefined) ?? field.value;
        const labelId = `${id}-label`;
        const helpTextId = `${id}-helpText`;
        const extraTextId = `${id}-extraText`;
        const errorMessageId = `${id}-errormessage`;
        const rawDisabled = hasRawProp(instance.vnode, 'disabled');
        const controlProps: Record<string, unknown> = {
          ...attrs,
          ref: controlRef,
          id,
          name: props.name,
          [valueProp]: value.value,
          validateStatus: props.validateStatus ?? status.value,
          ariaRequired: required.value,
          ariaLabelledby: labelId,
          onBlur: handleBlur,
          [changeListener]: handleChange,
        };
        if (!rawDisabled && formProps.value.disabled !== undefined) {
          controlProps.disabled = formProps.value.disabled;
        }
        if (props.helpText || props.extraText) {
          controlProps.ariaDescribedby = [
            props.helpText ? helpTextId : undefined,
            props.extraText ? extraTextId : undefined,
          ]
            .filter(Boolean)
            .join(' ');
        }
        if (status.value === 'error') {
          controlProps.ariaErrormessage = errorMessageId;
          controlProps.ariaInvalid = true;
        }
        if (labelPosition.value === 'inset' && !props.noLabel) {
          const normalized = labelObject(props.label ?? field.value);
          controlProps.insetLabel = normalized.text;
          controlProps.insetLabelId = labelId;
        }
        return h(control, controlProps, slots);
      };

      const renderLabel = () => {
        if (props.noLabel || labelPosition.value === 'inset') return undefined;
        const normalized = labelObject(props.label ?? field.value);
        return h(FormLabel as Component, {
          ...normalized,
          id: `${(attrs.id as string | undefined) ?? field.value}-label`,
          required: normalized.required ?? required.value,
          disabled: normalized.disabled ?? Boolean(formProps.value.disabled),
          name: normalized.name ?? ((attrs.id as string | undefined) || props.name || field.value),
          width: normalized.width ?? labelWidth.value,
          align: normalized.align ?? labelAlign.value,
        });
      };

      const renderExtra = () =>
        props.extraText
          ? h(
              'div',
              {
                id: `${(attrs.id as string | undefined) ?? field.value}-extraText`,
                class: [
                  'semi-form-field-extra',
                  typeof props.extraText === 'string' ? 'semi-form-field-extra-string' : undefined,
                  `semi-form-field-extra-${extraPosition.value}`,
                ],
                'x-semi-prop': 'extraText',
              },
              [h(FormNodeRenderer, { content: props.extraText })],
            )
          : undefined;

      return () => {
        if (!shouldInject.value) return h(control, { ...attrs, ref: controlRef }, slots);
        const renderedControl = renderControl();
        if (props.isInInputGroup) return renderedControl;
        if (props.pure) {
          return h(
            control,
            {
              ...attrs,
              ref: controlRef,
              class: [attrs.class, 'semi-form-field-pure', props.fieldClassName],
              [valueProp]: value.value,
              [changeListener]: handleChange,
              onBlur: handleBlur,
            },
            slots,
          );
        }

        const label = renderLabel();
        const extra = renderExtra();
        const main = h('div', { class: 'semi-form-field-main' }, [
          extraPosition.value === 'middle' ? extra : undefined,
          renderedControl,
          props.noErrorMessage
            ? undefined
            : h(FormErrorMessage as Component, {
                error: error.value,
                validateStatus: props.validateStatus ?? status.value,
                helpText: props.helpText,
                helpTextId: `${(attrs.id as string | undefined) ?? field.value}-helpText`,
                errorMessageId: `${(attrs.id as string | undefined) ?? field.value}-errormessage`,
                showValidateIcon: formProps.value.showValidateIcon,
              }),
          extraPosition.value === 'bottom' ? extra : undefined,
        ]);
        const withColumns = labelCol.value && wrapperCol.value;
        const content = withColumns
          ? [
              labelPosition.value === 'top'
                ? h('div', { style: { overflow: 'hidden' } }, [
                    h(
                      Col,
                      { ...labelCol.value, class: `semi-form-col-${labelAlign.value}` },
                      () => label,
                    ),
                  ])
                : h(
                    Col,
                    { ...labelCol.value, class: `semi-form-col-${labelAlign.value}` },
                    () => label,
                  ),
              h(Col, wrapperCol.value, () => main),
            ]
          : [label, main];
        return h(
          'div',
          {
            class: [
              'semi-form-field',
              props.name ? `semi-form-field-${props.name}` : undefined,
              props.fieldClassName,
            ],
            style: props.fieldStyle,
            'x-label-pos': labelPosition.value,
            'x-field-id': field.value,
            'x-extra-pos': extraPosition.value,
          },
          content,
        );
      };
    },
  });

  Object.defineProperty(component, '__semiFormField', { value: true });
  return component as unknown as FormFieldComponent<Props & CommonFieldProps>;
}

export function isFormFieldVNode(value: unknown): value is VNode {
  return (
    isVNode(value) &&
    value.type !== Comment &&
    typeof value.type === 'object' &&
    Boolean((value.type as { __semiFormField?: boolean }).__semiFormField)
  );
}

export const withField = createFormField;
