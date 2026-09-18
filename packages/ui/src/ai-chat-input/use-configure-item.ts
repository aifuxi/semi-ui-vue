import { computed, inject, onBeforeUnmount, onMounted } from 'vue';

import { configureContextKey, type ConfigureContextValue } from './configure-context';

/**
 * Shared wiring for AIChatInput.Configure items. Mirrors the pinned
 * `configure/getConfigureItem.tsx`: read the field value from the nearest
 * Configure, register `initValue` on mount and drop the field on unmount.
 */
export function useConfigureItem(
  field: () => string,
  initValue: () => unknown,
  errorMessage: string,
) {
  const injected = inject(configureContextKey);
  if (!injected) throw new Error(errorMessage);
  const configure: ConfigureContextValue = injected;

  const value = computed(() => configure.value.value[field()]);

  onMounted(() => {
    const initial = initValue();
    if (initial !== undefined && value.value === undefined) {
      configure.change(field(), initial);
    }
  });
  onBeforeUnmount(() => configure.remove(field()));

  function change(next: unknown): void {
    configure.change(field(), next);
  }

  return { value, change };
}
