export interface DescriptionsAdapter<Props, Column> {
  getProps(): Props;
  getColumns(): Column[];
}

export class DescriptionsFoundation<Props, Column> {
  constructor(adapter: DescriptionsAdapter<Props, Column>);
  getHorizontalList(): Column[][];
}
