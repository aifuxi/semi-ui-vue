import { DEFAULT_TYPOGRAPHY_LOCALE } from '../typography';
import type { PaginationLocale } from '../pagination';
import type { ImageLocale } from '../image';
import type { ListLocale } from '../list/types';
import type { ModalLocale } from '../modal/types';
import type { PopconfirmLocale } from '../popconfirm/types';
import type { TableLocale } from '../table/types';
import type { UploadLocale } from '../upload/types';

import type { BreakpointScreens, ResponsiveMap, SemiLocale } from './types';

export const defaultResponsiveMap: Readonly<ResponsiveMap> = Object.freeze({
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
});

export const DEFAULT_BREAKPOINT_SCREENS: Readonly<BreakpointScreens> = Object.freeze({
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
});

export const DEFAULT_CONFIG_LOCALE: Readonly<SemiLocale> = Object.freeze({
  code: 'zh-CN',
  currency: 'CNY',
  Typography: DEFAULT_TYPOGRAPHY_LOCALE,
  Pagination: Object.freeze({
    pageSize: '每页条数：${pageSize}',
    total: '总页数：${total}',
    jumpTo: '跳至',
    page: '页',
  }) satisfies PaginationLocale,
  Image: Object.freeze({
    preview: '预览',
    loading: '加载中',
    loadError: '加载失败',
    prevTip: '上一张',
    nextTip: '下一张',
    zoomInTip: '放大',
    zoomOutTip: '缩小',
    rotateTip: '旋转',
    downloadTip: '下载',
    adaptiveTip: '适应页面',
    originTip: '原始尺寸',
  }) satisfies ImageLocale,
  List: Object.freeze({
    emptyText: '暂无数据',
  }) satisfies ListLocale,
  Modal: Object.freeze({
    confirm: '确定',
    cancel: '取消',
  }) satisfies ModalLocale,
  Popconfirm: Object.freeze({
    confirm: '确定',
    cancel: '取消',
  }) satisfies PopconfirmLocale,
  Table: Object.freeze({
    ascend: '点击升序',
    cancelSort: '取消排序',
    confirmFilter: '确定',
    descend: '点击降序',
    emptyText: '暂无数据',
    pageText: '显示第 ${currentStart} 条-第 ${currentEnd} 条，共 ${total} 条',
    resetFilter: '重置',
  }) satisfies TableLocale,
  Upload: Object.freeze({
    mainText: '点击上传文件或拖拽文件到这里',
    illegalTips: '不支持此类型文件',
    legalTips: '松手开始上传',
    retry: '重试',
    replace: '替换文件',
    clear: '清空',
    selectedFiles: '已选择文件',
    illegalSize: '文件尺寸不合法',
    fail: '上传失败',
    cropTitle: '裁切图片',
    cropOk: '确定',
    cropCancel: '取消',
  }) satisfies UploadLocale,
});
