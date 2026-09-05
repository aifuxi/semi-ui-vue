try {
  const saved = localStorage.getItem('semi-docs-theme') || localStorage.getItem('starlight-theme');
  const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.addEventListener(
    'DOMContentLoaded',
    () => document.body.setAttribute('theme-mode', dark ? 'dark' : 'light'),
    { once: true },
  );
} catch {
  document.documentElement.dataset.theme = 'light';
}
