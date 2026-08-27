import React, { useEffect, useState } from 'react';
import ConfigProvider, { ConfigConsumer } from '@semi-v2.102.0/config-provider';
import Typography from '@semi-v2.102.0/typography';

import type { ConfigContextValue } from '@semi-v2.102.0/config-provider';

const ENGLISH_LOCALE = {
  code: 'en-US',
  currency: 'USD',
  Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
};

function ConfigSummary({ context }: { context: ConfigContextValue }): React.ReactElement {
  const [screens, setScreens] = useState(context.screens);

  useEffect(() => context.onBreakpoint(setScreens), [context.onBreakpoint]);

  const activeScreens = Object.entries(screens ?? {})
    .filter(([, matches]) => matches)
    .map(([screen]) => screen)
    .join(',');

  return (
    <section className="config-provider-scenario__card" data-parity-target="config-provider-card">
      <strong data-parity-target="config-provider-direction">{`direction: ${context.direction}`}</strong>
      <span>{`locale: ${context.locale?.code}`}</span>
      <span>{`timeZone: ${context.timeZone}`}</span>
      <code data-parity-target="config-provider-screens">{`screens: ${activeScreens || 'none'}`}</code>
    </section>
  );
}

export function ConfigProviderScenario(): React.ReactElement {
  return (
    <div className="config-provider-scenario" data-testid="config-provider-reference">
      <ConfigProvider
        direction="rtl"
        locale={ENGLISH_LOCALE as never}
        timeZone="Asia/Shanghai"
        responsiveObserve
      >
        <ConfigConsumer>
          {(context) => <ConfigSummary context={context as ConfigContextValue} />}
        </ConfigConsumer>
        <Typography.Text copyable data-parity-target="config-provider-locale">
          Global configuration
        </Typography.Text>
        <ConfigProvider direction="ltr" locale={ENGLISH_LOCALE as never}>
          <ConfigConsumer>
            {(context) => (
              <span
                className="config-provider-scenario__nested"
                data-parity-target="config-provider-nested"
              >
                {`nested: ${context.direction}`}
              </span>
            )}
          </ConfigConsumer>
        </ConfigProvider>
      </ConfigProvider>
    </div>
  );
}
