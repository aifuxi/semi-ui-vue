import React, { useCallback, useState } from 'react';
import Layout from '@semi-v2.102.0/layout';

const { Header, Footer, Content, Sider } = Layout;

const headerFooterStyle: React.CSSProperties = {
  height: 42,
  lineHeight: '42px',
  background: 'var(--harness-surface)',
};

const contentStyle: React.CSSProperties = {
  height: 92,
  lineHeight: '92px',
  background: 'var(--harness-panel)',
};

export function LayoutScenario(): React.ReactElement {
  const [breakpoints, setBreakpoints] = useState({ xs: false, md: false });
  const handleBreakpoint = useCallback((screen: string, match: boolean) => {
    if (screen !== 'xs' && screen !== 'md') return;
    setBreakpoints((current) => ({ ...current, [screen]: match }));
  }, []);
  const breakpointLabel = `xs:${String(breakpoints.xs)} · md:${String(breakpoints.md)}`;

  return (
    <div className="layout-scenario" data-testid="layout-reference">
      <section className="layout-scenario__section" aria-label="三行布局">
        <h3>三行布局</h3>
        <Layout className="layout-scenario__demo" data-parity-target="layout-vertical">
          <Header style={headerFooterStyle} data-parity-target="layout-header">
            Header
          </Header>
          <Content style={contentStyle} data-parity-target="layout-content">
            Content
          </Content>
          <Footer style={headerFooterStyle} data-parity-target="layout-footer">
            Footer
          </Footer>
        </Layout>
      </section>

      <section className="layout-scenario__section" aria-label="侧边栏布局">
        <h3>侧边栏布局</h3>
        <Layout className="layout-scenario__demo" data-parity-target="layout-with-sider">
          <Sider
            aria-label="演示侧边栏"
            breakpoint={['xs', 'md']}
            data-breakpoint-source="layout"
            data-parity-target="layout-sider"
            style={{ width: '96px', background: 'var(--harness-surface)' }}
            onBreakpoint={handleBreakpoint}
          >
            Sider
          </Sider>
          <Layout data-parity-target="layout-nested">
            <Header style={headerFooterStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
            <Footer style={headerFooterStyle}>Footer</Footer>
          </Layout>
        </Layout>
        <output className="layout-scenario__breakpoints" aria-live="polite">
          {breakpointLabel}
        </output>
      </section>

      <section className="layout-scenario__section" aria-label="自定义语义标签">
        <h3>自定义语义标签</h3>
        <Layout
          aria-label="文章布局"
          className="layout-scenario__semantic"
          data-parity-target="layout-semantic"
          role="region"
          tagName="article"
        >
          <Content tagName="div">自定义 article / div 标签</Content>
        </Layout>
      </section>
    </div>
  );
}
