/** 仅供固定参考与 Vue 场景对称使用的输入类审查参数，不模拟样式或改变默认场景。 */
interface InputReviewProps {
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  validateStatus?: 'error' | 'warning';
}

/** 每个场景只申请组件确实支持的公开属性，避免向不相关组件传入状态。 */
type InputReviewCapability = keyof InputReviewProps;

/** 从审查 query 读取真实 props；无参数时返回空对象，保留已有场景与快照。 */
export function readInputReviewProps(
  capabilities: readonly InputReviewCapability[],
): InputReviewProps {
  /** 服务端分析场景时不读取浏览器对象。 */
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  /** 三档尺寸来自输入组件公开 size 枚举。 */
  const size = query.get('uiReviewSize');
  /** 状态只选择单个公开分支，不改变组件的 CSS 或 DOM。 */
  const state = query.get('uiReviewState');
  /** 未申请或未指定的属性必须保持缺省语义。 */
  const props: InputReviewProps = {};
  if (capabilities.includes('size') && (size === 'small' || size === 'default' || size === 'large'))
    props.size = size;
  if (capabilities.includes('disabled') && state === 'disabled') props.disabled = true;
  if (capabilities.includes('readOnly') && state === 'readonly') props.readOnly = true;
  if (capabilities.includes('loading') && state === 'loading') props.loading = true;
  if (capabilities.includes('validateStatus') && (state === 'error' || state === 'warning'))
    props.validateStatus = state;
  return props;
}

/** 固定基线公开支持的日期模式，审查时不接受任意猜测字符串。 */
const dateTypes = [
  'date',
  'dateRange',
  'dateTime',
  'dateTimeRange',
  'month',
  'monthRange',
  'year',
] as const;

/** 选择日期面板的真实公开分支；不传 query 时不改变原来默认 date 面板。 */
export function readDatePickerReviewProps() {
  /** 两端从自身查询串读取相同参数，不共享实现或 DOM。 */
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  /** 数组查找使结果保留固定模式联合类型。 */
  const type = dateTypes.find(
    /** 仅匹配固定公开模式。 */
    (candidate) => candidate === query.get('uiReviewType'),
  );
  /** compact 是固定基线另一种面板密度。 */
  const density = query.get('uiReviewDensity');
  /** 布尔入口分别用于内嵌输入、多选、只读、无边框和确认按钮的视觉分支。 */
  const state = query.get('uiReviewState');
  return {
    ...(type ? { type } : {}),
    ...(density === 'compact' ? { density: 'compact' as const } : {}),
    ...(state === 'inset' ? { insetInput: true } : {}),
    ...(state === 'multiple' ? { multiple: true } : {}),
    ...(state === 'readonly' ? { inputReadOnly: true } : {}),
    ...(state === 'borderless' ? { borderless: true } : {}),
    ...(state === 'confirm' ? { needConfirm: true } : {}),
  };
}

/** 文件卡审查使用静态文件，不发网络上传；六个状态来自固定 UploadFileStatus。 */
export function readUploadReviewFiles() {
  /** 只有明确选择状态总览才加入扩展数据，默认截图保持原样。 */
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  if (query.get('uiReviewState') !== 'all-files') return undefined;
  /** 45% 用于稳定展示未完成进度；文件名和体积在两端完全一致。 */
  return [
    { uid: 'review-wait', name: 'queued.txt', size: '1.0KB', status: 'wait' as const },
    {
      uid: 'review-validating',
      name: 'validating.txt',
      size: '1.0KB',
      status: 'validating' as const,
      validateMessage: '正在校验',
    },
    {
      uid: 'review-uploading',
      name: 'uploading.txt',
      size: '1.0KB',
      status: 'uploading' as const,
      percent: 45,
    },
    { uid: 'review-success', name: 'success.txt', size: '1.0KB', status: 'success' as const },
    { uid: 'review-upload-fail', name: 'failed.txt', size: '1.0KB', status: 'uploadFail' as const },
    {
      uid: 'review-validate-fail',
      name: 'invalid.txt',
      size: '1.0KB',
      status: 'validateFail' as const,
      validateMessage: '文件类型不符合要求',
    },
  ];
}
