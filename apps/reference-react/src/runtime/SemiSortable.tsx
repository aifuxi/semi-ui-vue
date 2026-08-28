import React from 'react';

export interface RenderItemProps {
  id?: string | number;
  sortableHandle?: (component: React.ComponentType) => React.ComponentType;
}

interface SortableProps {
  container?: React.ComponentType<{ children?: React.ReactNode }>;
  items?: Array<string | number>;
  renderItem?: (props: RenderItemProps) => React.ReactNode;
}

export function Sortable({
  container: Container = React.Fragment,
  items = [],
  renderItem = () => null,
}: SortableProps): React.ReactElement {
  const sortableHandle = (Component: React.ComponentType) => Component;
  return (
    <Container>
      {items.map((id) => (
        <React.Fragment key={id}>{renderItem({ id, sortableHandle })}</React.Fragment>
      ))}
    </Container>
  );
}
