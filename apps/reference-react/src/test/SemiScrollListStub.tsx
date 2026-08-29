import React, { type CSSProperties, type ReactNode } from 'react';

interface ScrollListProps {
  bodyHeight?: number | string;
  children?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
}

interface ScrollItemProps {
  'aria-label'?: string;
  cycled?: boolean;
  list?: Array<{ disabled?: boolean; text?: string; value: unknown }>;
  mode?: 'normal' | 'wheel';
  selectedIndex?: number;
  style?: CSSProperties;
}

export function ScrollItem(props: ScrollItemProps): React.ReactElement {
  return (
    <div
      className={props.mode === 'normal' ? 'semi-scrolllist-item' : 'semi-scrolllist-item-wheel'}
    >
      <ul role="listbox" aria-label={props['aria-label']}>
        {props.list?.map((item, index) => (
          <li
            key={index}
            className={index === props.selectedIndex ? 'semi-scrolllist-item-sel' : ''}
          >
            {String(item.text ?? item.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ScrollList(props: ScrollListProps): React.ReactElement {
  return (
    <div className="semi-scrolllist">
      {props.header ? <div className="semi-scrolllist-header-title">{props.header}</div> : null}
      <div className="semi-scrolllist-body" style={{ height: props.bodyHeight }}>
        {props.children}
      </div>
      {props.footer ? <div className="semi-scrolllist-footer">{props.footer}</div> : null}
    </div>
  );
}
