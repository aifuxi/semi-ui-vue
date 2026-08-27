import React from 'react';

interface RatingStubProps {
  'aria-label'?: string;
  allowHalf?: boolean;
  character?: React.ReactNode;
  className?: string;
  count?: number;
  defaultValue?: number;
  disabled?: boolean;
  size?: 'small' | 'default' | number;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export default function SemiRatingStub({
  'aria-label': ariaLabel,
  allowHalf = false,
  character = '★',
  className,
  count = 5,
  defaultValue = 0,
  disabled = false,
  size = 'default',
  ...rest
}: RatingStubProps): React.ReactElement {
  return (
    <ul
      {...rest}
      aria-label={`Rating: ${defaultValue} of ${count} ${ariaLabel ?? 'star'}s,`}
      className={['semi-rating', disabled && 'semi-rating-disabled', className]
        .filter(Boolean)
        .join(' ')}
    >
      {Array.from({ length: count + 1 }, (_, index) => (
        <li
          className={[
            'semi-rating-star',
            typeof size === 'string' && `semi-rating-star-${size}`,
            index + 1 <= defaultValue && 'semi-rating-star-full',
            allowHalf &&
              index < defaultValue &&
              index + 1 > defaultValue &&
              'semi-rating-star-half',
          ]
            .filter(Boolean)
            .join(' ')}
          key={index}
        >
          <div className="semi-rating-star-wrapper">
            <div className="semi-rating-star-second" role="radio">
              {character}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
