import React from 'react';

type CommonProps = React.HTMLAttributes<HTMLElement> & {
  component?: React.ElementType;
  copyable?: boolean | object;
  delete?: boolean;
  disabled?: boolean;
  link?: boolean | React.AnchorHTMLAttributes<HTMLAnchorElement>;
  mark?: boolean;
  size?: string;
  spacing?: string;
  strong?: boolean;
  type?: string;
  underline?: boolean;
  weight?: string | number;
  code?: boolean;
};

function Content({ children, ...props }: CommonProps) {
  let content: React.ReactNode = children;
  if (props.mark) content = <mark>{content}</mark>;
  if (props.code) content = <code>{content}</code>;
  if (props.underline && !props.link) content = <u>{content}</u>;
  if (props.strong) content = <strong>{content}</strong>;
  if (props.delete) content = <del>{content}</del>;
  if (props.link) {
    const linkProps = typeof props.link === 'object' ? props.link : {};
    content = props.disabled ? <span>{content}</span> : <a {...linkProps}>{content}</a>;
  }
  return <>{content}</>;
}

function classNames(props: CommonProps, extra?: string): string {
  return [
    props.className,
    'semi-typography',
    extra,
    props.link ? 'semi-typography-link' : `semi-typography-${props.type ?? 'primary'}`,
    `semi-typography-${props.size ?? 'normal'}`,
    `semi-typography-${props.spacing ?? 'normal'}`,
    props.disabled ? 'semi-typography-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Base({ component: Component = 'span', copyable, children, ...props }: CommonProps) {
  const { style, ...rest } = props;
  return (
    <Component {...rest} className={classNames(props)} style={style}>
      <Content {...props}>{children}</Content>
      {copyable ? <span className="semi-typography-action-copy">copy</span> : null}
    </Component>
  );
}

function Text(props: CommonProps) {
  return <Base component="span" {...props} />;
}

function Paragraph(props: CommonProps) {
  return (
    <Base
      component="p"
      {...props}
      className={`${props.className ?? ''} semi-typography-paragraph`}
    />
  );
}

function Title({ heading = 1, ...props }: CommonProps & { heading?: number }) {
  const tag = `h${heading}` as React.ElementType;
  return (
    <Base
      component={tag}
      {...props}
      className={`${props.className ?? ''} semi-typography-h${heading}`}
    />
  );
}

function Numeral({
  children,
  rule,
  precision = 0,
  ...props
}: CommonProps & { rule?: string; precision?: number }) {
  let content = String(children);
  if (rule === 'bytes-binary') content = `${(Number(content) / 1024).toFixed(precision)} KiB`;
  return (
    <Base component="span" {...props}>
      {content}
    </Base>
  );
}

function Typography({ component: Component = 'article', className = '', ...props }: CommonProps) {
  return <Component className={`semi-typography ${className}`} {...props} />;
}

Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;
Typography.Numeral = Numeral;

export default Typography;
