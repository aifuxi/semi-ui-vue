import React from 'react';
import Empty from '@semi-v2.102.0/empty';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
  IllustrationSuccess,
  IllustrationSuccessDark,
} from '@semi-v2.102.0/illustrations';

const STRING_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"%3E%3Crect x="8" y="8" width="56" height="56" rx="14" fill="%23e8f3ff"/%3E%3Cpath d="M23 36h26M36 23v26" stroke="%230066ff" stroke-width="4" stroke-linecap="round"/%3E%3C/svg%3E';

export function EmptyScenario(): React.ReactElement {
  return (
    <div className="empty-scenario" data-testid="empty-reference">
      <svg className="empty-scenario__symbols" aria-hidden="true">
        <defs>
          <symbol id="empty-parity-symbol" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="var(--semi-color-fill-0)" />
            <path
              d="M24 36H48"
              stroke="var(--semi-color-text-2)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </symbol>
        </defs>
      </svg>

      <section className="empty-scenario__primary">
        <span className="empty-scenario__label">完整空状态</span>
        <Empty
          image={
            <IllustrationNoContent
              className="empty-scenario__illustration"
              style={{ width: 150, height: 150 }}
              data-variant="light"
            />
          }
          darkModeImage={
            <IllustrationNoContentDark
              className="empty-scenario__illustration"
              style={{ width: 150, height: 150 }}
              data-variant="dark"
            />
          }
          title="暂无数据"
          description="创建第一条记录后，内容会显示在这里。"
          data-parity-target="empty-vertical"
        >
          <button className="empty-scenario__action" type="button">
            创建记录
          </button>
        </Empty>
      </section>

      <section className="empty-scenario__row">
        <div className="empty-scenario__cell">
          <span className="empty-scenario__label">无图片</span>
          <Empty
            title="未找到匹配结果"
            description="请尝试调整筛选条件。"
            data-parity-target="empty-no-image"
          />
        </div>
        <div className="empty-scenario__cell empty-scenario__cell--wide">
          <span className="empty-scenario__label">水平布局</span>
          <Empty
            layout="horizontal"
            image={
              <IllustrationSuccess
                className="empty-scenario__illustration"
                style={{ width: 150, height: 150 }}
                data-variant="light"
              />
            }
            darkModeImage={
              <IllustrationSuccessDark
                className="empty-scenario__illustration"
                style={{ width: 150, height: 150 }}
                data-variant="dark"
              />
            }
            title="操作已完成"
            description="你可以继续配置权限和通知规则。"
            data-parity-target="empty-horizontal"
          >
            <a className="empty-scenario__link" href="#details">
              查看详情
            </a>
          </Empty>
        </div>
      </section>

      <section className="empty-scenario__row empty-scenario__row--compact">
        <div className="empty-scenario__cell">
          <span className="empty-scenario__label">SVG 描述对象</span>
          <Empty
            image={{ id: 'empty-parity-symbol', viewBox: '0 0 72 72' }}
            imageStyle={{ width: 72, height: 72 }}
            description="暂无内容"
            data-parity-target="empty-symbol"
          />
        </div>
        <div className="empty-scenario__cell">
          <span className="empty-scenario__label">字符串图片</span>
          <Empty
            image={STRING_IMAGE}
            imageStyle={{ width: 72, height: 72 }}
            description="添加一个项目"
            data-parity-target="empty-string-image"
          />
        </div>
      </section>
    </div>
  );
}
