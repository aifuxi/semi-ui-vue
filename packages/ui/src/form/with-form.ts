/* eslint-disable vue/one-component-per-file -- the paired compatibility wrappers intentionally share one module. */
import { defineComponent, h, inject } from 'vue';
import type { Component } from 'vue';

import { formContextKey } from './form-context';

export function withFormApi(component: Component): Component {
  return defineComponent({
    name: 'WithFormApi',
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      const context = inject(formContextKey);
      if (!context) throw new Error('[Semi Form]: withFormApi component must be used inside Form');
      return () => h(component, { ...attrs, formApi: context.api }, slots);
    },
  });
}

export function withFormState(component: Component): Component {
  return defineComponent({
    name: 'WithFormState',
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      const context = inject(formContextKey);
      if (!context)
        throw new Error('[Semi Form]: withFormState component must be used inside Form');
      return () => h(component, { ...attrs, formState: context.state.value }, slots);
    },
  });
}
