import React from 'react';
import type { StepProps, StepsProps, StepsStatus } from '@semi-v2.102.0/steps';

type InternalStepStubProps = StepProps & {
  active?: boolean;
  index?: number;
  onChange?: () => void;
  total?: number;
  type?: 'fill' | 'basic' | 'nav';
};

function StepStub({
  active,
  className = '',
  description,
  index,
  onChange,
  onClick,
  status = 'wait',
  title,
  total,
  type = 'fill',
}: InternalStepStubProps): React.ReactElement {
  return (
    <div
      aria-current="step"
      className={[
        'semi-steps-item',
        type === 'nav' ? '' : `semi-steps-item-${status}`,
        active ? 'semi-steps-item-active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={(event) => {
        onClick?.(event);
        onChange?.();
      }}
      tabIndex={0}
    >
      <div className="semi-steps-item-container">
        <div className="semi-steps-item-content">
          <div className="semi-steps-item-title">{title}</div>
          {description ? <div className="semi-steps-item-description">{description}</div> : null}
        </div>
        {type === 'nav' && index !== (total ?? 0) - 1 ? (
          <div className="semi-steps-item-icon">›</div>
        ) : null}
      </div>
    </div>
  );
}

function StepsStub({
  children,
  className = '',
  current = 0,
  direction = 'horizontal',
  hasLine = true,
  initial = 0,
  onChange,
  size = 'default',
  status = 'process',
  type = 'fill',
  ...rest
}: StepsProps): React.ReactElement {
  const nodes = React.Children.toArray(children).filter(
    React.isValidElement<InternalStepStubProps>,
  );
  const rootClass = [
    type === 'fill' ? 'semi-steps' : `semi-steps-${type}`,
    type !== 'nav' ? `semi-steps-${direction}` : '',
    type !== 'fill' && size !== 'default' ? `semi-steps-${size}` : '',
    type === 'basic' && hasLine ? 'semi-steps-hasline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={rootClass} {...rest}>
      {nodes.map((node, index) => {
        const stepNumber = initial + index;
        const inferredStatus: StepsStatus =
          node.props.status ??
          (stepNumber === current ? status : stepNumber < current ? 'finish' : 'wait');
        const injected: Partial<InternalStepStubProps> = {
          active: type === 'nav' ? index === current : stepNumber === current,
          index,
          status: inferredStatus,
          total: nodes.length,
          type,
        };
        if (index !== current) injected.onChange = () => onChange?.(index + initial);
        return React.cloneElement(node, injected);
      })}
    </div>
  );
}

StepsStub.Step = StepStub;

export default StepsStub;
