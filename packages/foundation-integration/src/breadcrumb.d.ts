export interface BreadcrumbAdapter {
  notifyClick(itemInfo: unknown, event: MouseEvent | KeyboardEvent): void;
  expandCollapsed(event?: MouseEvent | KeyboardEvent): void;
}

export class BreadcrumbFoundation {
  constructor(adapter: BreadcrumbAdapter);
  init(): void;
  destroy(): void;
  handleClick(itemInfo: unknown, event: MouseEvent | KeyboardEvent): void;
  handleExpand(event?: MouseEvent | KeyboardEvent): void;
  handleExpandEnterPress(event: KeyboardEvent): void;
  genRoutes(routes: unknown[]): Array<Record<string, unknown>>;
}

export interface BreadcrumbItemAdapter {
  notifyClick(itemInfo: unknown, event: MouseEvent | KeyboardEvent): void;
  notifyParent(itemInfo: unknown, event: MouseEvent | KeyboardEvent): void;
}

export class BreadcrumbItemFoundation {
  constructor(adapter: BreadcrumbItemAdapter);
  init(): void;
  destroy(): void;
  handleClick(itemInfo: unknown, event: MouseEvent | KeyboardEvent): void;
}
