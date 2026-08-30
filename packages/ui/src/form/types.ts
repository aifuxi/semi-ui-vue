import type {
  Component,
  ComponentPublicInstance,
  ComputedRef,
  CSSProperties,
  DefineComponent,
  HTMLAttributes,
  Ref,
  VNodeChild,
} from 'vue';

import type { AutoCompleteProps } from '../auto-complete';
import type { CascaderProps } from '../cascader';
import type { CheckboxGroupProps, CheckboxProps } from '../checkbox';
import type { DatePickerProps } from '../date-picker';
import type { ColProps } from '../grid';
import type { InputGroupProps, InputProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { PinCodeProps } from '../pin-code';
import type { RadioGroupProps, RadioProps } from '../radio';
import type { RatingProps } from '../rating';
import type { SelectProps } from '../select';
import type { SliderProps } from '../slider';
import type { SwitchProps } from '../switch';
import type { TagInputProps } from '../tag-input';
import type { TimePickerProps } from '../time-picker';
import type { TreeSelectProps } from '../tree-select';
import type { UploadProps } from '../upload';

export type FormLayout = 'vertical' | 'horizontal';
export type FormLabelPosition = 'top' | 'left' | 'inset';
export type FormLabelAlign = 'left' | 'right';
export type FormValidateStatus = 'default' | 'error' | 'warning' | 'success';
export type FormTrigger = 'blur' | 'change' | 'custom' | 'mount';
export type FormFieldError = boolean | string | unknown[] | VNodeChild | undefined;

export type FormRuleType =
  | 'any'
  | 'array'
  | 'boolean'
  | 'date'
  | 'email'
  | 'enum'
  | 'float'
  | 'hex'
  | 'integer'
  | 'method'
  | 'number'
  | 'object'
  | 'regexp'
  | 'string'
  | 'url';

export interface FormRule {
  asyncValidator?: (...args: unknown[]) => void | Promise<void>;
  defaultField?: FormRule;
  enum?: Array<boolean | null | number | string | undefined>;
  fields?: Record<string, FormRule | FormRule[]>;
  len?: number;
  max?: number;
  message?: string | (() => string);
  min?: number;
  options?: Record<string, unknown>;
  pattern?: RegExp | string;
  required?: boolean;
  transform?: (value: unknown) => unknown;
  type?: FormRuleType;
  validator?: (...args: unknown[]) => boolean | Error | Error[];
  whitespace?: boolean;
}

export interface FormState<Values extends Record<string, unknown> = Record<string, unknown>> {
  values: Values;
  errors: Record<string, FormFieldError>;
  touched: Record<string, unknown>;
}

export interface FormValidateOptions<Field extends string = string> {
  fields?: Field[];
  silent?: boolean;
}

export interface FormScrollToErrorOptions {
  field?: string;
  index?: number;
  scrollOpts?: ScrollIntoViewOptions;
}

export interface ScrollIntoViewOptions {
  behavior?: 'auto' | 'smooth' | ((actions: unknown[]) => unknown[]);
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  scrollMode?: 'always' | 'if-needed';
  boundary?: Element | ((parent: Element) => boolean) | null;
}

export interface FormApi<Values extends Record<string, unknown> = Record<string, unknown>> {
  getValue(field?: string): unknown;
  setValue(field: string, value: unknown): void;
  getValues(): Values;
  setValues(values: Partial<Values>, options?: { isOverride?: boolean }): void;
  getError(field?: string): FormFieldError | Record<string, FormFieldError>;
  setError(field: string, error: FormFieldError): void;
  getTouched(field?: string): unknown;
  setTouched(field: string, touched: boolean): void;
  getFormState(): FormState<Values>;
  getFormProps(fields?: string[]): Partial<FormProps<Values>>;
  getInitValue(field: string): unknown;
  getInitValues(): Values;
  getFieldExist(field: string): boolean;
  reset(fields?: string[]): void;
  validate(fields?: string[] | FormValidateOptions): Promise<Values>;
  submitForm(): void;
  scrollToField(field: string, options?: ScrollIntoViewOptions): void;
  scrollToError(options?: FormScrollToErrorOptions): void;
}

export interface FieldApi {
  getError(): FormFieldError;
  setError(error: FormFieldError): void;
  getTouched(): unknown;
  setTouched(touched: boolean): void;
  getValue(): unknown;
  setValue(value: unknown): void;
}

export interface FormSlotProps<Values extends Record<string, unknown> = Record<string, unknown>> {
  formState: FormState<Values>;
  formApi: FormApi<Values>;
  values: Values;
}

export interface FormProps<Values extends Record<string, unknown> = Record<string, unknown>> {
  allowEmpty?: boolean;
  ariaLabel?: string;
  autoScrollToError?: boolean | ScrollIntoViewOptions;
  className?: HTMLAttributes['class'];
  component?: Component;
  disabled?: boolean;
  extraTextPosition?: 'middle' | 'bottom';
  form?: FormApi<Values>;
  getFormApi?: (formApi: FormApi<Values>) => void;
  id?: string;
  initValues?: Partial<Values>;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  labelPosition?: FormLabelPosition;
  labelWidth?: number | string;
  layout?: FormLayout;
  render?: (props: FormSlotProps<Values>) => VNodeChild;
  showValidateIcon?: boolean;
  stopPropagation?: { submit?: boolean; reset?: boolean };
  stopValidateWithError?: boolean;
  style?: CSSProperties;
  trigger?: FormTrigger | FormTrigger[];
  validateFields?: FormValidator<Values>;
  validator?: FormValidator<Values>;
  wrapperCol?: ColProps;
}

export type FormValidator<Values extends Record<string, unknown>> = (
  values: Values,
) =>
  | string
  | Partial<Record<keyof Values, FormFieldError>>
  | Promise<string | Partial<Record<keyof Values, FormFieldError>>>;

export interface FormEmits<Values extends Record<string, unknown> = Record<string, unknown>> {
  change: [formState: FormState<Values>];
  errorChange: [
    errors: Record<string, FormFieldError>,
    changedErrors: Record<string, FormFieldError>,
  ];
  reset: [];
  submit: [values: Values, event?: Event];
  submitFail: [errors: unknown, values: Values, event?: Event];
  valueChange: [values: Values, changedValues: Partial<Values>];
}

export interface FormSlots<Values extends Record<string, unknown> = Record<string, unknown>> {
  default?: (props: FormSlotProps<Values>) => VNodeChild;
}

export interface FormLabelProps {
  align?: FormLabelAlign;
  className?: HTMLAttributes['class'];
  disabled?: boolean;
  extra?: VNodeChild;
  id?: string;
  name?: string;
  optional?: boolean;
  required?: boolean;
  style?: CSSProperties;
  text?: VNodeChild;
  width?: number | string;
}

export interface FormErrorMessageProps {
  className?: HTMLAttributes['class'];
  error?: FormFieldError;
  errorMessageId?: string;
  helpText?: VNodeChild;
  helpTextId?: string;
  isInInputGroup?: boolean;
  showValidateIcon?: boolean;
  style?: CSSProperties;
  validateStatus?: FormValidateStatus;
}

export interface CommonFieldProps {
  allowEmptyString?: boolean;
  convert?: (value: unknown) => unknown;
  emptyValue?: unknown;
  extraText?: VNodeChild;
  extraTextPosition?: 'middle' | 'bottom';
  field: string;
  fieldClassName?: HTMLAttributes['class'];
  fieldStyle?: CSSProperties;
  helpText?: VNodeChild;
  initValue?: unknown;
  keepState?: boolean;
  label?: FormLabelProps | VNodeChild;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  labelPosition?: FormLabelPosition;
  labelWidth?: number | string;
  name?: string;
  noErrorMessage?: boolean;
  noLabel?: boolean;
  pure?: boolean;
  required?: boolean;
  rules?: FormRule[];
  stopValidateWithError?: boolean;
  transform?: (value: unknown) => unknown;
  trigger?: FormTrigger | FormTrigger[];
  validate?: FieldValidator;
  validator?: FieldValidator;
  validateStatus?: FormValidateStatus;
  wrapperCol?: ColProps;
}

export type FieldValidator = (
  fieldValue: unknown,
  values: Record<string, unknown>,
) => string | undefined | Promise<string | undefined>;

type StandardFieldProps<Props> = Omit<Props, 'defaultValue' | 'modelValue' | 'value'> &
  CommonFieldProps;
type CheckedFieldProps<Props> = Omit<Props, 'checked' | 'defaultChecked' | 'modelValue'> &
  CommonFieldProps;
type UploadFieldProps<Props> = Omit<Props, 'defaultFileList' | 'fileList' | 'modelValue'> &
  CommonFieldProps;
type OptionalField<Props> = Omit<Props, 'field'> & { field?: string };

export type FormInputProps = StandardFieldProps<InputProps>;
export type FormTextAreaProps = StandardFieldProps<TextAreaProps>;
export type FormInputNumberProps = StandardFieldProps<InputNumberProps>;
export type FormSelectProps = StandardFieldProps<SelectProps>;
export type FormCheckboxProps = OptionalField<CheckedFieldProps<CheckboxProps>>;
export type FormCheckboxGroupProps = StandardFieldProps<CheckboxGroupProps>;
export type FormRadioProps = OptionalField<CheckedFieldProps<RadioProps>>;
export type FormRadioGroupProps = StandardFieldProps<RadioGroupProps>;
export type FormDatePickerProps = StandardFieldProps<DatePickerProps>;
export type FormSwitchProps = CheckedFieldProps<SwitchProps>;
export type FormSliderProps = StandardFieldProps<SliderProps>;
export type FormTimePickerProps = StandardFieldProps<TimePickerProps>;
export type FormTreeSelectProps = StandardFieldProps<TreeSelectProps>;
export type FormCascaderProps = StandardFieldProps<CascaderProps>;
export type FormRatingProps = StandardFieldProps<RatingProps>;
export type FormAutoCompleteProps = StandardFieldProps<AutoCompleteProps>;
export type FormUploadProps = UploadFieldProps<UploadProps>;
export type FormTagInputProps = StandardFieldProps<TagInputProps>;
export type FormPinCodeProps = StandardFieldProps<PinCodeProps>;

export interface FormSectionProps {
  className?: HTMLAttributes['class'];
  style?: CSSProperties;
  text?: VNodeChild;
}

export interface FormSlotComponentProps {
  className?: HTMLAttributes['class'];
  label?: FormLabelProps | VNodeChild;
  style?: CSSProperties;
}

export interface FormInputGroupProps extends Omit<InputGroupProps, 'label'> {
  extraText?: VNodeChild;
  extraTextPosition?: 'bottom' | 'middle';
  label?: FormLabelProps | VNodeChild;
  labelPosition?: 'left' | 'top';
}

export interface ArrayFieldItem {
  key: string;
  field: string;
  remove(): void;
}

export interface ArrayFieldSlotProps {
  add(index?: number): string;
  addWithInitValue(value: unknown, index?: number): void;
  arrayFields: ArrayFieldItem[];
}

export interface ArrayFieldProps {
  field: string;
  initValue?: unknown[];
}

export interface ArrayFieldSlots {
  default?: (props: ArrayFieldSlotProps) => VNodeChild;
}

export interface FormUseResult<Values extends Record<string, unknown>> {
  0: FormApi<Values>;
  1: Ref<FormState<Values>>;
  2: ComputedRef<Values>;
  length: 3;
}

export type FormFieldComponent<Props> = DefineComponent<Props>;

export interface WithFieldOptions {
  maintainCursor?: boolean;
  onUpdateEvent?: string;
  valueProp?: string;
  valuePath?: string;
}

export type WithField = <Props extends Record<string, unknown>>(
  component: Component,
  options?: WithFieldOptions,
) => FormFieldComponent<Props & CommonFieldProps>;

export type FormComponentPublicInstance = ComponentPublicInstance<FormProps>;
