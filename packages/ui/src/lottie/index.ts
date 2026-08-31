import type { LottiePlayer } from 'lottie-web';
import type { DefineComponent } from 'vue';

import { LottieFoundation } from '@workspace/foundation-integration';
import LottieBase from './Lottie.vue';
import type { LottieProps } from './types';

export type LottieComponent = DefineComponent<LottieProps> & {
  getLottie: () => LottiePlayer;
};

export const Lottie = Object.assign(LottieBase, {
  getLottie: LottieFoundation.getLottie,
}) as unknown as LottieComponent;

export type { LottieAnimationItem, LottieParams, LottiePlayer, LottieProps } from './types';

export default Lottie;
