import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
export const uploadProps = {
  action: '',
  customRequest: ({ onSuccess }: UploadCustomRequestArgs) => onSuccess({ url: '/demos/photo.svg' }),
  afterUpload: () => ({ url: '/demos/photo.svg' }),
};
