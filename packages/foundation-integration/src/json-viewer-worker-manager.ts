/// <reference types="vite/client" />

import JsonWorkerConstructor from './json-viewer-worker-entry?worker&inline';
import { getCurrentNameSpaceId } from './json-viewer-namespace';

interface ModelContentChangeEvent {
  changes: unknown;
  isFlush?: boolean;
}

interface WorkerService {
  init: { value: string };
  updateModel: { op: ModelContentChangeEvent | ModelContentChangeEvent[] };
  format: { options: Record<string, unknown> };
  foldRange: Record<string, never>;
  validate: Record<string, never>;
  undo: Record<string, never>;
  redo: Record<string, never>;
}

interface WorkerResponse {
  error?: string;
  messageId: number;
  result?: unknown;
}

const workerManagerMap = new Map<string, JsonWorkerManager>();

export class JsonWorkerManager {
  private readonly callbacks = new Map<number, (result: unknown) => void>();
  private readonly worker: Worker;

  constructor() {
    this.worker = new JsonWorkerConstructor();
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { messageId, result, error } = event.data;
      const callback = this.callbacks.get(messageId);
      if (!callback) return;
      callback(error ? new Error(error) : result);
      this.callbacks.delete(messageId);
    };
  }

  init(value: string): Promise<unknown> {
    return this.sendRequest('init', { value });
  }

  updateModel(op: ModelContentChangeEvent | ModelContentChangeEvent[]): Promise<unknown> {
    return this.sendRequest('updateModel', { op });
  }

  undo(): Promise<unknown> {
    return this.sendRequest('undo', {});
  }

  redo(): Promise<unknown> {
    return this.sendRequest('redo', {});
  }

  formatJson(options: Record<string, unknown>): Promise<unknown> {
    return this.sendRequest('format', { options });
  }

  foldRange(): Promise<unknown> {
    return this.sendRequest('foldRange', {});
  }

  validate(): Promise<unknown> {
    return this.sendRequest('validate', {});
  }

  dispose(): void {
    this.worker.terminate();
    this.callbacks.clear();
  }

  private sendRequest<Key extends keyof WorkerService>(
    method: Key,
    params: WorkerService[Key],
  ): Promise<unknown> {
    return new Promise((resolve) => {
      const messageId = Date.now() + Math.random();
      this.callbacks.set(messageId, resolve);
      this.worker.postMessage({ messageId, method, params });
    });
  }
}

export function getJsonWorkerManager(): JsonWorkerManager {
  const namespaceModuleId = getCurrentNameSpaceId();
  let manager = workerManagerMap.get(namespaceModuleId);
  if (!manager) {
    manager = new JsonWorkerManager();
    workerManagerMap.set(namespaceModuleId, manager);
  }
  return manager;
}

export function disposeWorkerManager(id: string): void {
  const manager = workerManagerMap.get(id);
  if (!manager) return;
  workerManagerMap.delete(id);
  manager.dispose();
}
