import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import { Form } from './index';

// 通过公开 compound API 覆盖运行时 props 解析，不能只测试内部 truthiness 判断。
describe('Form.ErrorMessage 原版空错误契约', () => {
  // 这些值在 React 基线中不输出错误区域或图标，空数组也不产生占位。
  it.each([undefined, false, '', []])('空错误 %j 不显示错误区域或图标', (error) => {
    // 固定显示错误图标选项，防止靠关闭图标掩盖空值转换问题。
    const wrapper = mount(Form.ErrorMessage, {
      props: { error, validateStatus: 'error', showValidateIcon: true },
    });
    expect(wrapper.find('.semi-form-field-error-message').exists()).toBe(false);
    expect(wrapper.find('.semi-form-field-validate-status-icon').exists()).toBe(false);
  });

  // 基线特意抑制隐藏文本错误，不能错误地退回显示正常帮助文案。
  it('空字符串错误抑制帮助文案，普通无错误仍显示帮助文案', async () => {
    // error 状态下使用空串，模拟 async-validator 的隐藏错误文案约定。
    const wrapper = mount(Form.ErrorMessage, {
      props: { error: '', helpText: '辅助说明', validateStatus: 'error', showValidateIcon: true },
    });
    expect(wrapper.find('.semi-form-field-help-text').exists()).toBe(false);
    await wrapper.setProps({ error: undefined });
    expect(wrapper.get('.semi-form-field-help-text').text()).toBe('辅助说明');
    expect(wrapper.find('.semi-form-field-error-message').exists()).toBe(false);
  });

  // React 保留 truthy 非可渲染错误的空容器，但不会凭空补充校验图标。
  it.each([true, 1])('非文本错误 %j 保留空容器且无图标', (error) => {
    // 同时提供帮助文案，确认 truthy error 不会退回正常帮助状态。
    const wrapper = mount(Form.ErrorMessage, {
      props: { error, helpText: '辅助说明', validateStatus: 'error', showValidateIcon: true },
    });
    expect(wrapper.get('.semi-form-field-error-message').text()).toBe('');
    expect(wrapper.find('.semi-form-field-validate-status-icon').exists()).toBe(false);
  });

  // 验证错误、清除、再次错误的公开更新路径，防止旧 DOM 或错误图标残留。
  it('错误文字与图标随错误清除和再次设置同步更新', async () => {
    // 初始值等同快捷字段编辑尚未报错时的原始空字符串。
    const wrapper = mount(Form.ErrorMessage, {
      props: { error: '', validateStatus: 'error', showValidateIcon: true },
    });
    for (const error of ['请填写名称。', '', '再次错误']) {
      await wrapper.setProps({ error });
      expect(wrapper.find('.semi-form-field-error-message').exists()).toBe(Boolean(error));
      expect(wrapper.find('.semi-form-field-validate-status-icon').exists()).toBe(Boolean(error));
      if (error) expect(wrapper.get('.semi-form-field-error-message').text()).toBe(error);
    }
  });

  // 保留数组和 Vue 节点的实际文本，不将修复扩大为只支持字符串错误。
  it('数组和 VNode 错误正常显示，关闭图标选项仍有效', async () => {
    // 数组过滤空项后按 React 约定用逗号连接。
    const wrapper = mount(Form.ErrorMessage, {
      props: {
        error: ['', '错误一', false, '错误二'],
        validateStatus: 'error',
        showValidateIcon: true,
      },
    });
    expect(wrapper.text()).toBe('错误一, 错误二');
    expect(wrapper.find('.semi-form-field-validate-status-icon').exists()).toBe(true);
    await wrapper.setProps({ error: h('strong', '节点错误'), showValidateIcon: false });
    expect(wrapper.get('strong').text()).toBe('节点错误');
    expect(wrapper.find('.semi-form-field-validate-status-icon').exists()).toBe(false);
  });
});
