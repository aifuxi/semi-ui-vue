import React from 'react';
import Space from '@semi-v2.102.0/space';

const ALIGNMENTS = ['start', 'center', 'end', 'baseline'] as const;

function Item({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return <span className={`space-scenario__item${tall ? ' is-tall' : ''}`}>{children}</span>;
}

export function SpaceScenario(): React.ReactElement {
  return (
    <div className="space-scenario" data-testid="space-reference">
      <section className="space-scenario__section" aria-label="间距尺寸与方向">
        <h3>间距尺寸与方向</h3>
        {(['tight', 'medium', 'loose'] as const).map((spacing) => (
          <div className="space-scenario__line" key={spacing}>
            <span className="space-scenario__label">{spacing}</span>
            <Space spacing={spacing} data-parity-target={`space-${spacing}`}>
              <Item>A</Item>
              <Item>B</Item>
              <Item>C</Item>
            </Space>
          </div>
        ))}
        <div className="space-scenario__line">
          <span className="space-scenario__label">12px</span>
          <Space spacing={12} data-parity-target="space-number">
            <Item>A</Item>
            <Item>B</Item>
            <Item>C</Item>
          </Space>
        </div>
        <div className="space-scenario__line">
          <span className="space-scenario__label">[12, 20]</span>
          <Space
            className="space-scenario__wrap"
            spacing={[12, 20]}
            wrap
            data-parity-target="space-array-wrap"
          >
            <Item>A</Item>
            <Item>B</Item>
            <Item>C</Item>
            <Item>D</Item>
            <Item>E</Item>
          </Space>
        </div>
        <div className="space-scenario__line">
          <span className="space-scenario__label">vertical</span>
          <Space vertical spacing="tight" data-parity-target="space-vertical">
            <Item>A</Item>
            <Item>B</Item>
            <Item>C</Item>
          </Space>
        </div>
      </section>

      <section className="space-scenario__section" aria-label="交叉轴对齐">
        <h3>交叉轴对齐</h3>
        {ALIGNMENTS.map((align) => (
          <div className="space-scenario__line" key={align}>
            <span className="space-scenario__label">{align}</span>
            <Space align={align} data-parity-target={`space-align-${align}`}>
              <Item>A</Item>
              <Item tall>B</Item>
              <span className="space-scenario__baseline">Text</span>
            </Space>
          </div>
        ))}
      </section>
    </div>
  );
}
