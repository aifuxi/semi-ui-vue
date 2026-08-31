import React from 'react';

function SemiSidebarCodeContentStub(props: Record<string, unknown>): React.ReactElement {
  const codes = Array.isArray(props.codes) ? props.codes : [];
  return (
    <div className="semi-sidebar-collapse semi-sidebar-collapse-code">
      {codes.map((code, index) => (
        <div className="semi-collapse-item" key={String((code as { key?: unknown }).key ?? index)}>
          {String((code as { content?: unknown }).content ?? '')}
        </div>
      ))}
    </div>
  );
}

function SemiSidebarStub(props: Record<string, unknown>): React.ReactElement {
  const options = Array.isArray(props.options) ? props.options : [];
  return (
    <div className="semi-sidebar-container">
      <div className="semi-sidebar-container-header">{props.title as React.ReactNode}</div>
      <div className="semi-sidebar-options">
        {options.map((option, index) => (
          <button className="semi-sidebar-options-button" key={index} type="button">
            {(option as { name?: React.ReactNode }).name}
          </button>
        ))}
      </div>
      {typeof props.renderMainContent === 'function'
        ? (props.renderMainContent as (activeKey: unknown) => React.ReactNode)(props.activeKey)
        : null}
    </div>
  );
}

SemiSidebarStub.CodeContent = SemiSidebarCodeContentStub;

export default SemiSidebarStub;
