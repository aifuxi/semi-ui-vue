import type {
  AnimationConfigWithData,
  AnimationConfigWithPath,
  AnimationItem,
  LottiePlayer,
} from 'lottie-web';
import type { HTMLAttributes, StyleValue } from 'vue';

export type LottieParams = Partial<AnimationConfigWithPath | AnimationConfigWithData>;

export interface LottieProps {
  params: LottieParams;
  width?: string;
  height?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  getAnimationInstance?: (instance: AnimationItem | null) => void;
  getLottie?: (lottie: LottiePlayer) => void;
}

export type { AnimationItem as LottieAnimationItem, LottiePlayer };
