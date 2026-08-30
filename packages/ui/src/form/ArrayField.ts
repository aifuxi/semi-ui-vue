import cloneDeep from 'lodash/cloneDeep.js';
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  reactive,
  ref,
  useId,
  watch,
} from 'vue';

import { arrayFieldContextKey, formContextKey } from './form-context';
import type { ArrayFieldProps, ArrayFieldSlots } from './types';

export default defineComponent({
  name: 'ArrayField',
  props: {
    field: { type: String, required: true },
    initValue: { type: Array, default: undefined },
  },
  setup(rawProps, { slots }) {
    const props = rawProps as Readonly<ArrayFieldProps>;
    const context = inject(formContextKey);
    if (!context) {
      console.warn('[Semi Form]: ArrayField must be used inside Form');
      return () => null;
    }
    const baseId = useId().replaceAll(':', '');
    let sequence = 0;
    const nextKey = () => `${baseId}-${sequence++}`;
    const existingArrayField = context.updater.getArrayField(props.field);
    const formValue = context.updater.getValue(props.field);
    const initial = Array.isArray(props.initValue)
      ? cloneDeep(props.initValue)
      : Array.isArray(formValue)
        ? cloneDeep(formValue)
        : [];
    const keys = ref(initial.map(nextKey));
    let cachedUpdateKey = existingArrayField?.updateKey;
    const arrayContext = reactive({
      inArrayField: true,
      shouldUseInitValue: !existingArrayField,
    });

    context.updater.registerArrayField(props.field, cloneDeep(initial));
    context.updater.updateStateValue(props.field, cloneDeep(initial), {
      notNotify: true,
      notUpdate: true,
    });
    provide(arrayFieldContextKey, arrayContext);

    watch(
      context.state,
      () => {
        const updateKey = context.updater.getArrayField(props.field)?.updateKey;
        const value = context.updater.getValue(props.field);
        if (
          updateKey === cachedUpdateKey &&
          Array.isArray(value) &&
          value.length === keys.value.length
        ) {
          return;
        }
        if (updateKey !== cachedUpdateKey) arrayContext.shouldUseInitValue = false;
        cachedUpdateKey = updateKey;
        if (!Array.isArray(value)) {
          keys.value = [];
          return;
        }
        keys.value = value.map((_entry, index) => keys.value[index] ?? nextKey());
      },
      { flush: 'sync' },
    );

    const announceUpdate = () => {
      const updateKey = Date.now() + sequence / 1000;
      cachedUpdateKey = updateKey;
      context.updater.updateArrayField(props.field, { updateKey });
    };

    const add = (index?: number): string => {
      arrayContext.shouldUseInitValue = true;
      const key = nextKey();
      const target =
        typeof index === 'number'
          ? Math.max(0, Math.min(index, keys.value.length))
          : keys.value.length;
      keys.value.splice(target, 0, key);
      const current = context.updater.getValue(props.field);
      const values = Array.isArray(current) ? [...current] : [];
      values.splice(target, 0, undefined);
      context.updater.updateStateValue(props.field, values, {});
      announceUpdate();
      return key;
    };

    const addWithInitValue = (rowValue: unknown, index?: number): void => {
      arrayContext.shouldUseInitValue = false;
      const current = context.updater.getValue(props.field);
      const values = Array.isArray(current) ? cloneDeep(current) : [];
      const target =
        typeof index === 'number' ? Math.max(0, Math.min(index, values.length)) : values.length;
      values.splice(target, 0, cloneDeep(rowValue));
      keys.value.splice(target, 0, nextKey());
      context.updater.updateStateValue(props.field, values, {});
      announceUpdate();
    };

    const remove = (index: number): void => {
      keys.value.splice(index, 1);
      const current = context.updater.getValue(props.field);
      const values = Array.isArray(current) ? [...current] : [];
      values.splice(index, 1);
      const currentErrors = context.updater.getError(props.field);
      if (Array.isArray(currentErrors)) {
        const errors = [...currentErrors];
        errors.splice(index, 1);
        context.updater.updateStateError(props.field, errors, { notNotify: true, notUpdate: true });
      }
      context.updater.updateStateValue(props.field, values, {});
      announceUpdate();
    };

    onBeforeUnmount(() => context.updater.unRegisterArrayField(props.field));

    return () => {
      const slotProps: Parameters<NonNullable<ArrayFieldSlots['default']>>[0] = {
        add,
        addWithInitValue,
        arrayFields: keys.value.map((key, index) => ({
          key,
          field: `${props.field}[${index}]`,
          remove: () => remove(index),
        })),
      };
      return slots.default?.(slotProps);
    };
  },
});
