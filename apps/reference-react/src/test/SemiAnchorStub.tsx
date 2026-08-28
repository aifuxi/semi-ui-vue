import React from 'react';

interface AnchorStubProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface AnchorLinkStubProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  title?: React.ReactNode;
}

function AnchorLinkStub(props: AnchorLinkStubProps): React.ReactElement {
  return (
    <div className={`semi-anchor-link ${props.className ?? ''}`} role="listitem">
      <div
        className={`semi-anchor-link-title${props.disabled ? ' semi-anchor-link-title-disabled' : ''}`}
        role="link"
      >
        {props.title}
      </div>
      {props.children ? <div role="list">{props.children}</div> : null}
    </div>
  );
}

function AnchorStub({ children, className = '', ...props }: AnchorStubProps): React.ReactElement {
  return (
    <div {...props} className={`semi-anchor ${className}`} role="navigation">
      <div className="semi-anchor-link-wrapper" role="list">
        {children}
      </div>
    </div>
  );
}

AnchorStub.Link = AnchorLinkStub;

export default AnchorStub;
