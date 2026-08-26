import React from 'react';

type TagName = keyof React.ReactHTML;

interface BasicProps extends React.HTMLAttributes<HTMLElement> {
  prefixCls?: string;
  tagName?: TagName;
}

interface LayoutProps extends BasicProps {
  hasSider?: boolean;
}

interface SiderProps extends BasicProps {
  breakpoint?: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>;
  onBreakpoint?: (screen: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', match: boolean) => void;
}

function createSection(type: 'header' | 'footer' | 'content', defaultTagName: TagName) {
  return function Section({
    prefixCls = 'semi-layout',
    tagName = defaultTagName,
    ...props
  }: BasicProps) {
    return React.createElement(tagName, { ...props, className: `${prefixCls}-${type}` });
  };
}

const Header = createSection('header', 'header');
const Footer = createSection('footer', 'footer');
const Content = createSection('content', 'main');

function Sider({ prefixCls = 'semi-layout', children, className, style, ...props }: SiderProps) {
  const dataAttrs = Object.fromEntries(
    Object.entries(props).filter(([key]) => key.startsWith('data-')),
  );
  return (
    <aside
      {...dataAttrs}
      aria-label={props['aria-label']}
      className={[`${prefixCls}-sider`, className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className={`${prefixCls}-sider-children`}>{children}</div>
    </aside>
  );
}

function LayoutBase({
  prefixCls = 'semi-layout',
  tagName = 'section',
  hasSider,
  ...props
}: LayoutProps) {
  const children = React.Children.toArray(props.children);
  const includesSider = children.some(
    (child) => React.isValidElement(child) && child.type === Sider,
  );
  const className = [
    prefixCls,
    hasSider || includesSider ? `${prefixCls}-has-sider` : null,
    props.className,
  ]
    .filter(Boolean)
    .join(' ');
  return React.createElement(tagName, { ...props, className });
}

const Layout = Object.assign(LayoutBase, { Header, Footer, Content, Sider });

export default Layout;
