import type { Component, DefineComponent } from 'vue';

import { AutoComplete, AutoCompleteOption } from '../auto-complete';
import { Cascader } from '../cascader';
import { Checkbox, CheckboxGroup } from '../checkbox';
import { DatePicker } from '../date-picker';
import { Input, TextArea } from '../input';
import { InputNumber } from '../input-number';
import { PinCode } from '../pin-code';
import { Radio, RadioGroup } from '../radio';
import { Rating } from '../rating';
import { Select, SelectOption, SelectOptionGroup } from '../select';
import { Slider } from '../slider';
import { Switch } from '../switch';
import { TagInput } from '../tag-input';
import { TimePicker } from '../time-picker';
import { TreeSelect } from '../tree-select';
import { Upload } from '../upload';
import ArrayFieldBase from './ArrayField';
import FormBase from './Form.vue';
import FormErrorMessage from './FormErrorMessage.vue';
import { createFormField, withField } from './FormField';
import FormInputGroup from './FormInputGroup';
import FormLabel from './FormLabel.vue';
import FormSection from './FormSection.vue';
import FormSlot from './FormSlot';
import type {
  ArrayFieldProps,
  FormAutoCompleteProps,
  FormCascaderProps,
  FormCheckboxGroupProps,
  FormCheckboxProps,
  FormDatePickerProps,
  FormFieldComponent,
  FormInputGroupProps,
  FormInputNumberProps,
  FormInputProps,
  FormPinCodeProps,
  FormProps,
  FormRadioGroupProps,
  FormRadioProps,
  FormRatingProps,
  FormSelectProps,
  FormSliderProps,
  FormSwitchProps,
  FormTagInputProps,
  FormTextAreaProps,
  FormTimePickerProps,
  FormTreeSelectProps,
  FormUploadProps,
} from './types';
import { useFieldApi, useFieldState, useForm, useFormApi, useFormState } from './use-form';
import { withFormApi, withFormState } from './with-form';

export const FormInput = createFormField<FormInputProps>(Input, { maintainCursor: true });
export const FormInputNumber = createFormField<FormInputNumberProps>(InputNumber, {
  maintainCursor: true,
});
export const FormTextArea = createFormField<FormTextAreaProps>(TextArea, {
  maintainCursor: true,
});
const FormSelectBase = createFormField<FormSelectProps>(Select);
export interface FormSelectComponent extends FormFieldComponent<FormSelectProps> {
  Option: Component;
  OptGroup: Component;
}
export const FormSelect = Object.assign(FormSelectBase, {
  Option: SelectOption,
  OptGroup: SelectOptionGroup,
}) as unknown as FormSelectComponent;
export const FormCheckboxGroup = createFormField<FormCheckboxGroupProps>(CheckboxGroup);
export const FormCheckbox = createFormField<FormCheckboxProps>(Checkbox, {
  valueProp: 'checked',
  valuePath: 'target.checked',
  shouldInjectByDefault: false,
}) as unknown as FormFieldComponent<FormCheckboxProps>;
export const FormRadioGroup = createFormField<FormRadioGroupProps>(RadioGroup, {
  valuePath: 'target.value',
});
export const FormRadio = createFormField<FormRadioProps>(Radio, {
  valueProp: 'checked',
  valuePath: 'target.checked',
  shouldInjectByDefault: false,
}) as unknown as FormFieldComponent<FormRadioProps>;
export const FormDatePicker = createFormField<FormDatePickerProps>(DatePicker);
export const FormSwitch = createFormField<FormSwitchProps>(Switch, { valueProp: 'checked' });
export const FormSlider = createFormField<FormSliderProps>(Slider);
export const FormTimePicker = createFormField<FormTimePickerProps>(TimePicker);
export const FormTreeSelect = createFormField<FormTreeSelectProps>(TreeSelect);
export const FormCascader = createFormField<FormCascaderProps>(Cascader);
export const FormRating = createFormField<FormRatingProps>(Rating);
const FormAutoCompleteBase = createFormField<FormAutoCompleteProps>(AutoComplete);
export interface FormAutoCompleteComponent extends FormFieldComponent<FormAutoCompleteProps> {
  Option: Component;
}
export const FormAutoComplete = Object.assign(FormAutoCompleteBase, {
  Option: AutoCompleteOption,
}) as unknown as FormAutoCompleteComponent;
export const FormUpload = createFormField<FormUploadProps>(Upload, {
  valueProp: 'fileList',
  valuePath: 'fileList',
});
export const FormTagInput = createFormField<FormTagInputProps>(TagInput);
export const FormPinCode = createFormField<FormPinCodeProps>(PinCode);

