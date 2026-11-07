import React, { useState } from 'react';
import Button from '@semi-v2.102.0/button';
import AIChatInput from '@semi-v2.102.0/ai-chat-input';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    AIChatInput: { template: '模板', configure: '配置', selected: '已选 ${count} 个' },
    Upload: { cropTitle: '裁切图片', cropOk: '确定', cropCancel: '取消' },
  },
  'en-US': {
    code: 'en-US',
    AIChatInput: { template: 'Template', configure: 'Configure', selected: '${count} selected' },
    Upload: { cropTitle: 'Crop image', cropOk: 'OK', cropCancel: 'Cancel' },
  },
};

export function AIChatInputScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  // 两端用公开布尔状态复现发送禁用、生成中和非圆角输入框。
  const query = new URLSearchParams(window.location.search);
  const reviewPanels = query.get('aiInputPanels') === 'true';
  const [suggestions, setSuggestions] = useState(
    locale === 'zh-CN' ? ['总结规范', '生成行动项'] : ['Summarize spec', 'Create action items'],
  );
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="ai-chat-input-scenario" data-testid="ai-chat-input-reference">
        {reviewPanels && (
          <Button
            data-action="show-suggestions"
            size="small"
            onClick={() => setSuggestions([...suggestions, '深入了解'])}
          >
            显示建议
          </Button>
        )}
        <section className="ai-chat-input-scenario__card" data-parity-target="ai-chat-input-main">
          <AIChatInput
            {...(reviewPanels
              ? {
                  showTemplateButton: true,
                  renderTemplate: (_skill: unknown, onTemplateClick: (content: string) => void) => (
                    <div style={{ padding: 16 }}>
                      <Button onClick={() => onTemplateClick('模板内容')}>使用模板</Button>
                    </div>
                  ),
                }
              : {})}
            {...(query.get('aiInputCanSend') === 'false' ? { canSend: false } : {})}
            generating={query.get('aiInputGenerating') === 'true'}
            round={query.get('aiInputRound') !== 'false'}
            placeholder={
              locale === 'zh-CN' ? '请输入问题，按 Enter 发送' : 'Ask a question and press Enter'
            }
            defaultContent="<p>Semi UI Vue parity</p>"
            references={[
              {
                id: 'ref-1',
                type: 'text',
                content: locale === 'zh-CN' ? '产品规范' : 'Product spec',
              },
            ]}
            uploadProps={{
              action: '',
              defaultFileList: [
                { uid: 'file-1', name: 'roadmap.pdf', size: '24 KB', status: 'success' },
              ],
            }}
            suggestions={suggestions}
            skills={[{ value: 'search', label: locale === 'zh-CN' ? '联网搜索' : 'Web search' }]}
            skillHotKey="/"
          />
        </section>
      </div>
    </ConfigProvider>
  );
}
