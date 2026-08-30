/* eslint-disable vue/one-component-per-file -- local hosts exercise external form and Boolean VNode contracts. */
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

import {
  ArrayField,
  Form,
  FormInput,
  type ArrayFieldSlotProps,
  type FormApi,
  useForm,
} from './index';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

async function settle(): Promise<void> {
  await nextTick();
  await flushPromises();
  await nextTick();
}

describe('Form alignment gates', () => {
  it('keeps field initValue above form initValues and emits the upstream change order', async () => {
    const order: string[] = [];
    let api!: FormApi;
    const wrapper = mount(Form, {
      props: {
        initValues: { name: 'form' },
        getFormApi: (value) => (api = value),
        onValueChange: () => order.push('valueChange'),
        onChange: () => order.push('formChange'),
      },
      slots: {
        default: () =>
          h(Form.Input, {
            field: 'name',
            initValue: 'field',
            onChange: (_value: string, _event: Event, values: Record<string, unknown>) => {
              expect(values.name).toBe('next');
              order.push('fieldChange');
            },
          }),
      },
      attachTo: document.body,
    });
    await settle();
    expect(api.getValue('name')).toBe('field');
    await wrapper.get('input').setValue('next');
    await settle();
    expect(order).toEqual(['fieldChange', 'formChange', 'valueChange']);
    expect(api.getValues()).toEqual({ name: 'next' });
  });

  it('supports custom, async, rules and silent validation', async () => {
    let api!: FormApi;
    const wrapper = mount(Form, {
      props: { getFormApi: (value) => (api = value) },
      slots: {
        default: () => [
          h(Form.Input, {
            field: 'required',
            rules: [{ required: true, message: 'required message' }],
          }),
          h(Form.Input, {
            field: 'custom',
            initValue: 'bad',
            validator: async (value: unknown) => (value === 'ok' ? undefined : 'custom message'),
          }),
        ],
      },
      attachTo: document.body,
    });
    await settle();
    await expect(api.validate({ silent: true })).rejects.toBeTruthy();
    expect(wrapper.find('.semi-form-field-error-message').exists()).toBe(false);
    await expect(api.validate()).rejects.toBeTruthy();
    await settle();
    expect(wrapper.text()).toContain('required message');
    expect(wrapper.text()).toContain('custom message');
    api.setValues({ required: 'yes', custom: 'ok' });
    await expect(api.validate()).resolves.toEqual({ required: 'yes', custom: 'ok' });
  });

  it('keeps nested paths, reset and external useForm state synchronized', async () => {
    const Host = defineComponent({
      setup() {
        const [api, state, values] = useForm<{ user: { name: string } }>();
        return { api, state, values };
      },
      render() {
        return h(
          Form,
          { form: this.api as unknown as FormApi, initValues: { user: { name: 'Semi' } } },
          () => h(Form.Input, { field: 'user.name' }),
        );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await settle();
    const exposed = wrapper.vm as unknown as {
      api: FormApi;
      state: { values: { user: { name: string } } };
      values: { user: { name: string } };
    };
    exposed.api.setValue('user.name', 'Vue');
    await settle();
    expect(wrapper.get('input').element).toHaveProperty('value', 'Vue');
    expect(exposed.values.user.name).toBe('Vue');
    exposed.api.reset();
    await settle();
    expect(exposed.state.values.user.name).toBe('Semi');
  });

  it('supports ArrayField add, insert, remove and external replacement', async () => {
    let api!: FormApi;
    let scope!: {
      add(index?: number): string;
      addWithInitValue(value: unknown, index?: number): void;
      arrayFields: Array<{ field: string; remove(): void }>;
    };
    const wrapper = mount(Form, {
      props: { getFormApi: (value) => (api = value) },
      slots: {
        default: () =>
          h(
            ArrayField,
            { field: 'people', initValue: [{ name: 'A' }] },
            {
              default: (value: ArrayFieldSlotProps) => {
                scope = value;
                return value.arrayFields.map((item, index) =>
                  h(Form.Input, {
                    key: item.field,
                    field: `${item.field}.name`,
                    initValue: index === 1 ? 'fallback' : undefined,
                  }),
                );
              },
            },
          ),
      },
      attachTo: document.body,
    });
    await settle();
    expect(api.getValue('people')).toEqual([{ name: 'A' }]);
    scope.addWithInitValue({ name: 'B' });
    await settle();
    expect(api.getValue('people')).toEqual([{ name: 'A' }, { name: 'B' }]);
    scope.arrayFields[0]!.remove();
    await settle();
    expect(api.getValue('people')).toEqual([{ name: 'B' }]);
    api.setValue('people', [{ name: 'C' }, { name: 'D' }]);
    await settle();
    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(wrapper.findAll('input').map((input) => input.element.value)).toEqual(['C', 'D']);
  });

  it('renders labels, errors and ARIA against the real control', async () => {
    let api!: FormApi;
    const wrapper = mount(Form, {
      props: { getFormApi: (value) => (api = value), showValidateIcon: true },
      slots: {
        default: () =>
          h(Form.Input, {
            field: 'email',
            label: { text: 'Email', optional: true, extra: 'help' },
            helpText: 'hint',
            extraText: 'extra',
            rules: [{ required: true, message: 'required' }],
          }),
      },
      attachTo: document.body,
    });
    await settle();
    const input = wrapper.get('input');
    expect(input.attributes('aria-labelledby')).toBe('email-label');
    expect(input.attributes('aria-describedby')).toBe('email-helpText email-extraText');
    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(wrapper.text()).toContain('（可选）');
    await expect(api.validate()).rejects.toBeTruthy();
    await settle();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-errormessage')).toBe('email-errormessage');
    expect(wrapper.get('.semi-form-field-error-message').classes()).toContain(
      'semi-form-field-help-text',
    );
  });

  it('reserves template and render-function Boolean hosts', () => {
    const disabled = ref(true);
    const TemplateHost = defineComponent({
      components: { Form, FormInput },
      setup: () => ({ disabled }),
      template:
        '<Form disabled><FormInput data-kind="bare" field="bare" disabled /><FormInput data-kind="false" field="false" :disabled="false" /></Form>',
    });
    const RenderHost = defineComponent({
      render: () =>
        h(Form, null, () => [
          h(Form.Input, { field: 'true', disabled: true }),
          h(Form.Input, { field: 'false', disabled: false }),
        ]),
    });
    const template = mount(TemplateHost);
    const render = mount(RenderHost);
    expect(template.get('input[data-kind="bare"]').attributes('disabled')).toBeDefined();
    expect(template.get('input[data-kind="false"]').attributes('disabled')).toBeUndefined();
    expect(render.findAll('input')[0]!.attributes('disabled')).toBeDefined();
    expect(render.findAll('input')[1]!.attributes('disabled')).toBeUndefined();
  });
});
