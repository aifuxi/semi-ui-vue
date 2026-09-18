import { defineComponent, h, type Component, type PropType } from 'vue';

import { useConfigureItem } from './use-configure-item';
import type { AIChatInputGetConfigureItemOptions } from './types';

const ITEM_ERROR = 'getConfigureItem result must be inside AIChatInput.Configure';

function getByPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

/**
 * Vue counterpart of the pinned `getConfigureItem(Component, opts)` factory:
 * wrap any control so it participates in the nearest AIChatInput.Configure.
 */
export function getConfigureItem(
  Component: Component,
  options: AIChatInputGetConfigureItemOptions = {},
) {
  const {
    valueKey = 'value',
    onKeyChangeFnName = 'onChange',
    valuePath,
    className: optionClassName,
    defaultProps = {},
  } = options;

  return defineComponent({
    name: 'AIChatInputConfigureItemFactory',
    inheritAttrs: false,
    props: {
      field: { type: String, required: true },
      initValue: { type: null as unknown as PropType<unknown>, default: undefined },
      className: { type: [String, Object, Array] as PropType<unknown>, default: undefined },
      onChange: { type: Function as PropType<(value: unknown) => void>, default: undefined },
    },
    setup(props, { attrs }) {
      const { value, change } = useConfigureItem(
        () => props.field,
        () => props.initValue,
        ITEM_ERROR,
      );

      function onItemChange(next: unknown): void {
        const resolved = valuePath ? getByPath(next, valuePath) : next;
        change(resolved);
        props.onChange?.(resolved);
      }

      return () => {
        const bindings: Record<string, unknown> = {
          ...defaultProps,
          ...attrs,
          class: [attrs.class, props.className, optionClassName],
        };
        bindings[valueKey] = value.value;
        bindings[onKeyChangeFnName] = onItemChange;
        return h(Component, bindings);
      };
    },
  });
}
