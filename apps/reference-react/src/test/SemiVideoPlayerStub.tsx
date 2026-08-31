import React from 'react';

export default function SemiVideoPlayerStub(props: Record<string, unknown>): React.ReactElement {
  const { className, height, poster, src, style, theme = 'dark', width, ...rest } = props;
  return (
    <div
      {...rest}
      className={['semi-videoPlayer', className].filter(Boolean).join(' ')}
      style={{
        width: width as React.CSSProperties['width'],
        height: height as React.CSSProperties['height'],
        ...(style as React.CSSProperties | undefined),
      }}
    >
      <div className={`semi-videoPlayer-wrapper semi-videoPlayer-wrapper-${String(theme)}`}>
        <video src={src as string | undefined} />
      </div>
      {poster ? (
        <img className="semi-videoPlayer-poster" src={String(poster)} alt="poster" />
      ) : null}
      <div className="semi-videoPlayer-controls" />
    </div>
  );
}
