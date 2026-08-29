import React from 'react';
import Tag from './SemiTagStub';

interface TagGroupProps {
  maxTagCount?: number;
  restCount?: number;
  tagList: Array<React.ComponentProps<typeof Tag>>;
}

export default function SemiTagGroupStub({
  maxTagCount,
  restCount,
  tagList,
}: TagGroupProps): React.ReactElement {
  const visible = maxTagCount === undefined ? tagList : tagList.slice(0, maxTagCount);
  const count = restCount || (maxTagCount === undefined ? 0 : tagList.length - maxTagCount);
  return (
    <div className={`semi-tag-group${maxTagCount === undefined ? '' : ' semi-tag-group-max'}`}>
      {visible.map((tag, index) => (
        <Tag key={tag.tagKey ?? index} {...tag} />
      ))}
      {count > 0 ? <Tag style={{ backgroundColor: 'transparent' }}>+{count}</Tag> : null}
    </div>
  );
}
