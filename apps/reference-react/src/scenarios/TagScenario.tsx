import React from 'react';
import Tag from '@semi-v2.102.0/tag';
import TagGroup from '@semi-v2.102.0/tag-group';
import SplitTagGroup from '@semi-v2.102.0/split-tag-group';

const tagList = [
  { tagKey: 'one', children: 'One', color: 'blue' as const },
  { tagKey: 'two', children: 'Two', color: 'cyan' as const },
  { tagKey: 'three', children: 'Three', color: 'teal' as const },
  { tagKey: 'four', children: 'Four', color: 'green' as const },
];

export function TagScenario(): React.ReactElement {
  return (
    <div className="tag-scenario" data-testid="tag-reference">
      <div className="tag-scenario__row" data-parity-target="tag-basic">
        <Tag color="blue" type="solid" size="large">
          Primary
        </Tag>
        <Tag color="amber" closable>
          Closable
        </Tag>
        <Tag color="violet" shape="circle">
          Rounded
        </Tag>
      </div>
      <div data-parity-target="tag-group">
        <TagGroup maxTagCount={2} tagList={tagList} />
      </div>
      <div data-parity-target="tag-split">
        <SplitTagGroup aria-label="connected tags">
          <Tag color="blue" type="solid">
            One
          </Tag>
          <Tag color="cyan" type="solid">
            Two
          </Tag>
          <Tag color="teal" type="solid">
            Three
          </Tag>
        </SplitTagGroup>
      </div>
    </div>
  );
}
