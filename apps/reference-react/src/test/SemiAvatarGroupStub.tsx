import React from 'react';
import type { AvatarProps } from '@semi-v2.102.0/avatar';
import type { AvatarGroupProps } from '@semi-v2.102.0/avatar-group';

import Avatar from './SemiAvatarStub';

export default function AvatarGroup({
  children,
  maxCount,
  overlapFrom = 'start',
  shape = 'circle',
  size = 'medium',
}: AvatarGroupProps): React.ReactElement {
  const avatars = React.Children.toArray(children).filter(React.isValidElement<AvatarProps>);
  const visible = typeof maxCount === 'number' ? avatars.slice(0, maxCount) : avatars;
  const restNumber = typeof maxCount === 'number' ? avatars.length - maxCount : 0;
  return (
    <div className="semi-avatar-group" role="list">
      {visible.map((avatar, index) =>
        React.cloneElement(avatar, {
          className: `${avatar.props.className ?? ''} semi-avatar-item-${overlapFrom}-${index}`,
          key: index,
          shape,
          size,
        }),
      )}
      {restNumber > 0 ? (
        <Avatar className="semi-avatar-item-more" shape={shape} size={size}>
          +{restNumber}
        </Avatar>
      ) : null}
    </div>
  );
}
