import type {
  AnimationConfigWithData,
  AnimationConfigWithPath,
  AnimationItem,
  LottiePlayer,
} from 'lottie-web';

interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export type LottieLoadParams = AnimationConfigWithPath | AnimationConfigWithData;

export interface LottieFoundationProps {
  params: Partial<LottieLoadParams>;
  getAnimationInstance?: ((instance: AnimationItem | null) => void) | undefined;
  getLottie?: ((lottie: LottiePlayer) => void) | undefined;
}

export interface LottieAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getContainer(): Element;
  getLoadParams(): LottieLoadParams;
}

export const lottieCssClasses: { PREFIX: string };

export class LottieFoundation<Props extends LottieFoundationProps, State> {
  static getLottie(): LottiePlayer;
  animation: AnimationItem | null;
  constructor(adapter: LottieAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleParamsUpdate(): void;
}
