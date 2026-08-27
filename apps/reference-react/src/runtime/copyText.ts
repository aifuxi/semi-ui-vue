export default function copyText(content: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const result = (() => {
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    }
  })();
  textarea.remove();
  return result;
}
