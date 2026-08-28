import React, {
  Children,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

interface CarouselProps {
  activeIndex?: number;
  animation?: 'slide' | 'fade';
  arrowType?: 'always' | 'hover';
  autoPlay?: boolean | Record<string, unknown>;
  children?: ReactNode;
  className?: string;
  defaultActiveIndex?: number;
  indicatorPosition?: 'left' | 'center' | 'right';
  indicatorSize?: 'small' | 'medium';
  indicatorType?: 'dot' | 'line' | 'columnar';
  onChange?: (index: number, previous: number) => void;
  showArrow?: boolean;
  showIndicator?: boolean;
  slideDirection?: 'left' | 'right';
  speed?: number;
  style?: CSSProperties;
  theme?: 'light' | 'dark' | 'primary';
  [key: `data-${string}`]: string | undefined;
}

export default function SemiCarouselStub({
  activeIndex,
  animation = 'slide',
  arrowType = 'always',
  children,
  className,
  defaultActiveIndex = 0,
  indicatorPosition = 'center',
  indicatorSize = 'small',
  indicatorType = 'dot',
  onChange,
  showArrow = true,
  showIndicator = true,
  speed = 300,
  style,
  theme = 'light',
  ...rest
}: CarouselProps): ReactElement {
  const nodes = Children.toArray(children).filter(React.isValidElement) as ReactElement[];
  const [inner, setInner] = useState(defaultActiveIndex);
  const current = activeIndex ?? inner;
  const change = (next: number) => {
    onChange?.(next, current);
    if (activeIndex === undefined) setInner(next);
  };
  return (
    <div className={`semi-carousel${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <div className={`semi-carousel-content semi-carousel-content-${animation}`}>
        {nodes.map((node, index) =>
          React.cloneElement(node, {
            className: `${node.props.className ?? ''} semi-carousel-content-item${index === current ? ' semi-carousel-content-item-current semi-carousel-content-item-active' : ''}`,
            style: {
              ...node.props.style,
              animationDuration: `${speed}ms`,
              transitionDuration: `${speed}ms`,
            },
          }),
        )}
      </div>
      {showIndicator && nodes.length > 1 ? (
        <div className="semi-carousel-indicator">
          <div
            className={`semi-carousel-indicator semi-carousel-indicator-${indicatorType} semi-carousel-indicator-${indicatorPosition}`}
          >
            {nodes.map((_, index) => (
              <span
                key={index}
                data-index={index}
                className={`semi-carousel-indicator-item semi-carousel-indicator-item-${theme} semi-carousel-indicator-item-${indicatorSize}${index === current ? ' semi-carousel-indicator-item-active' : ''}`}
                onClick={() => change(index)}
              />
            ))}
          </div>
        </div>
      ) : null}
      {showArrow && nodes.length > 1 ? (
        <div
          className={`semi-carousel-arrow semi-carousel-arrow-${theme}${arrowType === 'hover' ? ' semi-carousel-arrow-hover' : ''}`}
        >
          <div
            className="semi-carousel-arrow-prev"
            onClick={() => change((current - 1 + nodes.length) % nodes.length)}
          />
          <div
            className="semi-carousel-arrow-next"
            onClick={() => change((current + 1) % nodes.length)}
          />
        </div>
      ) : null}
    </div>
  );
}