export const ArrayField = ArrayFieldBase as unknown as DefineComponent<ArrayFieldProps>;

export interface FormCompoundComponent extends DefineComponent<FormProps> {
  AutoComplete: typeof FormAutoComplete;
  Cascader: typeof FormCascader;
  Checkbox: typeof FormCheckbox;
  CheckboxGroup: typeof FormCheckboxGroup;
  DatePicker: typeof FormDatePicker;
  ErrorMessage: typeof FormErrorMessage;
  Input: typeof FormInput;
  InputGroup: DefineComponent<FormInputGroupProps>;
  InputNumber: typeof FormInputNumber;
  Label: typeof FormLabel;
  PinCode: typeof FormPinCode;
  Radio: typeof FormRadio;
  RadioGroup: typeof FormRadioGroup;
  Rating: typeof FormRating;
  Section: typeof FormSection;
  Select: typeof FormSelect;
  Slider: typeof FormSlider;
  Slot: typeof FormSlot;
  Switch: typeof FormSwitch;
  TagInput: typeof FormTagInput;
  TextArea: typeof FormTextArea;
  TimePicker: typeof FormTimePicker;
  TreeSelect: typeof FormTreeSelect;
  Upload: typeof FormUpload;
  useForm: typeof useForm;
}

export const Form = Object.assign(FormBase, {
  AutoComplete: FormAutoComplete,
  Cascader: FormCascader,
  Checkbox: FormCheckbox,
  CheckboxGroup: FormCheckboxGroup,
  DatePicker: FormDatePicker,
  ErrorMessage: FormErrorMessage,
  Input: FormInput,
  InputGroup: FormInputGroup,
  InputNumber: FormInputNumber,
  Label: FormLabel,
  PinCode: FormPinCode,
  Radio: FormRadio,
  RadioGroup: FormRadioGroup,
  Rating: FormRating,
  Section: FormSection,
  Select: FormSelect,
  Slider: FormSlider,
  Slot: FormSlot,
  Switch: FormSwitch,
  TagInput: FormTagInput,
  TextArea: FormTextArea,
  TimePicker: FormTimePicker,
  TreeSelect: FormTreeSelect,
  Upload: FormUpload,
  useForm,
}) as unknown as FormCompoundComponent;

export const Field = createFormField;

export {
  createFormField,
  useFieldApi,
  useFieldState,
  useForm,
  useFormApi,
  useFormState,
  withField,
  withFormApi,
  withFormState,
};
export type {
  ArrayFieldItem,
  ArrayFieldProps,
  ArrayFieldSlotProps,
  ArrayFieldSlots,
  CommonFieldProps,
  FieldApi,
  FieldValidator,
  FormApi,
  FormAutoCompleteProps,
  FormCascaderProps,
  FormCheckboxGroupProps,
  FormCheckboxProps,
  FormComponentPublicInstance,
  FormDatePickerProps,
  FormEmits,
  FormErrorMessageProps,
  FormFieldComponent,
  FormFieldError,
  FormInputGroupProps,
  FormInputNumberProps,
  FormInputProps,
  FormLabelAlign,
  FormLabelPosition,
  FormLabelProps,
  FormLayout,
  FormPinCodeProps,
  FormProps,
  FormRadioGroupProps,
  FormRadioProps,
  FormRatingProps,
  FormRule,
  FormRuleType,
  FormScrollToErrorOptions,
  FormSectionProps,
  FormSelectProps,
  FormSliderProps,
  FormSlotComponentProps,
  FormSlotProps,
  FormSlots,
  FormState,
  FormSwitchProps,
  FormTagInputProps,
  FormTextAreaProps,
  FormTimePickerProps,
  FormTreeSelectProps,
  FormTrigger,
  FormUploadProps,
  FormValidateOptions,
  FormValidateStatus,
  FormValidator,
  ScrollIntoViewOptions,
  WithField,
  WithFieldOptions,
} from './types';

export default Form;
