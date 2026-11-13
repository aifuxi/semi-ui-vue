import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick, type Component } from 'vue';
import { afterEach, expect, it } from 'vitest';
import { IconClose } from '@aifuxi/semi-icons-vue';
import { semiGlobal } from '../config-provider';
import { SideSheet } from '../side-sheet';
import { Modal } from './index';

/** 保存本用例创建的实例，卸载时释放 Portal、滚动锁和键盘监听。 */
const wrappers: VueWrapper[] = [];

/** 等待 Portal 挂载与父子组件更新完成。 */
async function settle(): Promise<void> {
  await nextTick();
  await nextTick();
}

// 每项测试独立恢复全局默认与 document，避免污染现有 Modal/SideSheet 回归。
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  Modal.destroyAll();
  await settle();
  delete semiGlobal.config.overrideDefaultProps;
  document.body.replaceChildren();
});

// 同时覆盖 Modal 有标题/无标题两个关闭分支与 SideSheet 关闭入口。
for (const [name, component, title] of [
  ['Modal', Modal, '标题'],
  ['Modal', Modal, undefined],
  ['SideSheet', SideSheet, '标题'],
] as const) {
  // 通过公开组件验证默认、动态尺寸、独立图形和取消事件，而非内部 props。
  it(`${name} title=${title} 的关闭按钮尺寸可配置且保留原关闭事件`, async () => {
    /** 测试只通过公开 props 挂载；Component 统一两个组件的泛型。 */
    const wrapper = mount(component as Component, {
      attachTo: document.body,
      props: { visible: true, motion: false, title, footer: null },
    });
    wrappers.push(wrapper);
    await settle();
    /** Portal 中的实际关闭按钮，不能通过 wrapper.find 遗漏 Teleport 内容。 */
    const button = document.querySelector<HTMLButtonElement>(
      name === 'Modal' ? '.semi-modal-close' : '.semi-sidesheet-close',
    )!;
    expect(button.classList).toContain('semi-button-size-small');
    await wrapper.setProps({
      closeButtonSize: 'default',
      closeIcon: h(IconClose, { size: 'large' }),
    });
    // Button 的 default 档位使用基础样式，不生成 size-default class。
    expect(button.classList).not.toContain('semi-button-size-small');
    expect(button.classList).not.toContain('semi-button-size-large');
    expect(button.querySelector('.semi-icon-large')).not.toBeNull();
    await wrapper.setProps({ closeButtonSize: 'large' });
    expect(button.classList).toContain('semi-button-size-large');
    button.click();
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
  });

  // 全局默认复用已有覆盖机制，显式实例值优先，undefined 回到全局默认。
  it(`${name} title=${title} 的关闭尺寸遵循全局默认优先级`, async () => {
    semiGlobal.config.overrideDefaultProps = { [name]: { closeButtonSize: 'default' } };
    /** 全局默认应在首次 Portal 渲染时生效。 */
    const wrapper = mount(component as Component, {
      attachTo: document.body,
      props: { visible: true, motion: false, title, footer: null },
    });
    wrappers.push(wrapper);
    await settle();
    /** 关闭按钮节点应在更新时复用，并反映当前公开配置。 */
    const button = document.querySelector<HTMLButtonElement>(
      name === 'Modal' ? '.semi-modal-close' : '.semi-sidesheet-close',
    )!;
    // Button 的 default 档位使用基础样式，不生成 size-default class。
    expect(button.classList).not.toContain('semi-button-size-small');
    expect(button.classList).not.toContain('semi-button-size-large');
    await wrapper.setProps({ closeButtonSize: 'small' });
    expect(button.classList).toContain('semi-button-size-small');
    await wrapper.setProps({ closeButtonSize: undefined });
    // Button 的 default 档位使用基础样式，不生成 size-default class。
    expect(button.classList).not.toContain('semi-button-size-small');
    expect(button.classList).not.toContain('semi-button-size-large');
  });
}

// 命令式配置沿用 ModalProps，更新后不得漏传关闭按钮尺寸。
it('Modal.confirm 支持创建和更新关闭按钮尺寸', async () => {
  /** 显式开启确认弹窗的原生关闭入口。 */
  const handle = Modal.confirm({
    title: '确认',
    closable: true,
    motion: false,
    closeButtonSize: 'default',
  });
  await settle();
  expect(document.querySelector('.semi-modal-close')?.classList).not.toContain(
    'semi-button-size-small',
  );
  handle.update({ closeButtonSize: 'large' });
  await settle();
  expect(document.querySelector('.semi-modal-close')?.classList).toContain(
    'semi-button-size-large',
  );
});
