import React from 'react';

type BasicProps = React.HTMLAttributes<HTMLDivElement> & {
  prefixCls?: string;
};

type AvatarProps = BasicProps & {
  shape?: 'circle' | 'square';
  size?: string;
};

type ParagraphProps = React.HTMLAttributes<HTMLUListElement> & {
  prefixCls?: string;
  rows?: number;
};

function createItem(type: string) {
  return function SkeletonItem({ className, prefixCls = 'semi-skeleton', ...props }: BasicProps) {
    return <div className={`${prefixCls}-${type}${className ? ` ${className}` : ''}`} {...props} />;
  };
}

function Avatar({
  className,
  prefixCls = 'semi-skeleton',
  shape = 'circle',
  size = 'medium',
  ...props
}: AvatarProps): React.ReactElement {
  return (
    <div
      className={`${prefixCls}-avatar ${prefixCls}-avatar-${size} ${prefixCls}-avatar-${shape}${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
}

function Paragraph({
  className,
  prefixCls = 'semi-skeleton',
  rows = 4,
  style,
}: ParagraphProps): React.ReactElement {
  return (
    <ul className={`${prefixCls}-paragraph${className ? ` ${className}` : ''}`} style={style}>
      {[...Array(rows)].map((_, index) => (
        <li key={index} />
      ))}
    </ul>
  );
}

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  loading?: boolean;
  placeholder?: React.ReactNode;
};

function SkeletonBase({
  active = false,
  children,
  className,
  loading = true,
  placeholder,
  ...props
}: SkeletonProps): React.ReactElement | null {
  if (!loading) return <>{children}</>;
  return (
    <div
      className={`semi-skeleton${active ? ' semi-skeleton-active' : ''}${className ? ` ${className}` : ''}`}
      x-semi-prop="placeholder"
      {...props}
    >
      {placeholder}
    </div>
  );
}

const Skeleton = Object.assign(SkeletonBase, {
  Avatar,
  Button: createItem('button'),
  Image: createItem('image'),
  Paragraph,
  Title: createItem('title'),
});

export default Skeleton;
