import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'virtual:semi-reference-styles.css';
import 'virtual:pinned-doc-site.css';
import batchSources from 'virtual:pinned-documentation-examples';
import Sidebar from 'virtual:pinned-doc-sidebar';
import { docPages, categories } from '../../docs/src/data/docs';

const query = new URLSearchParams(location.search);
const locale = query.get('locale') === 'en-us' ? 'en-us' : 'zh-cn';
const theme = query.get('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.lang = locale;
document.body.setAttribute('theme-mode', theme);
const component = query.get('component') ?? 'button';
const loadSources = batchSources[component];
if (!loadSources) throw new Error(`Unknown documentation reference ${component}`);
const Example = React.lazy(async () => {
  const { default: sources } = await loadSources();
  const loadExample = sources[locale][Number(query.get('example') ?? 1) - 1];
  if (!loadExample) throw new Error(`Unknown ${component} reference example`);
  return loadExample();
});
const origin = 'http://127.0.0.1:4321';
const style = document.createElement('style');
style.textContent = `
@font-face {font-family:Inter;src:url('${origin}/repl/fonts/Inter-Regular.ttf');font-weight:400}
@font-face {font-family:Inter;src:url('${origin}/repl/fonts/Inter-SemiBold.ttf');font-weight:600}
body {margin:0}
`;
document.head.append(style);
const header = query.get('region') === 'header';
const Header = React.lazy(() => import('./docs-header'));
const sidebar = query.get('region') === 'navigation';
const pathname = `/${locale}/start/introduction/`;
const edges = docPages
  .filter((page) => page.navigation !== false && page.icon)
  .map((page) => ({
    node: {
      fields: { type: page.category, slug: page.path.slice(1) },
      frontmatter: {
        localeCode: page.locale,
        icon: page.icon,
        order: page.order,
        title:
          page.locale === 'zh-CN' && page.title !== page.englishTitle
            ? `${page.englishTitle} ${page.title}`
            : page.title,
      },
    },
  }));
if (sidebar) history.replaceState(null, '', pathname);
ReactDOM.render(
  <Suspense fallback="Loading fixed reference">
    {header ? (
      <Header locale={locale} theme={theme} />
    ) : sidebar ? (
      <Sidebar
        location={{ pathname }}
        itemsArr={categories.map(([itemKey, text, textUs]) => ({ itemKey, text, textUs }))}
        edges={edges}
      />
    ) : (
      <Example />
    )}
  </Suspense>,
  document.getElementById('root'),
);
