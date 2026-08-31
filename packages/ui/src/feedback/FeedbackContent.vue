<script setup lang="ts">
import { computed, type VNodeChild } from 'vue';

import { CheckboxGroup, type CheckboxValue } from '../checkbox';
import { TextArea } from '../input';
import { RadioGroup, type RadioChangeEvent } from '../radio';

import type {
  FeedbackCheckboxGroupProps,
  FeedbackEmojiResult,
  FeedbackRadioGroupProps,
  FeedbackTextAreaProps,
  FeedbackType,
  FeedbackValue,
} from './types';

defineOptions({ name: 'FeedbackContent', inheritAttrs: false });
const props = defineProps<{
  checkboxGroupProps?: FeedbackCheckboxGroupProps;
  radioGroupProps?: FeedbackRadioGroupProps;
  textAreaProps?: FeedbackTextAreaProps;
  type: FeedbackType;
  value: FeedbackValue;
}>();
const emit = defineEmits<{
  checkboxChange: [value: CheckboxValue[]];
  emojiClick: [event: MouseEvent];
  emojiReasonChange: [value: string, event: Event];
  radioChange: [event: RadioChangeEvent];
  textChange: [value: string, event: Event];
}>();
defineSlots<{ default?: () => VNodeChild }>();

const emoji = computed(() => (props.value as FeedbackEmojiResult | null)?.emoji);
const textAreaBindings = computed<Record<string, unknown>>(() => ({
  placeholder: 'Provider additional feedback',
  ...props.textAreaProps,
  onChange:
    props.textAreaProps?.onChange ??
    ((value: string, event: Event) => emit('textChange', value, event)),
}));
const emojiReasonBindings = computed<Record<string, unknown>>(() => ({
  placeholder: 'Provider additional feedback(optional)',
  ...props.textAreaProps,
  onChange:
    props.textAreaProps?.onChange ??
    ((value: string, event: Event) => emit('emojiReasonChange', value, event)),
}));
const radioBindings = computed<Record<string, unknown>>(() => {
  const bindings = { direction: 'vertical', ...props.radioGroupProps };
  delete bindings.onChange;
  return bindings;
});
const checkboxBindings = computed<Record<string, unknown>>(() => {
  const bindings = { direction: 'vertical', ...props.checkboxGroupProps };
  delete bindings.onChange;
  return bindings;
});
</script>

<template>
  <slot v-if="type === 'custom'" />
  <TextArea v-else-if="type === 'text'" v-bind="textAreaBindings" />
  <template v-else-if="type === 'emoji'">
    <div class="semi-feedback-emoji-container">
      <span
        v-for="item in ['😞', '😐', '😃']"
        :key="item"
        class="semi-feedback-emoji-item"
        :class="{ 'semi-feedback-emoji-item-selected': item === emoji }"
        :data-value="item"
        @click="emit('emojiClick', $event)"
        >{{ item }}</span
      >
    </div>
    <TextArea v-if="emoji === '😞'" v-bind="emojiReasonBindings" />
  </template>
  <div v-else-if="type === 'radio'" class="semi-feedback-radio-container">
    <RadioGroup v-bind="radioBindings" @change="emit('radioChange', $event)" />
  </div>
  <div v-else-if="type === 'checkbox'" class="semi-feedback-checkbox-container">
    <CheckboxGroup v-bind="checkboxBindings" @change="emit('checkboxChange', $event)" />
  </div>
</template>
