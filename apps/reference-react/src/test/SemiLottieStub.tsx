import React from 'react';
import type { AnimationItem, LottiePlayer } from 'lottie-web';

export interface LottieProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  getAnimationInstance?: (animation: AnimationItem | null) => void;
  getLottie?: (lottie: LottiePlayer) => void;
  height?: string;
  params: Record<string, unknown> & { container?: Element };
  width?: string;
}

function Lottie({
  height,
  params,
  style,
  width,
  ...props
}: LottieProps): React.ReactElement | null {
  if (params.container) return null;
  return (
    <div
      {...props}
      className={`semi-lottie${props.className ? ` ${props.className}` : ''}`}
      style={{ width, height, ...style }}
    />
  );
}

Lottie.getLottie = (): LottiePlayer => ({}) as LottiePlayer;

export default Lottie;
