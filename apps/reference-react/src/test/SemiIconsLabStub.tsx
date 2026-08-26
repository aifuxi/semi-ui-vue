import React from 'react';
import SemiIconStub from './SemiIconStub';

export function IconAvatar(props: Record<string, unknown>): React.ReactElement {
  return (
    <SemiIconStub
      {...props}
      type="avatar"
      svg={
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#FBCD2C" />
        </svg>
      }
    />
  );
}
