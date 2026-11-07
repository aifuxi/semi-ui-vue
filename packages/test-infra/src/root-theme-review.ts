/** 审查场景读取实际公开枚举；缺少 query 时返回空对象，保留既有基线场景。 */
export function buttonReview(search: string): {
  size?: 'small' | 'default' | 'large';
  theme?: 'solid' | 'light' | 'outline' | 'borderless';
  disabled?: boolean;
  loading?: boolean;
} {
  /** 同一份查询同时提供给真实 React 与 Vue 组件。 */
  const query = new URLSearchParams(search);
  /** Button 三档 size 与四种 theme 来自固定 v2.102.0 公开 API。 */
  const size = query.get('reviewButtonSize');
  /** theme 不负责深浅模式；模式仍由对照框架的 theme query 设置。 */
  const theme = query.get('reviewButtonTheme');
  return {
    ...(size === 'small' || size === 'default' || size === 'large' ? { size } : {}),
    ...(theme === 'solid' || theme === 'light' || theme === 'outline' || theme === 'borderless'
      ? { theme }
      : {}),
    ...(query.has('reviewButtonDisabled') ? { disabled: true } : {}),
    ...(query.has('reviewButtonLoading') ? { loading: true } : {}),
  };
}

/** Modal 使用真实 size/confirmLoading/fullScreen API，不能用 DOM class 模拟尺寸或状态。 */
export function modalReview(search: string): {
  size?: 'small' | 'medium' | 'large' | 'full-width';
  confirmLoading?: boolean;
  fullScreen?: boolean;
} {
  /** 无审查参数时完全沿用原场景默认行为。 */
  const query = new URLSearchParams(search);
  /** Modal 支持 small/medium/large/full-width；fullScreen 是独立开关。 */
  const size = query.get('reviewModalSize');
  return {
    ...(size === 'small' || size === 'medium' || size === 'large' || size === 'full-width'
      ? { size }
      : {}),
    ...(query.has('reviewModalLoading') ? { confirmLoading: true } : {}),
    ...(query.has('reviewModalFullScreen') ? { fullScreen: true } : {}),
  };
}

/** SideSheet 的三档尺寸和四个方位均通过公开 props 驱动。 */
export function sheetReview(search: string): {
  size?: 'small' | 'medium' | 'large';
  placement?: 'top' | 'right' | 'bottom' | 'left';
} {
  /** 审查状态只属于当前页面，没有持久化或跨场景副作用。 */
  const query = new URLSearchParams(search);
  /** 未指定 size 时保留原场景 72% 自定义宽度。 */
  const size = query.get('reviewSheetSize');
  /** placement 决定水平/垂直布局，需对照对应方向的标题和 footer。 */
  const placement = query.get('reviewSheetPlacement');
  return {
    ...(size === 'small' || size === 'medium' || size === 'large' ? { size } : {}),
    ...(placement === 'top' ||
    placement === 'right' ||
    placement === 'bottom' ||
    placement === 'left'
      ? { placement }
      : {}),
  };
}
