import { expectedCaseTitles } from './documentation-evidence.mjs';

export function diagnosticSelection(batches, grep) {
  const all = batches.flatMap(expectedCaseTitles);
  if (grep !== undefined) {
    const pattern = new RegExp(grep);
    const selected = all.filter((title) => pattern.test(title));
    if (!selected.length) throw new Error('grep 未匹配所选批次的任何用例。');
    return selected;
  }
  const selected = new Set();
  for (const batch of batches) {
    const title = (name, locale, theme, rtl = false) =>
      `${batch.title} ${name} ${locale} ${theme}${rtl ? ' rtl' : ''}`;
    // Exercise every example in both languages before multiplying themes and RTL.
    for (const example of batch.examples)
      for (const locale of batch.locales)
        selected.add(title(example.name, locale, batch.themes[0]));
    selected.add(title(batch.examples[0].name, batch.locales[0], batch.themes.at(-1)));
    for (const name of batch.rtlExamples ?? [])
      selected.add(title(name, batch.locales.at(-1), batch.themes.at(-1), true));
  }
  return all.filter((title) => selected.has(title));
}

export function exactTitlePattern(titles) {
  return `^(?:${titles.map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`;
}

export function diagnosticArguments(args, batches) {
  const ids = [];
  let grep;
  let plan = false;
  let prepareOnly = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--plan') plan = true;
    else if (arg === '--prepare-only') prepareOnly = true;
    else if (arg === '--grep') {
      grep = args[++i];
      if (!grep || grep.startsWith('--')) throw new Error('--grep 需要正则表达式。');
    } else if (arg.startsWith('--')) throw new Error(`未知参数 ${arg}`);
    else ids.push(arg);
  }
  if (!ids.length || ids.some((id) => !batches.some((batch) => batch.id === id)))
    throw new Error(
      '请提供有效批次：diagnose:nuxt:batch <批次...> [--grep 正则] [--plan|--prepare-only]',
    );
  if (prepareOnly && grep !== undefined) throw new Error('--prepare-only 不能与 --grep 同时使用。');
  return { batches: batches.filter((batch) => ids.includes(batch.id)), grep, plan, prepareOnly };
}
