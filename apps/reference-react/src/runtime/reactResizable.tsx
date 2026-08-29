import React from 'react';

interface ResizableProps {
  children: React.ReactElement;
}

// The pinned Table public entry imports its resizable branch eagerly. The
// parity scene keeps resizable disabled, but the module shape must still be
// present for the real Adapter bundle to load.
export function Resizable({ children }: ResizableProps): React.ReactElement {
  return children;
}
