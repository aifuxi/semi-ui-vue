export type CollapseFoundationActiveKey = string | string[];

export interface CollapseFoundationProps {
  activeKey?: CollapseFoundationActiveKey | undefined;
  defaultActiveKey?: CollapseFoundationActiveKey | undefined;
  accordion?: boolean;
}

export interface CollapseFoundationState {
  activeSet: Set<string>;
}

export interface CollapseAdapter {
  getProps(): CollapseFoundationProps;
  getStates(): CollapseFoundationState;
  handleChange(activeKey: CollapseFoundationActiveKey, event: MouseEvent): void;
  addActiveKey(activeSet: Set<string>): void;
}

export class CollapseFoundation {
  constructor(adapter: CollapseAdapter);
  destroy(): void;
  initActiveKey(): string[];
  handleChange(activeKey: string, event: MouseEvent): void;
}

export function createCollapsePanelId(options?: { length?: number; prefix?: string }): string;
