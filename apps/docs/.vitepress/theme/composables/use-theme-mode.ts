import { computed, onMounted, ref } from 'vue';

export type DocsThemeMode = 'light' | 'dark';

const storageKey = 'semi-docs-theme';
const mode = ref<DocsThemeMode>('light');
let initialized = false;

function apply(next: DocsThemeMode): void {
  mode.value = next;
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('theme-mode', next);
  document.documentElement.setAttribute('data-theme', next);
  document.body?.setAttribute('theme-mode', next);
}

export function useThemeMode() {
  onMounted(() => {
    if (!initialized) {
      initialized = true;
      const stored = window.localStorage.getItem(storageKey);
      apply(stored === 'dark' ? 'dark' : 'light');
    }
  });

  function toggle(): void {
    const next: DocsThemeMode = mode.value === 'dark' ? 'light' : 'dark';
    apply(next);
    window.localStorage.setItem(storageKey, next);
  }

  return {
    mode,
    isDark: computed(() => mode.value === 'dark'),
    toggle,
  };
}
