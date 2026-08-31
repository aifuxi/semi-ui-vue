import React from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import JsonViewer from '@semi-v2.102.0/json-viewer';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const value = `{
  "project": "Semi UI Vue",
  "version": "2.102.0",
  "ready": true,
  "tags": ["Vue", "Worker", "Parity"],
  "metrics": { "components": 78, "target": 85 }
}`;
const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    JsonViewer: { search: '查找', replace: '替换', replaceAll: '全部替换' },
  },
  'en-US': {
    code: 'en-US',
    JsonViewer: { search: 'Search', replace: 'Replace', replaceAll: 'Replace All' },
  },
};

export function JsonViewerScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="json-viewer-scenario" data-testid="json-viewer-reference">
        <section className="json-viewer-scenario__card json-viewer-scenario__main">
          <h3>Editable / search</h3>
          <JsonViewer
            data-parity-target="json-viewer-main"
            value={value}
            width={640}
            height={300}
            options={{ readOnly: false, autoWrap: true }}
            limitSearchButtonBounds
          />
        </section>
        <section className="json-viewer-scenario__card json-viewer-scenario__custom">
          <h3>Read only / custom token</h3>
          <JsonViewer
            data-parity-target="json-viewer-custom"
            value={value}
            width={420}
            height={220}
            showSearch={false}
            options={{
              readOnly: true,
              autoWrap: true,
              customRenderRule: [
                {
                  match: 'Semi UI Vue',
                  render: (content: string) => (
                    <strong className="json-viewer-scenario__custom-token">{content}</strong>
                  ),
                },
              ],
            }}
          />
        </section>
      </div>
    </ConfigProvider>
  );
}
