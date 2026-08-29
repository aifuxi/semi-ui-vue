import React from 'react';
import List from '@semi-v2.102.0/list';
import Avatar from '@semi-v2.102.0/avatar';
import Button from '@semi-v2.102.0/button';

const people = [
  { name: 'Alice', role: 'Designer', initials: 'AL', color: 'blue' as const },
  { name: 'Bob', role: 'Engineer', initials: 'BO', color: 'green' as const },
];

export function ListScenario(): React.ReactElement {
  return (
    <div className="list-scenario" data-testid="list-reference">
      <section data-parity-target="list-basic">
        <List
          bordered
          dataSource={people}
          header="团队成员"
          footer="共 2 位成员"
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
        <List layout="horizontal" size="small">
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
          grid={{ gutter: 12, span: 12 }}
          renderItem={(item) => <List.Item>{`${item.name} · ${item.role}`}</List.Item>}
        />
      </section>
    </div>
  );
}
