import { computed, onMounted, watch } from 'vue';
import { useRoute, useState } from '#imports';
import { localeFromPath } from '../data/docs';

export function useDocsPreferences() {
  const route = useRoute();
  const locale = computed(() => localeFromPath(route.path));
  const theme = useState<'light' | 'dark'>('docs-theme', () => 'light');
  const mounted = useState('docs-preferences-mounted', () => false);

  onMounted(() => {
    if (!mounted.value) {
      theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      mounted.value = true;
    }
  });
  watch(theme, (value) => {
    if (!import.meta.client) return;
    document.documentElement.dataset.theme = value;
    document.body.setAttribute('theme-mode', value);
    try {
      localStorage.setItem('semi-docs-theme', value);
    } catch {
      /* Storage is optional. */
    }
  });
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }
  return { locale, theme, toggleTheme };
}
