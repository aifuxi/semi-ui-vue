import React, { useState } from 'react';
import { Form } from '@semi-v2.102.0/form';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

/** 独立覆盖公开 ErrorMessage 的空值、布尔错误及错误清除，避免字段包装层掩盖值转换。 */
function ErrorMessageCases(): React.ReactElement {
  // 动态错误从空字符串开始，模拟快捷编辑尚未校验的初始状态。
  const [error, setError] = useState('');
  // 与 Vue 场景使用完全相同的公开输入；true 只保留空错误容器。
  const cases = [
    { id: 'undefined', label: 'undefined', error: undefined },
    { id: 'false', label: 'false', error: false },
    { id: 'empty', label: '空字符串', error: '' },
    { id: 'empty-help', label: '空错误与帮助文案', error: '', helpText: '辅助说明' },
    { id: 'text', label: '非空错误', error: '请填写名称。' },
    { id: 'true', label: '布尔 true', error: true },
    { id: 'array', label: '错误数组', error: ['错误一', '错误二'] },
    { id: 'empty-array', label: '空错误数组', error: [] },
    { id: 'help', label: '无错误与帮助文案', error: undefined, helpText: '辅助说明' },
  ];
  /** 显示真实错误，重复点击可复验清除后的再次出错。 */
  function showError(): void {
    setError('请填写名称。');
  }
  /** 清除错误时传递空字符串，保持业务调用的原始语义。 */
  function clearError(): void {
    setError('');
  }
  // 对照容器宽 440px、内边距 16px；标签宽 176px，最小行高 32px、间距 16px，固定空状态排版。
  return (
    <section data-testid="form-error-message-cases" style={{ width: 440, padding: 16 }}>
      <h3>独立错误提示</h3>
      {/* 固定行高让隐藏区域的 React/Vue 实际截图仍可比较。 */}
      {cases.map((item) => (
        <div key={item.id} style={{ display: 'flex', minHeight: 32, gap: 16 }}>
          <span style={{ width: 176 }}>{item.label}</span>
          <div data-error-case={item.id}>
            <Form.ErrorMessage
              error={item.error}
              helpText={item.helpText}
              validateStatus="error"
              showValidateIcon
            />
          </div>
        </div>
      ))}
      <div data-error-case="dynamic" style={{ minHeight: 32 }}>
        <Form.ErrorMessage error={error} validateStatus="error" showValidateIcon />
      </div>
      <button type="button" onClick={showError}>
        显示错误
      </button>
      <button type="button" onClick={clearError}>
        清除错误
      </button>
    </section>
  );
}

/** 同时提供内置字段集成和独立 ErrorMessage 场景，保留原 Form 截图目标。 */
export function FormScenario(): React.ReactElement {
  /** 经真实 Form 字段入口审查尺寸、只读与禁用，不能只看裸 Input。 */
  const reviewProps = readInputReviewProps(['size', 'disabled', 'readOnly']);
  return (
    <>
      <div className="form-scenario" data-testid="form-reference">
        <Form className="form-scenario__form">
          <Form.Input
            {...reviewProps}
            data-parity-target="form-name"
            field="name"
            label="名称"
            placeholder="请输入名称"
            rules={[{ required: true, message: '请输入名称' }]}
          />
          <Form.Input
            data-parity-target="form-description"
            field="description"
            helpText="用于识别当前方案"
            initValue="Semi Vue"
            label="说明"
          />
          <button className="form-scenario__submit" type="submit">
            提交
          </button>
        </Form>
      </div>
      <ErrorMessageCases />
    </>
  );
}
