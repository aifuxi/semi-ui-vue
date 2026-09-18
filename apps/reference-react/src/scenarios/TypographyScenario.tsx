import React, { useState } from 'react';
import Typography from '@semi-v2.102.0/typography';

const { Numeral, Paragraph, Text, Title } = Typography;

export function TypographyScenario(): React.ReactElement {
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const tipMode = query.get('typographyTip');
  const [wide, setWide] = useState(false);
  const [textMounted, setTextMounted] = useState(true);
  const tipOptions = tipMode
    ? {
        type: tipMode,
        opts: {
          getPopupContainer: () => document.getElementById('typography-tip-container')!,
          ...(query.has('arrow') ? { showArrow: query.get('arrow') === 'true' } : {}),
        },
      }
    : true;
  return (
    <div className="typography-scenario" data-testid="typography-reference">
      <section className="typography-scenario__section" aria-label="标题层级">
        <Title heading={2} style={{ margin: '0px' }} data-parity-target="typography-title">
          Typography 版式
        </Title>
        <Title
          heading={4}
          type="secondary"
          weight="semibold"
          style={{ margin: '0px' }}
          data-parity-target="typography-subtitle"
        >
          Semi Design v2.102.0
        </Title>
      </section>

      <section className="typography-scenario__section" aria-label="文本类型与装饰">
        <div className="typography-scenario__types">
          <Text type="primary">Primary</Text>
          <Text type="secondary">Secondary</Text>
          <Text type="tertiary">Tertiary</Text>
          <Text type="quaternary">Quaternary</Text>
          <Text type="warning">Warning</Text>
          <Text type="danger">Danger</Text>
          <Text type="success">Success</Text>
        </div>
        <Text mark code strong underline delete data-parity-target="typography-decorated">
          Decorated text
        </Text>
      </section>

      <section className="typography-scenario__section" aria-label="段落与链接">
        <Paragraph
          spacing="extended"
          style={{ margin: '0px' }}
          data-parity-target="typography-paragraph"
        >
          Typography provides consistent hierarchy, color, spacing and readable rhythm for product
          content.
        </Paragraph>
        <Text link={{ href: '#typography' }} underline data-parity-target="typography-link">
          Read typography guidance
        </Text>
        <Text disabled link data-parity-target="typography-disabled-link">
          Disabled link
        </Text>
      </section>

      <section className="typography-scenario__section" aria-label="截断与提示">
        {tipMode && (
          <>
            <div id="typography-tip-container" style={{ position: 'relative' }} />
            <button onClick={() => setWide(!wide)}>Toggle width</button>
            <button onClick={() => setTextMounted(!textMounted)}>Toggle text</button>
          </>
        )}
        {textMounted && (
          <>
            <Text
              ellipsis={{ showTooltip: tipOptions }}
              style={{ width: wide ? '900px' : '180px' }}
              data-parity-target="typography-css-ellipsis"
            >
              Typography ellipsis tooltip contains the complete original content.
            </Text>
          </>
        )}
        <Paragraph
          ellipsis={{
            rows: 1,
            expandable: true,
            collapsible: true,
            expandText: '展开',
            collapseText: '收起',
          }}
          style={{ margin: '0px', width: '260px' }}
          data-parity-target="typography-js-ellipsis"
        >
          Expandable typography content keeps keyboard and collapse behavior aligned.
        </Paragraph>
      </section>

      <section className="typography-scenario__section" aria-label="数值与复制">
        <Numeral rule="bytes-binary" precision={2} data-parity-target="typography-numeral">
          1536
        </Numeral>
        <Text copyable data-parity-target="typography-copyable">
          Copy typography token
        </Text>
      </section>
    </div>
  );
}
