import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Button from '../button/Button.vue';
import { ConfigProvider } from '../config-provider';
import Upload from './Upload.vue';
import type { UploadExposed, UploadFileItem } from './types';

const successFile: UploadFileItem = {
  uid: 'success',
  name: 'report.pdf',
  size: '1.0KB',
  status: 'success',
};
const failedFile: UploadFileItem = {
  uid: 'failed',
  name: 'broken.png',
  size: '2.0KB',
  status: 'uploadFail',
  preview: true,
  url: 'broken.png',
};

function setInputFiles(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
}

beforeEach(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn((file: File) => `blob:${file.name}`),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => vi.restoreAllMocks());

describe('Upload', () => {
  it('渲染固定 DOM/class/data/style/ARIA 与默认 list 文件卡', () => {
    const wrapper = mount(Upload, {
      attrs: { class: 'attr-upload', 'data-kind': 'documents' },
      props: {
        action: '/upload',
        className: 'named-upload',
        defaultFileList: [successFile],
        style: { width: '360px' },
      },
      slots: { default: () => h(Button, null, () => '选择文件') },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-upload', 'attr-upload', 'named-upload']),
    );
    expect(wrapper.attributes('data-kind')).toBe('documents');
    expect((wrapper.element as HTMLElement).style.width).toBe('360px');
    expect(wrapper.findAll('input[type="file"]')).toHaveLength(2);
    expect(wrapper.get('.semi-upload-add').attributes('role')).toBe('button');
    expect(wrapper.get('[aria-label="file list"]').attributes('role')).toBe('list');
    expect(wrapper.get('.semi-upload-file-card').attributes('role')).toBe('listitem');
    expect(wrapper.text()).toContain('report.pdf');
    expect(wrapper.text()).toContain('已选择文件');
    expect(wrapper.text()).toContain('清空');
  });

  it('模板与 h() 都区分默认真值项的缺省、显式 false 和显式 true', () => {
    // eslint-disable-next-line vue/one-component-per-file -- 本地 host 仅验证 template prop-presence。
    const TemplateHost = defineComponent({
      components: { Upload },
      setup: () => ({ files: [failedFile] }),
      template: `
        <div>
          <Upload action="/a" :default-file-list="files" />
          <Upload action="/b" :default-file-list="files" :show-upload-list="false" :show-clear="false" :show-retry="false" />
          <Upload action="/c" :default-file-list="files" :show-upload-list="true" :show-clear="true" :show-retry="true" />
        </div>
      `,
    });
    const template = mount(TemplateHost);
    const uploads = template.findAllComponents(Upload);
    expect(uploads[0]!.find('.semi-upload-file-list').exists()).toBe(true);
    expect(uploads[1]!.find('.semi-upload-file-list').exists()).toBe(false);
    expect(uploads[2]!.find('.semi-upload-file-list-title-clear').exists()).toBe(true);
    expect(uploads[0]!.find('.semi-upload-file-card-info-retry').exists()).toBe(true);
    expect(uploads[2]!.find('.semi-upload-file-card-info-retry').exists()).toBe(true);

    const renderFalse = mount(Upload, {
      props: {
        action: '/render',
        defaultFileList: [failedFile],
        showUploadList: false,
        showTooltip: false,
      },
    });
    expect(renderFalse.find('.semi-upload-file-list').exists()).toBe(false);
    const renderTrue = mount(Upload, {
      props: { action: '/render', defaultFileList: [failedFile], showUploadList: true },
    });
    expect(renderTrue.find('.semi-upload-file-list').exists()).toBe(true);
  });

  it('选择文件按 fileChange -> change -> progress -> success 顺序走 customRequest', async () => {
    const order: string[] = [];
    const customRequest = vi.fn((payload) => {
      payload.onProgress({ total: 100, loaded: 50 });
      payload.onSuccess({ id: 7 });
    });
    const wrapper = mount(Upload, {
      props: {
        action: '/upload',
        customRequest,
        onFileChange: () => order.push('fileChange'),
        onChange: () => order.push('change'),
        onProgress: () => order.push('progress'),
        onSuccess: () => order.push('success'),
      },
    });
    const input = wrapper.get('.semi-upload-hidden-input').element as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    setInputFiles(input, [file]);
    await wrapper.get('.semi-upload-hidden-input').trigger('change');
    await nextTick();

    expect(customRequest).toHaveBeenCalledTimes(1);
    expect(order[0]).toBe('fileChange');
    expect(order).toEqual(expect.arrayContaining(['change', 'progress', 'success']));
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.text()).toContain('hello.txt');
    expect(wrapper.find('.semi-upload-file-card-fail').exists()).toBe(false);
  });

  it('accept、size 与 limit 保持公开通知和列表规则', async () => {
    const onAcceptInvalid = vi.fn();
    const onSizeError = vi.fn();
    const onExceed = vi.fn();
    const wrapper = mount(Upload, {
      props: {
        accept: '.png,image/jpeg',
        action: '/upload',
        limit: 2,
        maxSize: 1,
        uploadTrigger: 'custom',
        onAcceptInvalid,
        onExceed,
        onSizeError,
      },
    });
    const input = wrapper.get('.semi-upload-hidden-input').element as HTMLInputElement;
    const invalid = new File(['x'], 'note.txt', { type: 'text/plain' });
    const oversized = new File([new Uint8Array(2048)], 'large.png', { type: 'image/png' });
    const accepted = new File(['ok'], 'photo.jpeg', { type: 'image/jpeg' });
    setInputFiles(input, [invalid, oversized, accepted]);
    await wrapper.get('.semi-upload-hidden-input').trigger('change');
    await nextTick();

    expect(onAcceptInvalid).toHaveBeenCalledWith([invalid]);
    expect(onSizeError).toHaveBeenCalledTimes(1);
    expect(onExceed).toHaveBeenCalledTimes(0);
    expect(wrapper.findAll('.semi-upload-file-card')).toHaveLength(2);
    expect(wrapper.find('.semi-upload-file-card-fail').exists()).toBe(true);
  });

  it('受控 fileList/modelValue 只发更新并等待父级回传', async () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload', fileList: [successFile], beforeRemove: () => true },
    });
    await wrapper.get('.semi-upload-file-card-close').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:fileList')?.[0]?.[0]).toEqual([]);
    expect(wrapper.findAll('.semi-upload-file-card')).toHaveLength(1);
    await wrapper.setProps({ fileList: [] });
    expect(wrapper.findAll('.semi-upload-file-card')).toHaveLength(0);

    const model = mount(Upload, { props: { action: '/upload', modelValue: [successFile] } });
    await model.get('.semi-upload-file-card-close').trigger('click');
    expect(model.emitted('update:modelValue')?.[0]?.[0]).toEqual([]);
    expect(model.findAll('.semi-upload-file-card')).toHaveLength(1);
  });

  it('beforeRemove/beforeClear 可拒绝；通过时释放 blob URL 并发出事件', async () => {
    const fileWithBlob = {
      ...successFile,
      fileInstance: new File(['x'], 'x.png', { type: 'image/png' }),
      url: 'blob:x.png',
    };
    const wrapper = mount(Upload, {
      props: {
        action: '/upload',
        defaultFileList: [fileWithBlob],
        beforeRemove: () => false,
        beforeClear: () => false,
      },
    });
    await wrapper.get('.semi-upload-file-card-close').trigger('click');
    await wrapper.get('.semi-upload-file-list-title-clear').trigger('click');
    await nextTick();
    expect(wrapper.findAll('.semi-upload-file-card')).toHaveLength(1);
    expect(wrapper.emitted('remove')).toBeUndefined();
    expect(wrapper.emitted('clear')).toBeUndefined();

    await wrapper.setProps({ beforeRemove: () => true, beforeClear: () => true });
    await wrapper.get('.semi-upload-file-card-close').trigger('click');
    await nextTick();
    expect(wrapper.emitted('remove')).toHaveLength(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:x.png');
  });

  it('拖拽状态、drop、disabled 与 picture hot spot/list 语义对齐', async () => {
    const onDrop = vi.fn();
    const wrapper = mount(Upload, {
      props: {
        action: '/upload',
        draggable: true,
        uploadTrigger: 'custom',
        onDrop,
      },
    });
    const area = wrapper.get('.semi-upload-drag-area');
    await area.trigger('dragenter');
    expect(area.classes()).toContain('semi-upload-drag-area-legal');
    const file = new File(['x'], 'drop.txt', { type: 'text/plain' });
    await area.trigger('drop', { dataTransfer: { files: [file] } });
    expect(onDrop).toHaveBeenCalled();
    expect(wrapper.text()).toContain('drop.txt');

    const disabled = mount(Upload, {
      props: { action: '/upload', disabled: true, draggable: true },
    });
    await disabled.get('.semi-upload-drag-area').trigger('drop', {
      dataTransfer: { files: [file] },
    });
    expect(disabled.find('.semi-upload-file-card').exists()).toBe(false);

    const picture = mount(Upload, {
      props: {
        action: '/upload',
        defaultFileList: [successFile],
        hotSpotLocation: 'start',
        listType: 'picture',
      },
    });
    expect(picture.get('[aria-label="picture list"]').attributes('role')).toBe('list');
    expect(picture.get('.semi-upload-picture-file-card').attributes('role')).toBe('listitem');
    expect(
      picture.get('.semi-upload-file-list-main').element.firstElementChild?.classList,
    ).toContain('semi-upload-picture-add');
  });

  it('crop 对图片逐张排队，保留非图片，并在取消时释放 URL', async () => {
    const toBlob = vi.fn((callback: (blob: Blob | null) => void) =>
      callback(new Blob(['cropped'], { type: 'image/png' })),
    );
    // eslint-disable-next-line vue/one-component-per-file -- 本地 stub 仅暴露裁剪画布契约。
    const CropperStub = defineComponent({
      name: 'Cropper',
      setup(_props, { expose }) {
        expose({ getCropperCanvas: () => ({ toBlob }) });
        return () => h('div', { class: 'cropper-stub' });
      },
    });
    const beforeCrop = vi.fn(() => true);
    const wrapper = mount(Upload, {
      props: {
        action: '/upload',
        beforeCrop,
        crop: true,
        multiple: true,
        uploadTrigger: 'custom',
      },
      global: { stubs: { Cropper: CropperStub, Teleport: true } },
    });
    const first = new File(['a'], 'a.png', { type: 'image/png' });
    const second = new File(['b'], 'b.png', { type: 'image/png' });
    const note = new File(['note'], 'note.txt', { type: 'text/plain' });
    const input = wrapper.get('.semi-upload-hidden-input').element as HTMLInputElement;
    setInputFiles(input, [first, second, note]);
    await wrapper.get('.semi-upload-hidden-input').trigger('change');
    await nextTick();

    expect(beforeCrop).toHaveBeenCalledWith(first, [first, second, note]);
    expect(URL.createObjectURL).toHaveBeenCalledWith(first);
    const modal = wrapper.findComponent({ name: 'Modal' });
    expect(modal.props('visible')).toBe(true);
    await modal.props('onOk')();
    await nextTick();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:a.png');
    expect(URL.createObjectURL).toHaveBeenCalledWith(second);
    await modal.props('onOk')();
    await nextTick();
    expect(wrapper.text()).toContain('a.png');
    expect(wrapper.text()).toContain('b.png');
    expect(wrapper.text()).toContain('note.txt');

    setInputFiles(input, [first]);
    await wrapper.get('.semi-upload-hidden-input').trigger('change');
    await nextTick();
    await wrapper.findComponent({ name: 'Modal' }).props('onCancel')();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:a.png');
  });

  it('函数 render 与 scoped slots 获得 actions，公开方法支持 insert/manual upload/open', async () => {
    const customRequest = vi.fn();
    const renderFileItem = vi.fn((item) =>
      h('button', { class: 'custom-file', onClick: item.onRemove }, item.name),
    );
    const wrapper = mount(Upload, {
      props: {
        action: '/upload',
        defaultFileList: [successFile],
        renderFileItem,
        uploadTrigger: 'custom',
        customRequest,
      },
    });
    expect(wrapper.get('.custom-file').text()).toBe('report.pdf');
    await wrapper.get('.custom-file').trigger('click');
    await nextTick();
    expect(wrapper.find('.custom-file').exists()).toBe(false);

    const exposed = wrapper.vm as unknown as UploadExposed;
    const inserted = new File(['wait'], 'wait.txt', { type: 'text/plain' }) as File & {
      uid?: string;
    };
    exposed.insert([inserted]);
    await nextTick();
    exposed.upload();
    expect(customRequest).toHaveBeenCalledTimes(1);
    const click = vi.spyOn(
      wrapper.get('.semi-upload-hidden-input').element as HTMLInputElement,
      'click',
    );
    exposed.openFileDialog();
    expect(click).toHaveBeenCalled();

    const slotted = mount(Upload, {
      props: { action: '/upload', defaultFileList: [successFile] },
      slots: { fileItem: (item) => h('span', { class: 'slot-file' }, item.name) },
    });
    expect(slotted.get('.slot-file').text()).toBe('report.pdf');
  });

  it('ConfigProvider locale/RTL 与粘贴监听注册清理可观察', async () => {
    const add = vi.spyOn(document.body, 'addEventListener');
    const remove = vi.spyOn(document.body, 'removeEventListener');
    const wrapper = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        locale: {
          code: 'en-US',
          Upload: {
            ...{
              mainText: 'Drop here',
              illegalTips: 'Bad file',
              legalTips: 'Release',
              retry: 'Retry now',
              replace: 'Replace',
              clear: 'Clear all',
              selectedFiles: 'Chosen',
              illegalSize: 'Bad size',
              fail: 'Failed',
              cropTitle: 'Crop',
              cropOk: 'OK',
              cropCancel: 'Cancel',
            },
          },
        },
      },
      slots: {
        default: () =>
          h(Upload, { action: '/upload', addOnPasting: true, defaultFileList: [failedFile] }),
      },
    });
    expect(wrapper.get('.semi-upload').classes()).toContain('semi-rtl');
    expect(wrapper.text()).toContain('Chosen');
    expect(wrapper.text()).toContain('Retry now');
    expect(add).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(add).toHaveBeenCalledWith('paste', expect.any(Function));
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('paste', expect.any(Function));
  });
});
