import React from 'react';
import OverflowList from '@semi-v2.102.0/overflow-list';

const items = [
  { key: 'alarm', label: 'Alarm' },
  { key: 'bookmark', label: 'Bookmark' },
  { key: 'camera', label: 'Camera' },
  { key: 'duration', label: 'Duration' },
  { key: 'folder', label: 'Folder' },
];

const renderItem = (item: (typeof items)[number]): React.ReactElement => (
  <span className="overflow-list-scenario__item">{item.label}</span>
);
const renderOverflow = (hidden: typeof items): React.ReactElement => (
  <span className="overflow-list-scenario__overflow">+{hidden.length}</span>
);

export function OverflowListScenario(): React.ReactElement {
  return (
    <div className="overflow-list-scenario" data-testid="overflow-list-reference">
      <section data-parity-target="overflow-list-end">
        <OverflowList
          items={items}
          visibleItemRenderer={renderItem}
          overflowRenderer={renderOverflow}
        />
      </section>
      <section data-parity-target="overflow-list-start">
        <OverflowList
          items={items}
          collapseFrom="start"
          minVisibleItems={2}
          visibleItemRenderer={renderItem}
          overflowRenderer={renderOverflow}
        />
      </section>
      <section data-parity-target="overflow-list-scroll">
        <OverflowList
          items={items}
          renderMode="scroll"
          visibleItemRenderer={(item) => (
            <span key={item.key} className="overflow-list-scenario__scroll-item">
              {item.label}
            </span>
          )}
          overflowRenderer={(groups) =>
            groups.map((hidden, index) =>
              hidden.length ? (
                <span
                  key={index === 0 ? 'start' : 'end'}
                  className="overflow-list-scenario__edge"
                  data-position={index === 0 ? 'start' : 'end'}
                >
                  {hidden.length}
                </span>
              ) : null,
            )
          }
        />
      </section>
    </div>
  );
}
