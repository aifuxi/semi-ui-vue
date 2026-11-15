import PinnedSelectFoundation from '../../../vendor/semi-design/packages/semi-foundation/select/foundation';

/** 保留固定 Foundation 的选择规则，仅将受控单选通知与视觉退场解耦。 */
export class SelectFoundation extends PinnedSelectFoundation {
  /** 只在单选调用栈内提前结算 closeCb，普通关闭仍等待真实退场完成。 */
  _selectingSingle = false;

  /** 鼠标和键盘共用此入口；嵌套选择结束后恢复外层调用的阶段。 */
  _handleSingleSelect(option, event) {
    /** 保存上层调用阶段，避免同步事件监听器触发嵌套选择时丢失上下文。 */
    const previous = this._selectingSingle;
    this._selectingSingle = true;
    try {
      super._handleSingleSelect(option, event);
    } finally {
      this._selectingSingle = previous;
    }
  }

  /**
   * v2.102.0 的受控单选把 change 放在 closeCb 中，会让动画期间的提交读到旧值。
   * 选择时同步通知公开值；Portal、搜索清理及普通关闭仍走上游的真实关闭生命周期。
   */
  close(closeConfig) {
    if (!this._selectingSingle || !this._isControlledComponent() || !closeConfig?.closeCb) {
      super.close(closeConfig);
      return;
    }
    /** 只提前执行本次选择的通知，不伪造 popoverClose 或重复注册该回调。 */
    const { closeCb, ...config } = closeConfig;
    super.close(config);
    closeCb();
  }
}
