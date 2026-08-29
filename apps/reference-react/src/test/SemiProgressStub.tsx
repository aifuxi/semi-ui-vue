import React, { type ReactNode } from 'react';

interface Props {
  format?: (percent: number) => ReactNode;
  percent?: number;
  showInfo?: boolean;
}

export default function Progress({ format, percent = 0, showInfo = false }: Props) {
  return (
    <div className="semi-progress" role="progressbar" aria-valuenow={percent}>
      {showInfo ? (format?.(percent) ?? `${percent}%`) : null}
    </div>
  );
}
