import type { SidebarImageUploadOptions } from '@aifuxi/semi-ui-vue/sidebar';
// Existing local image; no network upload is sent from this documentation example.
export const imgUploadProps: SidebarImageUploadOptions = {
  action: '',
  customRequest: ({ onSuccess }) => onSuccess({ url: '/demos/photo.svg' }),
  getUploadImageSrc: () => '/demos/photo.svg',
};
