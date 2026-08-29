import React from 'react';
import Skeleton from '@semi-v2.102.0/skeleton';

export function SkeletonScenario(): React.ReactElement {
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
