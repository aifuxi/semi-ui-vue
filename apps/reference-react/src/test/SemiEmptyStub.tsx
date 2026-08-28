import React from 'react';

interface SemiEmptyStubProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  darkModeImage?: React.ReactNode;
  description?: React.ReactNode;
  image?: React.ReactNode | { id?: string };
  imageStyle?: React.CSSProperties;
  layout?: 'vertical' | 'horizontal';
  title?: React.ReactNode;
}

export default function SemiEmptyStub({
  children,
  darkModeImage,
  description,
  image,
  imageStyle,
  layout = 'vertical',
  title,
  ...rest
}: SemiEmptyStubProps): React.ReactElement {
  const renderedImage = image ?? darkModeImage;
  return (
    <div className={`semi-empty semi-empty-${layout}`} {...rest}>
      <div className="semi-empty-image" style={imageStyle}>
        {React.isValidElement(renderedImage) || typeof renderedImage === 'string'
          ? renderedImage
          : null}
      </div>
      <div className="semi-empty-content">
        {title ? <h4 className="semi-empty-title">{title}</h4> : null}
        {description ? <div className="semi-empty-description">{description}</div> : null}
        {children ? <div className="semi-empty-footer">{children}</div> : null}
      </div>
    </div>
  );
}
