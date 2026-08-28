import React from 'react';
import type { CardMetaProps, CardProps } from '@semi-v2.102.0/card';

function Meta({ avatar, className = '', description, title, ...rest }: CardMetaProps) {
  return (
    <div className={['semi-card-meta', className].filter(Boolean).join(' ')} {...rest}>
      {avatar ? <div className="semi-card-meta-avatar">{avatar}</div> : null}
      {title || description ? (
        <div className="semi-card-meta-wrapper">
          {title ? <div className="semi-card-meta-wrapper-title">{title}</div> : null}
          {description ? (
            <div className="semi-card-meta-wrapper-description">{description}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Card({
  actions,
  bordered = true,
  children,
  className = '',
  cover,
  footer,
  footerLine = false,
  header,
  headerExtraContent,
  headerLine = true,
  loading = false,
  shadows,
  title,
  ...rest
}: CardProps): React.ReactElement {
  return (
    <div
      className={[
        'semi-card',
        bordered ? 'semi-card-bordered' : '',
        shadows ? `semi-card-shadows semi-card-shadows-${shadows}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={loading}
      {...rest}
    >
      {header || title || headerExtraContent ? (
        <div
          className={['semi-card-header', headerLine ? 'semi-card-header-bordered' : '']
            .filter(Boolean)
            .join(' ')}
        >
          {header || (
            <div className="semi-card-header-wrapper">
              {headerExtraContent ? (
                <div className="semi-card-header-wrapper-extra">{headerExtraContent}</div>
              ) : null}
              {title ? <div className="semi-card-header-wrapper-title">{title}</div> : null}
            </div>
          )}
        </div>
      ) : null}
      {cover ? <div className="semi-card-cover">{cover}</div> : null}
      <div className="semi-card-body">
        {children && loading ? (
          <div className="semi-skeleton semi-skeleton-active">
            <div className="semi-skeleton-title" />
          </div>
        ) : (
          children
        )}
        {Array.isArray(actions) ? (
          <div className="semi-card-body-actions">
            {actions.map((action, index) => (
              <div key={index} className="semi-card-body-actions-item">
                {action}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {footer ? (
        <div
          className={['semi-card-footer', footerLine ? 'semi-card-footer-bordered' : '']
            .filter(Boolean)
            .join(' ')}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

Card.Meta = Meta;

export default Card;
