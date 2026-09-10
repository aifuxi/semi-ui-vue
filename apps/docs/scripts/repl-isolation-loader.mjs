export default function isolateRepl(code) {
  if (this.resourcePath.endsWith('/monaco-editor.js')) {
    return code
      .replace(
        /new URL\("assets\/([^"/]+)", import\.meta\.url\)/g,
        'new URL("/repl/workers/$1", window.location.origin)',
      )
      .replace(
        'import(`${FileAccess.asBrowserUri',
        'import(/* webpackIgnore: true */ `${FileAccess.asBrowserUri',
      );
  }
  // Edited code must not gain the documentation origin's DOM or storage access.
  return (
    code
      .replace(/"allow-(?:same-origin|popups|top-navigation-by-user-activation)",?/g, '')
      .replace('sandbox.contentWindow?.location.reload();', 'createSandbox();')
      // The existing load handler must update the opaque-origin iframe, not recreate it.
      .replace(
        /function switchPreviewTheme\(\) \{[\s\S]*?\n\t\t\}/,
        `function switchPreviewTheme() {
        sandbox.contentWindow.postMessage({ action: 'docs-theme', theme: theme.value }, '*');
      }`,
      )
  );
}
