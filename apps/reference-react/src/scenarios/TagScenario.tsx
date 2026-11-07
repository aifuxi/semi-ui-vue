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

/** 视觉 review 通过 query 覆盖公开尺寸/类型，默认参考场景保持原样。 */
export function TagScenario(): React.ReactElement {
  /** 与 Vue 场景使用相同 query，避免修改组件 DOM 或样式伪造状态。 */
  const query = new URLSearchParams(window.location.search);
  /** 固定 Semi 的三档公开尺寸。 */
  const size = (
    ['small', 'default', 'large'].includes(query.get('reviewSize') ?? '')
      ? query.get('reviewSize')
      : undefined
  ) as 'small' | 'default' | 'large' | undefined;
  /** 固定 Semi 的三种颜色类型。 */
  const type = (
    ['light', 'solid', 'ghost'].includes(query.get('reviewType') ?? '')
      ? query.get('reviewType')
      : undefined
  ) as 'light' | 'solid' | 'ghost' | undefined;
  return (
    <div className="tag-scenario" data-testid="tag-reference">
      <div className="tag-scenario__row" data-parity-target="tag-basic">
        <Tag color="blue" type={type ?? 'solid'} size={size ?? 'large'}>
          Primary
        </Tag>
        <Tag color="amber" type={type ?? 'light'} size={size ?? 'default'} closable>
          Closable
        </Tag>
        <Tag color="violet" type={type ?? 'light'} size={size ?? 'default'} shape="circle">
          Rounded
        </Tag>
      </div>
      <div data-parity-target="tag-group">
        <TagGroup maxTagCount={2} tagList={tagList} size={size ?? 'default'} />
      </div>
      <div data-parity-target="tag-split">
        <SplitTagGroup aria-label="connected tags">
          <Tag color="blue" type={type ?? 'solid'} size={size ?? 'default'}>
            One
          </Tag>
          <Tag color="cyan" type={type ?? 'solid'} size={size ?? 'default'}>
            Two
          </Tag>
          <Tag color="teal" type={type ?? 'solid'} size={size ?? 'default'}>
            Three
          </Tag>
        </SplitTagGroup>
      </div>
    </div>
  );
}
