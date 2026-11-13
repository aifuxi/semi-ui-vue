import { afterEach, expect, it, vi } from 'vitest';

import { runAfterTicks } from './index';

// 每个用例恢复真实定时器，避免延迟任务影响其他工具测试。
afterEach(() => {
  vi.useRealTimers();
});

// 零次、一次和多次 macrotask 的同步异常都应拒绝调用方持有的 Promise。
it.each([0, 1, 2])('runAfterTicks 在 %i 次 tick 后传递同步异常', async (ticks) => {
  vi.useFakeTimers();
  // 保留错误身份，以确认异常沿原调用链传播。
  const error = new Error('同步回调失败');
  // 回调模拟实际业务函数抛错。
  const callback = vi.fn(() => {
    throw error;
  });
  // 在驱动定时器前订阅拒绝，避免测试自身制造未处理异常。
  const rejection = expect(runAfterTicks(callback, ticks)).rejects.toBe(error);
  await vi.runAllTimersAsync();
  await rejection;
  expect(callback).toHaveBeenCalledOnce();
});

// 异步回调拒绝与同步抛错遵循同一返回契约。
it.each([0, 1, 2])('runAfterTicks 在 %i 次 tick 后传递异步拒绝', async (ticks) => {
  vi.useFakeTimers();
  // 回归检查保留异步失败的原始错误对象。
  const error = new Error('异步回调失败');
  // 用返回 rejected Promise 的业务回调覆盖异步失败分支。
  const callback = vi.fn(() => Promise.reject(error));
  // 先注册拒绝断言，再推进全部 macrotask。
  const rejection = expect(runAfterTicks(callback, ticks)).rejects.toBe(error);
  await vi.runAllTimersAsync();
  await rejection;
  expect(callback).toHaveBeenCalledOnce();
});
