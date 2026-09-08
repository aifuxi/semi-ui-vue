import React from 'react';
import Header from '@douyinfe/semi-site-header';
import '@douyinfe/semi-site-header/dist/index.css';

// The test supplies a deterministic empty navigation response. No remote custom-element
// scripts are loaded here, and login is disabled through the package's public API.
export default function DocsHeader({ locale, theme }: { locale: string; theme: string }) {
  localStorage.setItem('semiMode', JSON.stringify(theme));
  localStorage.setItem('cacheSemiMode', '{}');
  return (
    <Header
      locale={locale === 'en-us' ? 'en-US' : 'zh-CN'}
      enableLogin={false}
      ghLink="https://github.com/aifuxi/semi-ui-vue"
    />
  );
}
