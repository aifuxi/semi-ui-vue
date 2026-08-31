let currentNameSpaceId = 'default';

export function setCurrentNameSpaceId(id: string): void {
  currentNameSpaceId = id;
}

export function getCurrentNameSpaceId(): string {
  return currentNameSpaceId;
}
