import UploadBase from './Upload.vue';
import UploadFileCard from './UploadFileCard.vue';

export type UploadComponent = typeof UploadBase & { FileCard: typeof UploadFileCard };

export const Upload = Object.assign(UploadBase, { FileCard: UploadFileCard }) as UploadComponent;
export { UploadFileCard };
export {
  UPLOAD_FILE_STATUSES,
  UPLOAD_LIST_TYPES,
  UPLOAD_PROMPT_POSITIONS,
  UPLOAD_TRIGGERS,
} from './types';
export type {
  UploadAfterProps,
  UploadAfterResult,
  UploadBeforeProps,
  UploadBeforeResult,
  UploadChangePayload,
  UploadCropProps,
  UploadCustomError,
  UploadCustomFile,
  UploadCustomRequestArgs,
  UploadEmits,
  UploadExposed,
  UploadFileCardProps,
  UploadFileItem,
  UploadFileStatus,
  UploadListType,
  UploadLocale,
  UploadLocaleConfig,
  UploadPromptPosition,
  UploadProps,
  UploadRenderFileItemProps,
  UploadRenderFileListTitleProps,
  UploadRenderPictureCloseProps,
  UploadSlots,
  UploadTrigger,
} from './types';

export default Upload;
