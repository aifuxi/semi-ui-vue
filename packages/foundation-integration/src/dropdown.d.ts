export interface DropdownAdapter<Props, State> {
  getProps(): Props;
  getStates(): State;
  getPopupId(): string;
  notifyVisibleChange(visible: boolean): void;
  setPopVisible(visible: boolean): void;
}

export class DropdownFoundation<Props, State> {
  constructor(adapter: DropdownAdapter<Props, State>);
  handleVisibleChange(visible: boolean): void;
  handleKeyDown(event: KeyboardEvent): void;
  setFocusToFirstMenuItem(id: string): void;
  setFocusToLastMenuItem(id: string): void;
}

export interface DropdownMenuAdapter {
  getContext(key: string): unknown;
}

export class DropdownMenuFoundation {
  constructor(adapter: DropdownMenuAdapter);
  onMenuKeydown(event: KeyboardEvent): void;
}
