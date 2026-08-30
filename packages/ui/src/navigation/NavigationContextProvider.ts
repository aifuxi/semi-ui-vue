import { defineComponent, provide, type PropType } from 'vue';

import { navigationContextKey, type NavigationContextValue } from './navigation-context';

export default defineComponent({
  name: 'NavigationContextProvider',
  props: {
    value: {
      type: Object as PropType<NavigationContextValue>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(navigationContextKey, props.value);
    return () => slots.default?.();
  },
});
