import React from 'react';
import List from '@semi-v2.102.0/list';
import Avatar from '@semi-v2.102.0/avatar';
import Button from '@semi-v2.102.0/button';

const people = [
  { name: 'Alice', role: 'Designer', initials: 'AL', color: 'blue' as const },
  { name: 'Bob', role: 'Engineer', initials: 'BO', color: 'green' as const },
];

/** 用真实列表 props 补齐视觉 review 的尺寸、loading 与 empty，默认场景不变。 */
export function ListScenario(): React.ReactElement {
  /** React/Vue 两端共享 query 语义。 */
  const query = new URLSearchParams(window.location.search);
  /** 固定基线支持的三档尺寸。 */
  const size = (
    ['small', 'default', 'large'].includes(query.get('reviewSize') ?? '')
      ? query.get('reviewSize')
      : undefined
  ) as 'small' | 'default' | 'large' | undefined;
  /** 额外状态只作用于首个完整列表，其他布局继续作为对照。 */
  const state = query.get('reviewState');
  return (
    <div className="list-scenario" data-testid="list-reference">
      <section data-parity-target="list-basic">
        <List
          bordered
          dataSource={state === 'empty' ? [] : people}
          size={size ?? 'default'}
          loading={state === 'loading'}
          header="团队成员"
          footer="共 2 位成员"
          // 仍由真实 List.Item 组合头像、正文与操作组件。
          renderItem={(item) => (
            <List.Item
              header={<Avatar color={item.color}>{item.initials}</Avatar>}
              main={
                <div className="list-scenario__main">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              }
              extra={<Button theme="borderless">详情</Button>}
            />
          )}
        />
      </section>
      <section data-parity-target="list-horizontal">
        <List layout="horizontal" size={size ?? 'small'}>
          <List.Item>
            <span className="list-scenario__pill list-scenario__pill--a" aria-label="文档" />
          </List.Item>
          <List.Item>
            <span className="list-scenario__pill list-scenario__pill--b" aria-label="组件" />
          </List.Item>
          <List.Item>
            <span className="list-scenario__pill list-scenario__pill--c" aria-label="主题" />
          </List.Item>
        </List>
      </section>
      <section data-parity-target="list-grid">
        <List
          dataSource={people}
          size={size ?? 'default'}
          grid={{ gutter: 12, span: 12 }}
          renderItem={(item) => <List.Item>{`${item.name} · ${item.role}`}</List.Item>}
        />
      </section>
    </div>
  );
}
