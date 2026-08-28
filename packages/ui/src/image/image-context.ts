import type { ComputedRef, InjectionKey } from 'vue';

import type { ImagePreviewProps } from './types';

export interface ImagePreviewContextValue {
  currentIndex: ComputedRef<number>;
  handleVisibleChange: (visible: boolean) => void;
  isGroup: true;
  lazyLoad: ComputedRef<boolean>;
  previewSrc: ComputedRef<string[]>;
  setCurrentIndex: (index: number) => void;
  setDownloadName: ComputedRef<ImagePreviewProps['setDownloadName']>;
  titles: ComputedRef<unknown[]>;
  visible: ComputedRef<boolean>;
}

export const imagePreviewContextKey: InjectionKey<ImagePreviewContextValue> = Symbol(
  'semi-image-preview-context',
);
