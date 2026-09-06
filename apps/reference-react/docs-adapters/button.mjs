export const upstream = 'basic/button';
export const exampleCount = { 'zh-cn': 17, 'en-us': 17 };

export function adapt(code, { number, entry }) {
  if (!entry) throw new Error(`Unsupported pinned Button entry ${number}`);
  // The site's live evaluator permits this undeclared local; ESM requires its declaration.
  if (number === 17)
    code = code.replace('        newBtnVisible =', '        const newBtnVisible =');
  return `${code}\nexport default ${entry};`;
}
