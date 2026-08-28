import type { HTMLAttributes, ImgHTMLAttributes, StyleValue } from 'vue';

export type CropperShape = 'rect' | 'round' | 'roundRect';

export interface CropperProps {
  aspectRatio?: number | undefined;
  class?: HTMLAttributes['class'] | undefined;
  className?: string | undefined;
  cropperBoxClassName?: string | undefined;
  cropperBoxCls?: string | undefined;
  cropperBoxStyle?: StyleValue | undefined;
  defaultAspectRatio?: number | undefined;
  fill?: string | undefined;
  imgProps?: ImgHTMLAttributes | undefined;
  maxZoom?: number | undefined;
  minZoom?: number | undefined;
  preview?: (() => HTMLElement) | undefined;
  rotate?: number | undefined;
  shape?: CropperShape | undefined;
  showResizeBox?: boolean | undefined;
  src?: string | undefined;
  style?: StyleValue | undefined;
  zoom?: number | undefined;
  zoomStep?: number | undefined;
}

export interface CropperEmits {
  'update:zoom': [zoom: number];
  zoomChange: [zoom: number];
}

export interface CropperMethods {
  getCropperCanvas(): HTMLCanvasElement;
}

export interface CropperState {
  imgData: {
    width: number;
    height: number;
    centerPoint: { x: number; y: number };
  };
  cropperBox: {
    width: number;
    height: number;
    centerPoint: { x: number; y: number };
  };
  zoom: number;
  rotate: number;
  loaded: boolean;
}
