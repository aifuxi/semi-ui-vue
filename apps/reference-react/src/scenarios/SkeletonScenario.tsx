import React from 'react';
import Skeleton from '@semi-v2.102.0/skeleton';

/** Review query 补齐骨架头像尺寸，其余加载/已加载内容继续沿用原场景。 */
export function SkeletonScenario(): React.ReactElement {
  /** 仅显式开启时增加尺寸行，避免改变默认快照。 */
  const reviewSizes = new URLSearchParams(window.location.search).get('reviewSizes') === 'all';
  /** 七档值来自固定 Semi 公共枚举。 */
  const avatarSizes = [
    'extra-extra-small',
    'extra-small',
    'small',
    'default',
    'medium',
    'large',
    'extra-large',
  ] as const;
  /** 原有组合骨架继续验证文字与头像的布局。 */
  const profilePlaceholder = (
    <div className="skeleton-scenario__profile-placeholder">
      <Skeleton.Avatar data-parity-target="skeleton-avatar-default" />
      <div className="skeleton-scenario__profile-copy">
        <Skeleton.Title
          data-parity-target="skeleton-title"
          style={{ width: 140, marginBottom: 12 }}
        />
        <Skeleton.Paragraph rows={3} />
      </div>
    </div>
  );

  return (
    <div className="skeleton-scenario" data-testid="skeleton-reference">
      {reviewSizes && (
        <div className="skeleton-scenario__items" data-review-sizes>
          {avatarSizes.map(
            /** 每个尺寸实例都来自真实固定参考组件。 */
            (size) => (
              <Skeleton.Avatar key={size} size={size} />
            ),
          )}
        </div>
      )}
      <Skeleton active data-parity-target="skeleton-root" placeholder={profilePlaceholder}>
        <article>Profile loaded</article>
      </Skeleton>

      <div className="skeleton-scenario__items">
        <Skeleton.Avatar size="extra-small" />
        <Skeleton.Avatar data-parity-target="skeleton-avatar-square" shape="square" size="large" />
        <Skeleton.Button data-parity-target="skeleton-button" />
        <div className="skeleton-scenario__paragraph" data-parity-target="skeleton-paragraph">
          <Skeleton.Paragraph rows={4} />
        </div>
      </div>

      <Skeleton
        data-parity-target="skeleton-image-root"
        loading={true}
        placeholder={<Skeleton.Image data-parity-target="skeleton-image" />}
        style={{ width: 180, height: 108 }}
      >
        <span>Image loaded</span>
      </Skeleton>

      <Skeleton loading={false} placeholder={<Skeleton.Title />}>
        <p className="skeleton-scenario__loaded" data-parity-target="skeleton-loaded">
          Content ready
        </p>
      </Skeleton>
    </div>
  );
}
