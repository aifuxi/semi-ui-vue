import React from 'react';
import Button from '@semi-v2.102.0/button';
import ButtonGroup from '@semi-v2.102.0/button-group';
import SplitButtonGroup from '@semi-v2.102.0/split-button-group';

function ScenarioIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ButtonContractScenario(): React.ReactElement {
  return (
    <div className="button-contract-scenario" data-testid="button-contract-reference">
      <div className="button-contract-scenario__row">
        <Button icon={<ScenarioIcon />} iconPosition="right" data-parity-target="button-icon-right">
          展开选项
        </Button>
        <Button disabled data-parity-target="button-disabled">
          禁用按钮
        </Button>
        <Button loading data-parity-target="button-loading">
          保存
        </Button>
        <Button size="large" theme="solid" data-parity-target="button-large">
          大尺寸
        </Button>
      </div>

      <div className="button-contract-scenario__row">
        <Button theme="outline" type="danger" data-parity-target="button-outline">
          边框危险
        </Button>
        <Button theme="borderless" type="secondary" data-parity-target="button-borderless">
          无背景次要
        </Button>
        <Button colorful theme="solid" type="primary" data-parity-target="button-colorful">
          多彩按钮
        </Button>
        <span className="button-contract-scenario__block">
          <Button block data-parity-target="button-block">
            块级按钮
          </Button>
        </span>
      </div>

      <ButtonGroup
        size="small"
        type="secondary"
        aria-label="编辑操作"
        data-parity-target="button-group"
      >
        <Button>复制</Button>
        <Button>查询</Button>
        <Button>剪切</Button>
      </ButtonGroup>

      <SplitButtonGroup aria-label="项目操作" data-parity-target="split-button-group">
        <Button theme="solid">保存</Button>
        <Button theme="solid" icon={<ScenarioIcon />} aria-label="更多操作" />
      </SplitButtonGroup>
    </div>
  );
}
