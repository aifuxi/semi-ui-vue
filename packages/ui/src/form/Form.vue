<script setup lang="ts">
import {
  FormFoundation,
  type FormFoundationAdapter,
  type FoundationFormState,
  type FoundationFormUpdater,
} from '@workspace/foundation-integration';
import cloneDeep from 'lodash/cloneDeep.js';
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useAttrs,
  useId,
} from 'vue';

import { Row } from '../grid';
import { formContextKey } from './form-context';
import FormNodeRenderer from './FormNodeRenderer';
import type { ExternalFormController } from './internal-types';
import type { FormApi, FormFieldError, FormProps, FormSlots, FormState } from './types';

defineOptions({ name: 'Form', inheritAttrs: false });

const props = withDefaults(defineProps<FormProps>(), {
  allowEmpty: false,
  autoScrollToError: false,
  layout: 'vertical',
  labelPosition: 'top',
  labelAlign: 'left',
  showValidateIcon: true,
  stopValidateWithError: false,
  extraTextPosition: 'bottom',
  trigger: 'change',
});
const emit = defineEmits<{
  change: [formState: FormState];
  errorChange: [
    errors: Record<string, FormFieldError>,
    changedErrors: Record<string, FormFieldError>,
  ];
  reset: [];
  submit: [values: Record<string, unknown>, event?: Event];
  submitFail: [errors: unknown, values: Record<string, unknown>, event?: Event];
  valueChange: [values: Record<string, unknown>, changedValues: Record<string, unknown>];
}>();
defineSlots<FormSlots>();
const attrs = useAttrs();
const generatedId = `semi-form-${useId().replaceAll(':', '')}`;
const formId = ref(props.id ?? generatedId);
const formElement = ref<HTMLFormElement>();
const cache = new Map<unknown, unknown>();
const localState = shallowRef<FormState>({ values: {}, errors: {}, touched: {} });

const runtimeProps = computed<Record<string, unknown>>(() => ({
  ...props,
  initValues: props.initValues ?? {},
}));

let foundation!: FormFoundation<Record<string, unknown>>;
const adapter: FormFoundationAdapter<Record<string, unknown>> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps.value[key],
  getProps: () => runtimeProps.value,
  getState: () => undefined,
  getStates: () => ({}),
  setState: (_state, callback) => callback?.(),
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => (cache.set(key, value), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  cloneDeep,
  getInitValues: () => cloneDeep((props.initValues ?? {}) as Record<string, unknown>),
  getFormProps: (fields) => {
    if (!fields) return runtimeProps.value;
    return Object.fromEntries(fields.map((field) => [field, runtimeProps.value[field]]));
  },
  notifySubmit: (values, event) => emit('submit', values, event),
  notifySubmitFail: (errors, values, event) => emit('submitFail', errors, values, event),
  notifyChange: (state) => emit('change', cloneState(state)),
  notifyValueChange: (values, changedValues) =>
    emit('valueChange', cloneDeep(values), cloneDeep(changedValues)),
  notifyErrorChange: (errors, changedErrors) =>
    emit(
      'errorChange',
      cloneDeep(errors) as Record<string, FormFieldError>,
      cloneDeep(changedErrors) as Record<string, FormFieldError>,
    ),
  notifyReset: () => emit('reset'),
  forceUpdate: (callback) => {
    localState.value = cloneState(foundation.getFormState());
    const controller = props.form as ExternalFormController | undefined;
    controller?.__updateState?.(cloneDeep(localState.value));
    callback?.();
  },
  initFormId: () => {
    formId.value = props.id ?? generatedId;
  },
  getFormDOM: () => formElement.value ?? null,
  getAllErrorDOM: () =>
    formElement.value?.querySelectorAll<HTMLElement>('.semi-form-field-error-message') ?? [],
  getFieldDOM: (field) => queryField(field),
  getFieldErrorDOM: (field) =>
    queryField(field)?.querySelector<HTMLElement>('.semi-form-field-error-message') ?? null,
};

foundation = markRaw(new FormFoundation(adapter));
const formApi = markRaw(foundation.getFormApi() as unknown as FormApi);
const updater = markRaw(foundation.getModifyFormStateApi() as FoundationFormUpdater);
localState.value = cloneState(foundation.getFormState());

provide(formContextKey, {
  api: formApi,
  props: props as unknown as Readonly<FormProps>,
  state: localState,
  updater,
});

const formClass = computed(() => [
  'semi-form',
  `semi-form-${props.layout}`,
  props.className,
  attrs.class,
]);
const forwardedAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
);
const slotProps = computed(() => ({
  formApi,
  formState: localState.value,
  values: localState.value.values,
}));
const renderedContent = computed(() => props.render?.(slotProps.value));

function cloneState(state: FoundationFormState): FormState {
  return cloneDeep(state) as FormState;
}

function queryField(field: string): HTMLElement | null {
  const root = formElement.value;
  if (!root) return null;
  return (
    Array.from(root.querySelectorAll<HTMLElement>('[x-field-id]')).find(
      (element) => element.getAttribute('x-field-id') === field,
    ) ?? null
  );
}

function handleSubmit(event: Event): void {
  event.preventDefault();
  if (props.stopPropagation?.submit) event.stopPropagation();
  foundation.submit(event);
}

function handleReset(event: Event): void {
  event.preventDefault();
  if (props.stopPropagation?.reset) event.stopPropagation();
  foundation.reset();
}

onMounted(() => {
  foundation.init();
  localState.value = cloneState(foundation.getFormState());
  props.getFormApi?.(formApi);
  (props.form as ExternalFormController | undefined)?.__bind?.(formApi);
});

onBeforeUnmount(() => {
  foundation.destroy();
  (props.form as ExternalFormController | undefined)?.__unbind?.();
});

defineExpose({ formApi });
</script>

<template>
  <component
    :is="props.labelCol && props.wrapperCol ? Row : 'div'"
    v-if="props.labelCol && props.wrapperCol"
  >
    <form
      v-bind="forwardedAttrs"
      :id="formId"
      ref="formElement"
      :class="formClass"
      :style="[props.style, attrs.style]"
      :aria-label="props.ariaLabel"
      :x-form-id="formId"
      @submit="handleSubmit"
      @reset="handleReset"
    >
      <component :is="props.component" v-if="props.component" v-bind="slotProps" />
      <FormNodeRenderer v-else-if="props.render" :content="renderedContent" />
      <slot v-else v-bind="slotProps" />
    </form>
  </component>
  <form
    v-else
    v-bind="forwardedAttrs"
    :id="formId"
    ref="formElement"
    :class="formClass"
    :style="[props.style, attrs.style]"
    :aria-label="props.ariaLabel"
    :x-form-id="formId"
    @submit="handleSubmit"
    @reset="handleReset"
  >
    <component :is="props.component" v-if="props.component" v-bind="slotProps" />
    <FormNodeRenderer v-else-if="props.render" :content="renderedContent" />
    <slot v-else v-bind="slotProps" />
  </form>
</template>
