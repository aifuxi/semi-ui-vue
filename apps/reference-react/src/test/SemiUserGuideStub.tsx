import React from 'react';
import type { UserGuideProps } from '@semi-v2.102.0/user-guide';

export default function SemiUserGuideStub(props: UserGuideProps): React.ReactElement | null {
  if (!props.visible || !props.steps?.length) return null;
  const step = props.steps[props.current ?? 0];
  return <div className="semi-userGuide-popup-content">{step?.title}</div>;
}
