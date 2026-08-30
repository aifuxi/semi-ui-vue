import React from 'react';
import { Form } from '@semi-v2.102.0/form';

export function FormScenario(): React.ReactElement {
  return (
    <div className="form-scenario" data-testid="form-reference">
      <Form className="form-scenario__form">
        <Form.Input
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
  );
}
