import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Tree } from './index';

/** 真实页面加载态曾显示自画小圆圈，未使用固定 TreeNode 的 Spin。 */
describe('Tree 异步加载指示器', () => {
  /** Pending 到完成的同一路径同时保护加载形态与完成后的展开图标。 */
  it('loadData 未完成时使用标准 Spin，完成后恢复展开图标', async () => {
    /** 保存公开请求的完成函数，不依赖定时器等待瞬态。 */
    let complete: (() => void) | undefined;
    /** 同一真实 Promise 控制可观察的加载生命周期。 */
    const pending = new Promise<void>(
      /** 测试会显式完成该请求并观察恢复状态。 */
      (resolve) => {
        complete = resolve;
      },
    );
    /** 无 children 且 isLeaf=false 才会在展开时走异步加载。 */
    const wrapper = mount(Tree, {
      attachTo: document.body,
      props: {
        treeData: [{ key: 'async', label: '异步节点', isLeaf: false }],
        /** 公开 loadData 保持 pending，和浏览器专项场景相同。 */
        loadData: () => pending,
      },
    });
    await wrapper.get('.semi-tree-option-expand-icon').trigger('click');
    expect(wrapper.get('.semi-tree-option-spin-icon').classes()).toContain('semi-spin');
    expect(wrapper.get('.semi-tree-option-spin-icon').classes()).toContain('semi-spin-middle');
    expect(wrapper.find('.semi-tree-option-spin-icon svg linearGradient').exists()).toBe(true);
    complete?.();
    await flushPromises();
    expect(wrapper.find('.semi-tree-option-spin-icon').exists()).toBe(false);
    expect(wrapper.find('.semi-tree-option-expand-icon').exists()).toBe(true);
    wrapper.unmount();
  });
});
